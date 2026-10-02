import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const formatMessage = (msg) => {
  const isModel = msg.role === "model" || msg.sender === "ai";
  const text = msg.content || msg.text || "";
  const createdAt = msg.createdAt || new Date().toISOString();
  const timestamp =
    msg.timestamp ||
    new Date(createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return {
    id: msg._id || msg.id || `msg-${Date.now()}-${Math.random()}`,
    _id: msg._id || msg.id,
    sender: isModel ? "ai" : "user",
    role: isModel ? "model" : "user",
    text,
    content: text,
    timestamp,
    createdAt,
  };
};

const handleAxiosError = (err, fallbackMsg) =>
  err.response?.data?.message || fallbackMsg;

export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/chat/get-chats");
      return (response.data.chats || []).map((chat) => ({
        ...chat,
        id: chat._id,
      }));
    } catch (err) {
      return rejectWithValue(
        handleAxiosError(err, "Failed to load conversations"),
      );
    }
  },
);

export const createChat = createAsyncThunk("chat/createChat", async ({ title } = {}, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/chat/create-chat", {
        title: title || "New Chat",
      });
      const chat = response.data.chat;
      return { ...chat, id: chat._id };
    } catch (err) {
      return rejectWithValue(handleAxiosError(err, "Failed to create chat"));
    }
  },
);

export const fetchChatMessages = createAsyncThunk("chat/fetchChatMessages", async (chatId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/chat/${chatId}/get-messages`);
      return {
        chatId,
        messages: (response.data.messages || []).map(formatMessage),
      };
    } catch (err) {
      return rejectWithValue(handleAxiosError(err, "Failed to load messages"));
    }
  },
);

export const renameChat = createAsyncThunk("chat/renameChat", async ({ chatId, title }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/chat/rename/${chatId}`, { title });
      return {
        chatId,
        title: response.data.chat?.title || title,
      };
    } catch (err) {
      return rejectWithValue(handleAxiosError(err, "Failed to rename chat"));
    }
  },
);

export const deleteChat = createAsyncThunk("chat/deleteChat", async (chatId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/chat/delete/${chatId}`);
      return chatId;
    } catch (err) {
      return rejectWithValue(handleAxiosError(err, "Failed to delete chat"));
    }
  },
);

const initialState = {
  chats: [],
  activeChatId: null,
  messages: {},
  isGenerating: {},
  isLoadingChats: false,
  isLoadingMessages: false,
  error: null,
  hasLoadedChats: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!chatId) return;

      state.messages[chatId] = state.messages[chatId] || [];
      state.messages[chatId].push(formatMessage(message));
    },
    receiveAiResponse: (state, action) => {
      const { chatId, content } = action.payload;
      if (!chatId) return;

      state.messages[chatId] = state.messages[chatId] || [];
      state.messages[chatId].push(
        formatMessage({ role: "model", sender: "ai", content }),
      );
      
        state.isGenerating[chatId] = false;
    },
    setIsGenerating: (state, action) => {
  const { chatId, value } = action.payload;

  if (!chatId) return;

  state.isGenerating[chatId] = value;
},
    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoadingChats = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoadingChats = false;
        state.chats = action.payload;

        const isFirstChatLoad = !state.hasLoadedChats;

        state.hasLoadedChats = true;

        if (isFirstChatLoad && action.payload.length > 0) {
          state.activeChatId = action.payload[0].id;
        }
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoadingChats = false;
        state.error = action.payload;
      })

      .addCase(createChat.fulfilled, (state, action) => {
        const newChat = action.payload;
        if (!state.chats.some((c) => c.id === newChat.id)) {
          state.chats.unshift(newChat);
        }
        state.activeChatId = newChat.id;
        state.messages[newChat.id] = state.messages[newChat.id] || [];
      })

      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload;
      })

      .addCase(renameChat.fulfilled, (state, action) => {
        const { chatId, title } = action.payload;
        const chat = state.chats.find(
          (c) => c.id === chatId || c._id === chatId,
        );
        if (chat) chat.title = title;
      })

      .addCase(deleteChat.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.chats = state.chats.filter(
          (c) => c.id !== deletedId && c._id !== deletedId,
        );
        delete state.messages[deletedId];

        if (state.activeChatId === deletedId) {
          state.activeChatId = state.chats[0]?.id || null;
        }
      });
  },
});

export const {
  setActiveChatId,
  addMessage,
  receiveAiResponse,
  setIsGenerating,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
