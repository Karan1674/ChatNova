import React from 'react';
import { Activity, Zap, Layers, Star } from 'lucide-react';

const PARTNERS = [
  'Vercel',
  'Anthropic',
  'Supabase',
  'Prisma',
  'Scale AI',
  'Linear',
  'Raycast',
  'Cloudflare'
];

export default function LogosAndMetrics() {
  return (
    <section className="logos-metrics-section">
      <div className="logos-container">
        <p className="logos-title">TRUSTED BY BUILDERS AND FAST-MOVING ENGINEERING TEAMS</p>
        
        <div className="logos-marquee">
          <div className="logos-track">
            {PARTNERS.concat(PARTNERS).map((name, index) => (
              <div key={index} className="partner-logo-item">
                <span className="partner-logo-text">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="metrics-wrapper">
        <div className="metrics-grid">
          <div className="metric-card glass-panel">
            <div className="metric-header">
              <Zap className="metric-icon indigo" size={20} />
              <span className="metric-badge">Ultra Low</span>
            </div>
            <div className="metric-value">&lt;85ms</div>
            <div className="metric-label">Median First-Token Latency</div>
            <div className="metric-sub">Fast enough for instantaneous conversation flows</div>
          </div>

          <div className="metric-card glass-panel">
            <div className="metric-header">
              <Layers className="metric-icon cyan" size={20} />
              <span className="metric-badge">Memory</span>
            </div>
            <div className="metric-value">100%</div>
            <div className="metric-label">Contextual Continuity</div>
            <div className="metric-sub">Persistent vector embeddings across all sessions</div>
          </div>

          <div className="metric-card glass-panel">
            <div className="metric-header">
              <Activity className="metric-icon purple" size={20} />
              <span className="metric-badge">Reliability</span>
            </div>
            <div className="metric-value">99.99%</div>
            <div className="metric-label">Service Availability</div>
            <div className="metric-sub">Fault-tolerant distributed edge architecture</div>
          </div>

          <div className="metric-card glass-panel">
            <div className="metric-header">
              <Star className="metric-icon emerald" size={20} />
              <span className="metric-badge">Loved</span>
            </div>
            <div className="metric-value">4.9 / 5</div>
            <div className="metric-label">Developer Satisfaction</div>
            <div className="metric-sub">Rated by over 15,000+ active software creators</div>
          </div>
        </div>
      </div>
    </section>
  );
}
