import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { useToast } from "../toast/ToastContext";

export default function ChatInput({ onSendMessage, isGenerating }) {
  const toast = useToast();
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);
  useEffect(() => {
    if (!isGenerating && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isGenerating]);

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    toast.info("Attachment support is not ready for file & document analysis.");
  };

  const canSend = inputText.trim().length > 0 && !isGenerating;

  return (
    <div className="input-wrapper">
      <div className="input-dock glass-panel">
        <button
          type="button"
          className="attach-btn"
          title="Attach file or code"
          onClick={handleAttachClick}
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Message ChatNova... (Enter to send, Shift+Enter for new line)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isGenerating}
        />

        <button
          type="button"
          className={`send-btn ${canSend ? "active" : ""}`}
          onClick={handleSend}
          disabled={!canSend}
          title="Send message"
          aria-label="Send message"
        >
          <ArrowUp size={18} strokeWidth={2.4} />
        </button>
      </div>

      <div className="disclaimer-text">
        ChatNova can make mistakes. Verify important information.
      </div>
    </div>
  );
}
