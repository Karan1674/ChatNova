import React from "react";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div
      className="message-row ai typing-indicator"
      aria-live="polite"
      aria-label="ChatNova is generating a response"
    >

      <div className="msg-avatar ai-avatar ai-avatar-thinking">
        <Sparkles size={15} className="thinking-sparkle" />
      </div>

      <div className="msg-bubble ai-bubble ai-loading-bubble">
        <div className="ai-loading-content">
          <span className="ai-loading-text">ChatNova is thinking</span>

          <div className="typing-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

