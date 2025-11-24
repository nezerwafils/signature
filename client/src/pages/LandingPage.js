import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="container">
          <div className="hero-content">
            <div className="vently-logo">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="120" y2="120">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="50%" stopColor="#A29BFE" />
                    <stop offset="100%" stopColor="#FD79A8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="60" cy="60" r="54" fill="url(#logoGradient)" opacity="0.2"/>
                <circle cx="60" cy="60" r="48" stroke="url(#logoGradient)" strokeWidth="4" fill="none" filter="url(#glow)"/>
                
                {/* Sound wave icon */}
                <path d="M60 30v60M50 40v40M70 40v40M40 45v30M80 45v30M30 50v20M90 50v20" 
                      stroke="white" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      filter="url(#glow)"/>
              </svg>
            </div>

            <h1 className="hero-title">
              Welcome to <span className="gradient-text">Vently</span>
            </h1>
            
            <p className="hero-subtitle">
              Your voice. Your moment. Your community.
            </p>
            
            <p className="hero-description">
              The next generation audio-only social platform where your voice tells the story.
              Share moments, connect with friends, and discover voices from around the world.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Vently?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 8v32M16 16v16M32 16v16M10 20v8M38 20v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Audio First</h3>
              <p className="feature-description">
                Express yourself authentically with voice. No filters, no editing - just pure, real moments.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="32" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="24" cy="32" r="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 18l6 10M27 18l-6 10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Real Connections</h3>
              <p className="feature-description">
                Build meaningful relationships through voice. Follow friends, discover new voices, engage authentically.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M8 24c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 24c0 8.837 7.163 16 16 16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                  <circle cx="24" cy="24" r="4" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="feature-title">Discover & Explore</h3>
              <p className="feature-description">
                Find trending voices, explore hashtags, and discover content that resonates with you.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8l4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <circle cx="36" cy="12" r="2" fill="currentColor"/>
                  <circle cx="36" cy="36" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="feature-title">Simple & Beautiful</h3>
              <p className="feature-description">
                Intuitive design that puts your content first. Easy sign up with just username and password.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to share your voice?</h2>
            <p className="cta-subtitle">Join thousands of users already on Vently</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 Vently. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
