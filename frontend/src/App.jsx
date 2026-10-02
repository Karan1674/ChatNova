import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LandingPage from "./components/landing/LandingPage";
import AuthModal from "./components/auth/AuthModal";
import Header from "./components/chatPage/Header";
import Sidebar from "./components/chatPage/Sidebar";
import ChatMessage from "./components/chatPage/ChatMessage";
import ChatInput from "./components/chatPage/ChatInput";
import TypingIndicator from "./components/chatPage/TypingIndicator";
import ConfirmModal from "./components/chatPage/ConfirmModal";
import EmptyChatPrompts from "./components/chatPage/EmptyChatPrompts";
import { useToast } from "./components/toast/ToastContext";
import {
  fetchChats,
  createChat,
  fetchChatMessages,
  renameChat,
  deleteChat,
  setActiveChatId,
  addMessage,
  setIsGenerating,
  clearChatState,
} from "./store/slices/chatSlice";
import { logoutUser, setUser, getCurrentUser } from "./store/slices/authSlice";
import { initSocket, sendAiMessage, disconnectSocket } from "./services/socket";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

export default function App() {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  // const isAuthInitialized = useSelector((state) => state.auth.isInitialized);
  const { chats, activeChatId, messages, isGenerating, isLoadingMessages } =
    useSelector((state) => state.chat);
  const currentChatIsGenerating = !!isGenerating[activeChatId];
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 768 : true,
  );

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    confirmText: "Delete",
    targetSession: null,
  });
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      initSocket(dispatch, (message) => {
        toast.error(message);
      });
      dispatch(fetchChats());
    } else {
      disconnectSocket();
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (activeChatId && !messages[activeChatId]) {
      dispatch(fetchChatMessages(activeChatId));
    }
  }, [activeChatId, messages, dispatch]);

  const handleNavigate = (view) => {
    if (view === "login") {
      setAuthModal({ isOpen: true, mode: "login" });
    } else if (view === "signup") {
      setAuthModal({ isOpen: true, mode: "signup" });
    } else if (view === "chat") {
      navigate("/chat");
    } else if (view === "landing") {
      navigate("/");
    }
  };

  const handleAuthSuccess = (authenticatedUser) => {
    dispatch(setUser(authenticatedUser));
    setAuthModal({ isOpen: false, mode: "login" });
    navigate("/chat");
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {}
    dispatch(clearChatState());
    disconnectSocket();
    toast.info("You have signed out.");
    navigate("/");
  };

  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];
  const currentSession =
    chats.find((s) => s.id === activeChatId || s._id === activeChatId) || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, currentChatIsGenerating]);

  const handleSelectSession = (sessionId) => {
    dispatch(setActiveChatId(sessionId));
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = async (text, sessionId = activeChatId) => {
    if (sessionId && isGenerating[sessionId]) return;

    let targetChatId = sessionId;

    if (!targetChatId) {
      const chatTitle = text.length > 28 ? `${text.slice(0, 28)}...` : text;
      try {
        const created = await dispatch(
          createChat({ title: chatTitle }),
        ).unwrap();
        targetChatId = created.id || created._id;
        console.log("created	targetChatId success", targetChatId);
      } catch (err) {
        console.error("Failed to create chat:", err);
        toast.error("Failed to initialize conversation.");
        return;
      }
    }

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user",
      role: "user",
      text: text.trim(),
      content: text.trim(),
      timestamp: timeString,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage({ chatId: targetChatId, message: userMsg }));
    dispatch(setIsGenerating({ chatId: targetChatId, value: true }));
    const sent = sendAiMessage({
      chat: targetChatId,
      content: text.trim(),
    });

    if (!sent) {
      const newSock = initSocket(dispatch, (message) => {
        toast.error(message);
      });
      if (newSock) {
        setTimeout(() => {
          const retrySent = sendAiMessage({
            chat: targetChatId,
            content: text.trim(),
          });
          if (!retrySent) {
            toast.error(
              "Unable to connect to AI server. Please refresh or try again.",
            );
            dispatch(setIsGenerating({ chatId: targetChatId, value: false }));
          }
        }, 300);
      } else {
        toast.error("Socket not connected.");
        dispatch(setIsGenerating({ chatId: targetChatId, value: false }));
      }
    }
  };

  const handleNewChat = () => {
    dispatch(setActiveChatId(null));
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    toast.success("Ready for a new conversation.");
  };

  const handlePromptCardClick = async (title, prompt) => {
    let targetId = activeChatId;
    const activeMsgs = activeChatId ? messages[activeChatId] || [] : [];

    if (!targetId || activeMsgs.length > 0) {
      try {
        const created = await dispatch(createChat({ title })).unwrap();
        console.log("created", created);
        targetId = created.id || created._id;
        console.log("targetId", targetId);
      } catch (err) {
        console.error("Failed to create chat from prompt:", err);
        toast.error("Failed to start new conversation.");
        return;
      }
    } else {
      dispatch(renameChat({ chatId: targetId, title }));
    }

    dispatch(setActiveChatId(targetId));
    handleSendMessage(prompt, targetId);
  };

  const handleOpenDeleteSessionModal = (session) => {
    setModalConfig({
      isOpen: true,
      type: "delete_session",
      title: "Delete Conversation?",
      message: `Are you sure you want to delete "${session.title}"? All chat history in this session will be permanently removed.`,
      confirmText: "Delete",
      targetSession: session,
    });
  };

  const handleConfirmModal = async () => {
    if (modalConfig.type === "delete_session" && modalConfig.targetSession) {
      const targetId =
        modalConfig.targetSession.id || modalConfig.targetSession._id;

      try {
        setIsDeletingSession(true);
        await dispatch(deleteChat(targetId)).unwrap();
        toast.info("Conversation deleted.");
        handleCloseModal();
      } catch (error) {
        toast.error("Failed to delete conversation.");
        console.error("Delete Error:", error);
      } finally {
        setIsDeletingSession(false);
      }
    } else {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setModalConfig({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      targetSession: null,
    });
  };

  const handleRenameSession = async (sessionId, newTitle) => {
    if (!newTitle.trim()) return;

    try {
      await dispatch(
        renameChat({ chatId: sessionId, title: newTitle.trim() }),
      ).unwrap();
      toast.success("Conversation renamed.");
    } catch (error) {
      toast.error("Failed to rename conversation.");
      console.error("Rename Error:", error);
    }
  };

  return (
    <div className="chatnova-app-container">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onNavigate={handleNavigate}
              user={user}
              onLogout={handleLogout}
            />
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/chat"
            element={
              <div className="app-layout">
                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  onOpen={() => setSidebarOpen(true)}
                  sessions={chats}
                  activeSessionId={activeChatId}
                  onSelectSession={handleSelectSession}
                  onNewChat={handleNewChat}
                  onDeleteSessionClick={handleOpenDeleteSessionModal}
                  onRenameSession={handleRenameSession}
                  onNavigateHome={() => navigate("/")}
                  user={user}
                  onLogout={handleLogout}
                />

                <div className="main-chat-wrapper">
                  <Header
                    onDeleteSessionClick={handleOpenDeleteSessionModal}
                    onNewChat={handleNewChat}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeSession={currentSession}
                    onRenameSession={handleRenameSession}
                    onNavigateHome={() => navigate("/")}
                    user={user}
                    onLogout={handleLogout}
                  />

                  <main className="messages-scroll-area">
                    <div className="messages-container">
                      {!activeChatId ? (
                        <EmptyChatPrompts
                          onPromptClick={handlePromptCardClick}
                          user={user}
                        />
                      ) : isLoadingMessages ? (
                        <div className="messages-loading">
                          <div className="loading-content">
                            <div className="loading-spinner"></div>
                            <span>Loading conversation...</span>
                          </div>
                        </div>
                      ) : currentMessages.length === 0 ? (
                        <EmptyChatPrompts
                          onPromptClick={handlePromptCardClick}
                          user={user}
                        />
                      ) : (
                        <>
                          {currentMessages.map((msg) => (
                            <ChatMessage
                              key={msg.id || msg._id}
                              message={msg}
                            />
                          ))}

                          {currentChatIsGenerating && <TypingIndicator />}
                        </>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </main>

                  <footer className="chat-footer">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      isGenerating={currentChatIsGenerating}
                    />
                  </footer>
                </div>
              </div>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: "login" })}
        onAuthSuccess={handleAuthSuccess}
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        onConfirm={handleConfirmModal}
        onCancel={handleCloseModal}
        isLoading={isDeletingSession}
      />
    </div>
  );
}
