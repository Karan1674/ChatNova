import React from "react";
// import { Sparkles, ArrowRight,  CheckCircle2,   Code2, MessageCircle, BriefcaseBusiness } from 'lucide-react';
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CtaBannerAndFooter({ onNavigate, user }) {
  return (
    <div className="cta-footer-wrapper">
      <div className="cta-banner-container">
        <div className="cta-glow-box glass-panel">
          <div className="cta-content">
            <div className="badge-pill cta-badge">
              <Sparkles size={14} />
              <span>Unlock 10x Velocity</span>
            </div>

            <h2 className="cta-headline">
              Ready to Experience the Future of{" "}
              <span className="text-gradient">AI Automation</span>?
            </h2>

            <p className="cta-subtext">
              Join forward-thinking engineers and product teams using ChatNova
              to accelerate system architectures, coding, and decision making.
            </p>

            <div className="cta-buttons-cluster">
              <button
                className="glow-btn cta-primary-btn"
                onClick={() => onNavigate(user ? "chat" : "signup")}
              >
                <span>
                  {user ? "Open Workspace" : "Get Started In Seconds"}
                </span>
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="cta-perks-row">
              <div className="perk-item">
                <CheckCircle2 size={15} className="perk-check" />
                <span>Free 14-day trial</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={15} className="perk-check" />
                <span>No credit card required</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={15} className="perk-check" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <footer className="landing-footer">
        <div className="footer-top-grid">

          <div className="footer-brand-col">
            <div
              className="footer-brand-logo"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="brand-icon-box">
                <Sparkles size={17} className="brand-sparkle" />
              </div>
              <span className="brand-name">
                Chat<span className="brand-accent">Nova</span>
              </span>
            </div>
            <p className="footer-brand-tagline">
              The high-performance AI workspace with persistent neural memory
              and real-time streaming intelligence.
            </p>
            <div className="status-indicator-pill">
              <span className="status-dot-pulse"></span>
              <span>All Systems Operational (18ms)</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">PRODUCT</h4>
            <a href="#features" className="footer-link">
              Features
            </a>
            <a href="#how-it-works" className="footer-link">
              Workflow
            </a>
            <a href="#pricing" className="footer-link">
              Pricing
            </a>
            <a href="#faq" className="footer-link">
              FAQ
            </a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">AI CAPABILITIES</h4>
            <span className="footer-link-static">Smart Conversations</span>
            <span className="footer-link-static">Code Assistance</span>
            <span className="footer-link-static">Creative Writing</span>
            <span className="footer-link-static">Knowledge &amp; Research</span>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">RESOURCES</h4>
            <span className="footer-link-static">Documentation</span>
            <span className="footer-link-static">Privacy Policy</span>
            <span className="footer-link-static">Terms of Service</span>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} ChatNova Technologies Inc. All rights
            reserved.
          </p>

          {/* <div className="footer-social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub">
              <Code2 size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
              <MessageCircle size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <BriefcaseBusiness size={18} />
            </a>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
