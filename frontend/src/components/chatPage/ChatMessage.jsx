import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { useToast } from '../toast/ToastContext';
import FormattedMessage from './FormattedMessage';


export default function ChatMessage({ message }) {
  const toast = useToast();
  const isAI = message.sender === 'ai' || message.role === 'model';
  const messageText = message.content || message.text || '';
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [reaction, setReaction] = useState(null);



  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    toast.success("Message copied to clipboard");
    setTimeout(() => setCopiedMsg(false), 2000);
  };


  return (
    <div className={`message-row ${isAI ? 'ai' : 'user'}`}>

      {isAI && (
        <div className="msg-avatar ai-avatar">
          <Sparkles size={16} />
        </div>
      )}

      <div className={`msg-bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`}>
        <div className="msg-content">
          <FormattedMessage 
            text={messageText} 
            onCopyToast={() => toast.success("Code copied to clipboard")} 
          />
        </div>

        {isAI && (
          <div className="msg-actions-bar">
            <button 
              className={`action-pill ${copiedMsg ? 'active' : ''}`} 
              onClick={() => handleCopyText(messageText)}
              title="Copy message"
            >
              {copiedMsg ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedMsg ? 'Copied' : 'Copy'}</span>
            </button>

            <button 
              className={`action-pill ${reaction === 'like' ? 'active-like' : ''}`} 
              onClick={() => {
                const next = reaction === 'like' ? null : 'like';
                setReaction(next);
                if (next) toast.success("Feedback recorded: Helpful!");
              }}
              title="Helpful response"
            >
              <ThumbsUp size={13} />
            </button>

            <button 
              className={`action-pill ${reaction === 'dislike' ? 'active-dislike' : ''}`} 
              onClick={() => {
                const next = reaction === 'dislike' ? null : 'dislike';
                setReaction(next);
                if (next) toast.info("Feedback recorded: Unhelpful");
              }}
              title="Unhelpful response"
            >
              <ThumbsDown size={13} />
            </button>

            <button 
              className="action-pill" 
              onClick={() => toast.info("Retry option will be available soon.")}
              title="Regenerate response"
            >
              <RotateCcw size={13} />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>

      {!isAI && (
        <div className="msg-avatar user-avatar">
          <User size={16} />
        </div>
      )}
    </div>
  );
}
