import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Trash2,
  PanelLeft,
  SquarePen,
  Home,
  LogOut,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

export default function Header({
  onDeleteSessionClick,
  onNewChat,
  sidebarOpen,
  setSidebarOpen,
  activeSession,
  onRenameSession,
  onNavigateHome,
  user,
  onLogout,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(activeSession?.title || "");

  const profileRef = useRef(null);
  const optionsRef = useRef(null);
  const titleInputRef = useRef(null);

  // Sync state if activeSessionTitle changes externally
  useEffect(() => {
    setNewTitle(activeSession?.title || "");
  }, [activeSession?.title]);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOptionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveRename = () => {
    const trimmed = newTitle.trim();
    if (trimmed && trimmed !== activeSession?.title && onRenameSession) {
      onRenameSession(activeSession.id, trimmed);
    } else {
      setNewTitle(activeSession?.title || "");
    }
    setIsEditingTitle(false);
  };

  const handleKeyDownRename = (e, sessionId) => {
    if (e.key === "Enter") handleSaveRename(sessionId);
    if (e.key === "Escape") setIsEditingTitle(false);
  };

  return (
    <header className="header">
      <div className="header-desktop-layout">
        <div className="desktop-title-wrapper">
          {isEditingTitle ? (
            <div className="rename-input-container">
              <input
                ref={titleInputRef}
                type="text"
                className="rename-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => handleSaveRename(activeSession.id)}
                onKeyDown={(e) => handleKeyDownRename(e, activeSession.id)}
              />
            </div>
          ) : (
            <span
              className="session-title"
              title={activeSession?.title || "New Chat"}
            >
              {activeSession?.title || "New Chat"}
            </span>
          )}
        </div>

        {activeSession?.id && (
          <div className="options-wrapper" ref={optionsRef}>
            <button
              className="icon-btn"
              onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
              title="Chat options"
              aria-label="Chat options"
              aria-expanded={optionsMenuOpen}
            >
              <MoreHorizontal size={18} />
            </button>

            {optionsMenuOpen && (
              <div className="profile-dropdown glass-panel options-dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    setIsEditingTitle(true);
                  }}
                >
                  <Pencil size={15} />
                  <span>Rename chat</span>
                </button>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    if (onDeleteSessionClick)
                      onDeleteSessionClick(activeSession);
                  }}
                >
                  <Trash2 size={15} />
                  <span>Delete chat</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="header-mobile-layout">
        <div className="header-left">
          <button
            className="icon-btn sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-label="Toggle sidebar"
          >
            <PanelLeft size={19} />
          </button>

          <div
            className="header-brand"
            onClick={onNavigateHome}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon">
              <Sparkles size={16} />
            </div>
            <span className="brand-text">ChatNova</span>
          </div>

          <button
            className="icon-btn new-chat-icon-btn"
            onClick={onNewChat}
            title="New chat"
            aria-label="New chat"
          >
            <SquarePen size={18} />
          </button>
        </div>

        <div className="header-center">
          {activeSession?.title && (
            <span className="session-title" title={activeSession?.title}>
              {activeSession?.title}
            </span>
          )}
        </div>

        <div className="header-right">
          <button
            className="icon-btn"
            onClick={onNavigateHome}
            title="Return to Product Showcase"
            aria-label="Product Showcase"
          >
            <Home size={17} />
          </button>

          <div className="profile-wrapper" ref={profileRef}>
            <button
              className="avatar-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              title="Account"
              aria-label="User profile menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="avatar-circle">
                {user?.fullName?.firstName
                  ? user.fullName.firstName[0].toUpperCase()
                  : "U"}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown glass-panel">
                <div className="profile-header">
                  <div className="profile-name">
                    {user?.fullName?.firstName
                      ? `${user.fullName.firstName} ${user.fullName.lastName || ""}`.trim()
                      : "ChatNova User"}
                  </div>
                  <div className="profile-email">
                    {user?.email || "user@chatnova.ai"}
                  </div>
                </div>

                <div className="dropdown-divider" />

                {/* <button 
                  className="dropdown-item"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigateHome();
                  }}
                >
                  <Home size={15} />
                  <span>Showcase Home</span>
                </button> */}

                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
