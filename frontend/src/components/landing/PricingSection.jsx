import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

export default function PricingSection({ onNavigate, user }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-header-cluster">
        <div className="badge-pill">
          <Sparkles size={14} />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h2 className="section-title">
          Invest in <span className="text-gradient">Supercharged Thinking</span>
        </h2>
        <p className="section-subtitle">
          Start for free, then scale as your team and intelligence demands grow. Cancel or change plans anytime.
        </p>

        <div className="billing-toggle-wrapper">
          <span className={`billing-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
          <button 
            className="toggle-switch" 
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle annual or monthly pricing"
          >
            <span className={`toggle-slider ${isAnnual ? 'annual' : ''}`}></span>
          </button>
          <span className={`billing-label ${isAnnual ? 'active' : ''}`}>
            Yearly <span className="discount-pill">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="pricing-cards-grid">
        <div className="pricing-card glass-panel">
          <div className="card-top">
            <h3 className="plan-name">Starter</h3>
            <p className="plan-desc">For individual developers and curious builders exploring AI workflows.</p>
            <div className="plan-price-row">
              <span className="price-amount">$0</span>
              <span className="price-period">/ month</span>
            </div>
          </div>

          <button 
            className="pricing-btn-secondary"
            disabled={Boolean(user)}
            onClick={() => !user && onNavigate('signup')}
          >
            {user ? 'Current Plan' : 'Get Started Free'}
          </button>

          <div className="plan-divider"></div>

          <div className="plan-features-list">
            <span className="features-headline">INCLUDED IN STARTER:</span>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>Unlimited chats with Nova Standard</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>Standard response speed (100 tok/sec)</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>10 session history storage</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>Code synthesis &amp; syntax highlighting</span>
            </div>
          </div>
        </div>

        <div className="pricing-card glass-panel popular-tier">
          <div className="popular-badge-pill">
            <Zap size={13} />
            <span>MOST POPULAR</span>
          </div>

          <div className="card-top">
            <h3 className="plan-name">Pro Workspace</h3>
            <p className="plan-desc">For ambitious engineers and creators demanding maximum speed and neural memory.</p>
            <div className="plan-price-row">
              <span className="price-amount">{isAnnual ? '$15' : '$19'}</span>
              <span className="price-period">/ month</span>
            </div>
            {isAnnual && <span className="annual-billing-note">Billed annually ($180/yr)</span>}
          </div>

          <button 
            className="glow-btn pricing-btn-primary"
            onClick={() => !user && onNavigate('signup')}
          >
            <span>{user ? 'Upgrade to Pro' : 'Start 14-Day Free Trial'}</span>
            <ArrowRight size={15} />
          </button>

          <div className="plan-divider"></div>

          <div className="plan-features-list">
            <span className="features-headline">EVERYTHING IN STARTER, PLUS:</span>
            <div className="feature-item">
              <Check size={16} className="check-icon indigo" />
              <span>Priority access to Nova Ultra 2.5 (150+ tok/sec)</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon indigo" />
              <span>Persistent Neural Vector Memory (unlimited)</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon indigo" />
              <span>Nova Reasoner (deep logic &amp; architecture)</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon indigo" />
              <span>Unlimited saved conversation sessions</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon indigo" />
              <span>Export conversations &amp; snippets to Markdown</span>
            </div>
          </div>
        </div>
        
        <div className="pricing-card glass-panel">
          <div className="card-top">
            <h3 className="plan-name">Team &amp; Enterprise</h3>
            <p className="plan-desc">For engineering organizations requiring dedicated models and custom security.</p>
            <div className="plan-price-row">
              <span className="price-amount">{isAnnual ? '$64' : '$79'}</span>
              <span className="price-period">/ user / month</span>
            </div>
            {isAnnual && <span className="annual-billing-note">Billed annually ($768/yr)</span>}
          </div>

          <button 
            className="pricing-btn-secondary"
            onClick={() => !user && onNavigate('signup')}
          >
            Talk to Enterprise
          </button>

          <div className="plan-divider"></div>

          <div className="plan-features-list">
            <span className="features-headline">EVERYTHING IN PRO, PLUS:</span>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>Dedicated fine-tuned private models</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>SOC2 Type II compliance &amp; audit logging</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>Single Sign-On (SAML / Okta / Azure AD)</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>Custom vector database integration</span>
            </div>
            <div className="feature-item">
              <Check size={16} className="check-icon" />
              <span>24/7 Priority SLA &amp; dedicated engineer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
