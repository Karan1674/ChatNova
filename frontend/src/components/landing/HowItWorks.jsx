import React from "react";
import { UserPlus, MessageSquareCode, Sparkles, ArrowRight} from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserPlus,
    title: "Authenticate & Link Workspace",
    description:
      "Create your account in seconds with zero friction. Connect your preferred workflow or launch our web studio instantly.",
    accent: "indigo",
  },
  {
    step: "02",
    icon: MessageSquareCode,
    title: "Prompt, Ingest & Collaborate",
    description:
      "Ask deep architectural questions, paste complex code snippets, or request full refactorings with natural conversation.",
    accent: "cyan",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Continuous Neural Memory",
    description:
      "ChatNova retains project context across sessions, learning your preferences and coding style with each interaction.",
    accent: "purple",
  },
];

export default function HowItWorks({ onNavigate, user }) {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-header-cluster">
        <div className="badge-pill">
          <span>Seamless Workflow</span>
        </div>
        <h2 className="section-title">
          Three Steps to{" "}
          <span className="text-gradient">Peak Productivity</span>
        </h2>
        <p className="section-subtitle">
          Designed to be frictionless from your very first prompt to complex
          enterprise automation.
        </p>
      </div>

      <div className="steps-container">
        {STEPS.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="step-card glass-panel">
              <div className="step-top-row">
                <div className={`step-icon-box ${item.accent}`}>
                  <IconComponent size={22} />
                </div>
                <span className="step-number">{item.step}</span>
              </div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-description">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="how-cta-center">
        <button
          className="glow-btn how-start-btn"
          onClick={() => onNavigate(user ? "chat" : "signup")}
        >
          <span>{user ? "Launch Workspace" : "Get Started In 30 Seconds"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
