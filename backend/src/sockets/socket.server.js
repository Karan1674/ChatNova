const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      allowedHeaders: ["content-type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.chatNovaToken) {
      return next(new Error("Authenication Error: No Token Provided"));
    }

    try {
      const decorded = jwt.verify(
        cookies.chatNovaToken,
        process.env.JWT_SECRET,
      );

      const user = await userModel.findById(decorded.id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authenication Error: Invalid Token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.email}`);

    socket.on("ai-message", async (messagePayload) => {
      try {
        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: messagePayload.content,
            role: "user",
          }),
          aiService.generateVectos(messagePayload.content),
        ]);

        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        });

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
              user: socket.user._id,
            },
          }),
          messageModel
            .find({ chat: messagePayload.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
            .then((messages) => messages.reverse()),
        ]);

        const shortTermMemory = chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        });

        const longTermMemory = [
          {
            role: "user",
            parts: [
              {
                text: `
                        These are  the previous conversations with the user. Use this information to provide better responses.
                        ${memory.map((item) => item.metadata.text).join("\n")}
                        `,
              },
            ],
          },
        ];

        const response = await aiService.generateResponse([
          ...longTermMemory,
          ...shortTermMemory,
        ]);

        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });

        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: response,
            role: "model",
          }),
          aiService.generateVectos(response),
        ]);

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: response,
          },
        });
      } catch (err) {
        console.error("AI message error:", err);

        socket.emit("ai-error", {
          chat: messagePayload.chat,
          message: "AI service is temporarily unavailable. Please try again.",
        });
      }
    });
  });
}

module.exports = initSocketServer;
