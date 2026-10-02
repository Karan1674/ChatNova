import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import LogosAndMetrics from './LogosAndMetrics';
import BentoFeatures from './BentoFeatures';
import HowItWorks from './HowItWorks';
import PricingSection from './PricingSection';
import TestimonialsAndFAQ from './TestimonialsAndFAQ';
import CtaBannerAndFooter from './CtaBannerAndFooter';
import './Landing.css';

export default function LandingPage({ onNavigate, user, onLogout }) {
  return (
    <div className="landing-page-root">
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <main>
        <HeroSection onNavigate={onNavigate} user={user} />
        <LogosAndMetrics />
        <BentoFeatures />
        <HowItWorks onNavigate={onNavigate} user={user} />
        <PricingSection onNavigate={onNavigate} user={user} />
        <TestimonialsAndFAQ />
        <CtaBannerAndFooter onNavigate={onNavigate} user={user} />
      </main>
    </div>
  );
}