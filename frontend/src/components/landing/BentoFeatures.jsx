import React from 'react';
import {  Database,  Zap,  Code,  Cpu,  ShieldCheck,  Sparkles,  CheckCircle2} from 'lucide-react';

export default function BentoFeatures() {
  return (
    <section className="bento-section" id="features">
      <div className="section-header-cluster">
        <div className="badge-pill">
          <Sparkles size={14} />
          <span>Core Capabilities</span>
        </div>
        <h2 className="section-title">
          Engineered for <span className="text-gradient">Limitless Velocity</span>
        </h2>
        <p className="section-subtitle">
          Every layer of ChatNova is architected from the ground up for speed, deep context understanding, and seamless development workflows.
        </p>
      </div>

      <div className="bento-grid">
        <div className="bento-card bento-large glass-panel">
          <div className="bento-ambient-glow indigo-glow"></div>
          <div className="bento-content">
            <div className="bento-icon-wrapper indigo-bg">
              <Database size={22} className="bento-icon indigo-text" />
            </div>
            <span className="bento-tag">Persistent Knowledge</span>
            <h3 className="bento-heading">Neural Vector Memory &amp; Semantic Recall</h3>
            <p className="bento-desc">
              Never repeat yourself. ChatNova indexes project files, previous discussions, and personal conventions into an isolated vector memory space for automatic context injection.
            </p>
            
            <div className="vector-viz-box">
              <div className="vector-node user-node">
                <span className="node-dot"></span>
                <span>User Input: "Refactor auth middleware"</span>
              </div>
              <div className="vector-arrow">↓ 98.4% Semantic Proximity</div>
              <div className="vector-node memory-node">
                <span className="node-dot green"></span>
                <span>Matched Memory: JWT Token Schema &amp; Cookie Store (Session #14)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card bento-medium glass-panel">
          <div className="bento-ambient-glow cyan-glow"></div>
          <div className="bento-content">
            <div className="bento-icon-wrapper cyan-bg">
              <Zap size={22} className="bento-icon cyan-text" />
            </div>
            <span className="bento-tag">Sub-100ms</span>
            <h3 className="bento-heading">Instantaneous Token Streaming</h3>
            <p className="bento-desc">
              High-throughput WebSocket infrastructure ensures responses stream the millisecond your thoughts finish.
            </p>
            
            <div className="speed-meter-pill">
              <div className="speed-track">
                <div className="speed-fill"></div>
              </div>
              <div className="speed-info">
                <span>120 Tokens / sec</span>
                <span className="live-ping">● 14ms ping</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card bento-medium glass-panel">
          <div className="bento-ambient-glow purple-glow"></div>
          <div className="bento-content">
            <div className="bento-icon-wrapper purple-bg">
              <Code size={22} className="bento-icon purple-text" />
            </div>
            <span className="bento-tag">Polyglot Dev</span>
            <h3 className="bento-heading">Code Synthesis &amp; Refactoring</h3>
            <p className="bento-desc">
              Produces production-ready TypeScript, React, Python, Go, and SQL code with clean syntax highlighting and one-click copy.
            </p>

            <div className="mini-code-tag">
              <code>export const optimize = (ast) =&gt; fastCompile(ast);</code>
            </div>
          </div>
        </div>

        {/* Bento 4: Multi-Model Adaptive Router */}
        {/* <div className="bento-card bento-medium glass-panel">
          <div className="bento-ambient-glow cyan-glow"></div>
          <div className="bento-content">
            <div className="bento-icon-wrapper cyan-bg">
              <Cpu size={22} className="bento-icon cyan-text" />
            </div>
            <span className="bento-tag">Flexible Engine</span>
            <h3 className="bento-heading">Adaptive Multi-Model Router</h3>
            <p className="bento-desc">
              Seamlessly toggle between Nova Ultra (speed), Nova Reasoner (deep logic), and Nova Coder (engineering).
            </p>

            <div className="model-switches-mock">
              <div className="model-chip active">Nova Ultra 2.5</div>
              <div className="model-chip">Nova Reasoner</div>
              <div className="model-chip">Nova Coder</div>
            </div>
          </div>
        </div> */}

        <div className="bento-card bento-large glass-panel">
          <div className="bento-ambient-glow emerald-glow"></div>
          <div className="bento-content">
            <div className="bento-icon-wrapper emerald-bg">
              <ShieldCheck size={22} className="bento-icon emerald-text" />
            </div>
            <span className="bento-tag">Zero Compromise</span>
            <h3 className="bento-heading">Enterprise Security &amp; Data Privacy</h3>
            <p className="bento-desc">
              Your conversations and intellectual property are never used to train public models. Isolated encryption keys and SOC2 compliance built-in.
            </p>

            <div className="security-badges-list">
              <div className="security-item">
                <CheckCircle2 size={16} className="security-check" />
                <span>Zero model retraining on customer data</span>
              </div>
              <div className="security-item">
                <CheckCircle2 size={16} className="security-check" />
                <span>AES-256 encryption in transit &amp; at rest</span>
              </div>
              <div className="security-item">
                <CheckCircle2 size={16} className="security-check" />
                <span>Role-based access &amp; session revocation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
