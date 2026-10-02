import React, { useState } from 'react';
import {  Sparkles,  ArrowRight,  Play,  Cpu,  Zap,  ShieldCheck } from 'lucide-react';


export default function HeroSection({ onNavigate, user }) {


  return (
    <section className="hero-section">
      <div className="ambient-glow-top"></div>
      <div className="ambient-grid"></div>

      <div className="hero-content">

        <div className="badge-pill hero-badge">
          <Sparkles size={14} className="sparkle-spin" />
          <span>Introducing ChatNova --&gt; Ultra-Low Latency AI</span>
       
        </div>

        <h1 className="hero-headline">
          Intelligence Automated.<br />
          <span className="text-gradient">Conversations Perfected.</span>
        </h1>

        <p className="hero-subtext">
          The next-generation AI workspace engineered for developers, builders, and high-velocity teams.
          Supercharge your workflow with persistent neural memory, real-time code synthesis, and intelligent automations.
        </p>

        <div className="hero-cta-group">
          <button 
            className="glow-btn hero-primary-btn"
            onClick={() => onNavigate(user ? 'chat' : 'signup')}
          >
            <span>{user ? 'Go to Workspace' : 'Start Free Trial'}</span>
            <ArrowRight size={18} />
          </button>
          
          <button 
            className="hero-secondary-btn"
            onClick={() => {
              const demoElement = document.getElementById('interactive-demo');
              if (demoElement) demoElement.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Play size={16} className="play-icon" />
            <span>Watch Live Demo</span>
          </button>
        </div>

        <div className="hero-quick-stats">
          <div className="quick-stat-item">
            <Zap size={15} className="stat-icon cyan" />
            <span>&lt;85ms First Token</span>
          </div>
          <div className="quick-stat-dot"></div>
          <div className="quick-stat-item">
            <Cpu size={15} className="stat-icon purple" />
            <span>Neural Vector Memory</span>
          </div>
          <div className="quick-stat-dot"></div>
          <div className="quick-stat-item">
            <ShieldCheck size={15} className="stat-icon emerald" />
            <span>Zero Data Training</span>
          </div>
        </div>
      </div>
    </section>
  );
}
