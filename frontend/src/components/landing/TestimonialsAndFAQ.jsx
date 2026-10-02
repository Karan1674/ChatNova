import React, { useState } from 'react';
import { Star, ChevronDown, Sparkles, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Elena Rostova',
    role: 'Principal Staff Engineer',
    company: 'NeuralStack',
    quote: 'ChatNova completely changed how our team writes fullstack services. The sub-100ms response time makes interacting with AI feel like an extension of your own mind.',
    rating: 5,
    avatar: 'ER'
  },
  {
    name: 'Marcus Vance',
    role: 'Founder & CTO',
    company: 'HyperFlow',
    quote: 'The neural vector memory is the killer feature. I can reference a design pattern we discussed three weeks ago and ChatNova immediately understands the context without retraining.',
    rating: 5,
    avatar: 'MV'
  },
  {
    name: 'Sophia Chen',
    role: 'Lead Architect',
    company: 'Synthetix Systems',
    quote: 'The dark Framer aesthetics are stunning, but under the hood, the WebSocket streaming and code synthesis accuracy blow ChatGPT and Gemini interfaces out of the water.',
    rating: 5,
    avatar: 'SC'
  }
];

const FAQS = [
  {
    question: 'How does ChatNova remember context across different conversations?',
    answer: 'ChatNova uses an integrated vector embedding engine. Whenever you chat or discuss architectural patterns, semantic embeddings are created and stored securely. In subsequent queries, relevant memories are retrieved and injected as context before the model generates its response.'
  },
  {
    question: 'Is my proprietary code and data kept private and secure?',
    answer: 'Absolutely. We enforce strict tenant data isolation, AES-256 encryption at rest and in transit, and we never use your proprietary code, prompts, or conversation data to train foundation models.'
  },
  {
    question: 'Can I switch between different models like Nova Ultra and Nova Reasoner?',
    answer: 'Yes! Our intuitive model picker at the top of the chat allows you to switch between Nova Ultra (engineered for lightning-fast answers and code snippets) and Nova Reasoner (tailored for deep algorithmic thought, mathematics, and complex system design).'
  },
  {
    question: 'Does ChatNova support keyboard shortcuts and markdown formatting?',
    answer: 'Yes. You can press Enter to send, Shift+Enter for newline, Ctrl+K / Cmd+K to start a new chat, and syntax-highlighted code blocks feature one-click copy.'
  },
  {
    question: 'What happens if the backend server is temporarily offline?',
    answer: 'ChatNova is built with resilience in mind. Our client includes intelligent fallback handling that provides high-quality local session simulations so you can explore all features without interruption.'
  }
];

export default function TestimonialsAndFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section className="testimonials-faq-section" >
      <div className="section-header-cluster">
        <div className="badge-pill">
          <Sparkles size={14} />
          <span>User Testimonials</span>
        </div>
        <h2 className="section-title">
          Trusted by <span className="text-gradient">Engineers &amp; Innovators</span>
        </h2>
        <p className="section-subtitle">
          See why thousands of developers choose ChatNova for everyday system building and deep reasoning.
        </p>
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, idx) => (
          <div key={idx} className="testimonial-card glass-panel">
            <div className="quote-icon-box">
              <Quote size={20} className="quote-icon" />
            </div>
            <div className="stars-row">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={15} className="star-filled" />
              ))}
            </div>
            <p className="testimonial-quote">"{t.quote}"</p>
            <div className="testimonial-author-row">
              <div className="author-avatar">{t.avatar}</div>
              <div className="author-details">
                <span className="author-name">{t.name}</span>
                <span className="author-role">{t.role} • {t.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-wrapper" id="faq">
        <div className="section-header-cluster faq-header">
          <div className="badge-pill">
            <span>Got Questions?</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about ChatNova’s intelligence, data handling, and subscriptions.
          </p>
        </div>

        <div className="faq-accordion">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`faq-item glass-panel ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-row">
                  <span className="faq-question-text">{faq.question}</span>
                  <div className={`faq-chevron-box ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
                {isOpen && (
                  <div className="faq-answer-container">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
