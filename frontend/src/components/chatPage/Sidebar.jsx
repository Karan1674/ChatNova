import React, { useState, useRef, useEffect } from 'react';
import { SquarePen, MessageSquare, Trash2, Search, Sparkles, Home, LogOut, PanelLeftClose ,PanelLeft,MoreVertical,Edit2} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, onOpen, sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSessionClick, onRenameSession,onNavigateHome, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const menuRef = useRef(null);

  const filteredSessions = sessions.filter((s) =>
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartRename = (session, e) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitle(session.title || '');
    setActiveMenuId(null);
  };

  const handleSaveRename = (sessionId) => {
    if (editTitle.trim() && onRenameSession) {
      onRenameSession(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleKeyDownRename = (e, sessionId) => {
    if (e.key === 'Enter') handleSaveRename(sessionId);
    if (e.key === 'Escape') setEditingSessionId(null);
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : 'mini'}`}>
        {!isOpen ? (
          <div className="sidebar-mini-content">
            <div 
              className="brand-icon mini-brand" 
              onClick={onNavigateHome}
              title="ChatNova Home"
            >
              <Sparkles size={18} />
            </div>

            <div className="mini-actions">
  
              <button 
                className="mini-icon-btn" 
                onClick={onOpen}
                title="Expand sidebar"
              >
                <PanelLeft size={18} />
              </button>


              <button 
                className="mini-icon-btn" 
                onClick={() => { onNewChat(); }}
                title="New chat"
              >
                <SquarePen size={18} />
              </button>


              <button 
                className="mini-icon-btn" 
                onClick={onOpen}
                title="Search chats"
              >
                <Search size={18} />
              </button>
            </div>

            <div className="mini-footer">
              <div 
                className="user-avatar mini-avatar"
                onClick={onclose}
                title={user?.fullName?.firstName || 'User Profile'}
              >
                {user?.fullName?.firstName ? user.fullName.firstName[0].toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        ) : (

          <div className="sidebar-full-content">

            <div className="sidebar-top-bar">
              <div 
                className="sidebar-brand" 
                onClick={onNavigateHome}
                title="ChatNova Home"
                role="button"
                tabIndex={0}
              >
                <div className="brand-icon">
                  <Sparkles size={16} />
                </div>
                <span className="brand-title">ChatNova</span>
              </div>

              <button 
                className="icon-btn sidebar-collapse-btn" 
                onClick={onClose}
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <PanelLeft size={18} />
              </button>
            </div>


            <div className="sidebar-actions">
              <button 
                className="new-chat-btn" 
                onClick={onNewChat}
                title="Start fresh conversation"
              >
                <div className="btn-content">
                  <SquarePen size={16} />
                  <span>New chat</span>
                </div>
    
              </button>
            </div>


            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search conversations"
              />
            </div>

 
            <div className="history-section">
              <div className="section-header">
                <span className="section-label">Your chats</span>
                {filteredSessions.length > 0 && (
                  <span className="count-badge">{filteredSessions.length}</span>
                )}
              </div>

              <div className="session-scroll-list">
                {filteredSessions.length === 0 ? (
                  <div className="empty-chats">
                    <span>{searchQuery ? 'No matching chats found' : 'No chats yet'}</span>
                  </div>
                ) : (
                  filteredSessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const isEditing = editingSessionId === session.id;

                    return (
                      <div
                        key={session.id}
                        className={`session-item ${isActive ? 'active' : ''}`}
                      >
                        <button
                          className="session-link-btn"
                          onClick={() => onSelectSession(session.id)}
                          title={session.title}
                        >
                          <MessageSquare size={15} className="session-msg-icon" />
                          
                          {isEditing ? (
                            <input
                              type="text"
                              className="session-rename-input"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleSaveRename(session.id)}
                              onKeyDown={(e) => handleKeyDownRename(e, session.id)}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="session-text">{session.title || 'Untitled chat'}</span>
                          )}
                        </button>


                        <div className="session-menu-wrapper" ref={activeMenuId === session.id ? menuRef : null}>
                          <button
                            className="session-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === session.id ? null : session.id);
                            }}
                            title="More options"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeMenuId === session.id && (
                            <div className="dropdown-menu">
                              <button
                                className="dropdown-item"
                                onClick={(e) => handleStartRename(session, e)}
                              >
                                <Edit2 size={13} />
                                <span>Rename</span>
                              </button>
                              <button
                                className="dropdown-item danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  onDeleteSessionClick(session);
                                }}
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="sidebar-user-dock">
              <div className="user-details" >
                <div className="user-avatar">
                  {user?.fullName?.firstName ? user.fullName.firstName[0].toUpperCase() : 'U'}
                </div>
                <div className="user-meta">
                  <span className="user-display-name">
                    {user?.fullName?.firstName 
                      ? `${user.fullName.firstName} ${user.fullName.lastName || ''}`.trim() 
                      : 'ChatNova User'}
                  </span>
                  <span className="user-badge">Free Plan</span>
                </div>
              </div>

              <div className="user-dock-buttons">
                <button 
                  className="icon-btn dock-btn"
                  onClick={onNavigateHome}
                  title="Showcase Home"
                >
                  <Home size={15} />
                </button>
                <button 
                  className="icon-btn dock-btn danger"
                  onClick={onLogout}
                  title="Log out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}