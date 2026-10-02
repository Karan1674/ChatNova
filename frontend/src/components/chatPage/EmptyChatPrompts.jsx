import React from "react";

export default function EmptyChatPrompts({ onPromptClick, user }) {
  const prompts = [
    {
      icon: "💡",
      title: "Help me brainstorm",
      description: "Ideas for a project, business, trip, or anything else",
      prompt:
        "Help me brainstorm some creative ideas for something I want to work on.",
    },
    {
      icon: "📚",
      title: "Teach me something",
      description: "Learn a topic in a simple and understandable way",
      prompt:
        "Teach me something interesting today and explain it in a simple way.",
    },
    {
      icon: "✍️",
      title: "Help me write",
      description: "Create, rewrite, or improve something",
      prompt:
        "Help me write something. Ask me what I want to write and who it is for.",
    },
    {
      icon: "🗺️",
      title: "Plan something",
      description: "Trips, schedules, goals, events, and more",
      prompt:
        "Help me plan something. Ask me what I want to plan and create a practical plan for me.",
    },
  ];

  return (
    <div className="empty-chat-state">
      <h2 className="empty-chat-greeting">
        {user?.fullName?.firstName
          ? `Welcome, ${user.fullName.firstName}!`
          : "Good day! How can ChatNova help?"}
      </h2>
      <p className="empty-chat-sub">
        Ask anything, explore an idea, or get help with something you're working
        on.
      </p>
      <div className="prompt-cards-grid">
        {prompts.map((item) => (
          <div
            key={item.title}
            className="prompt-card glass-panel"
            onClick={() => onPromptClick(item.title, item.prompt)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onPromptClick(item.title, item.prompt);
              }
            }}
          >
            <div className="card-icon">{item.icon}</div>

            <div className="card-title">{item.title}</div>

            <div className="card-sub">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
