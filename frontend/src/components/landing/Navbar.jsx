import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Menu, X, ArrowRight, User, LogOut } from "lucide-react";

export default function Navbar({ onNavigate, user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu if resized to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`landing-navbar-wrapper ${isScrolled ? "scrolled" : ""} ${mobileMenuOpen ? "menu-open" : ""}`}
    >
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className="landing-navbar">
        <div
          className="nav-brand"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="brand-icon-box">
            <Sparkles size={18} className="brand-sparkle" />
          </div>
          <span className="brand-name">
            Chat<span className="brand-accent">Nova</span>
          </span>
        </div>

        <div className="nav-links-desktop">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, "features")}
            className="nav-link"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, "how-it-works")}
            className="nav-link"
          >
            Workflow
          </a>
          <a
            href="#pricing"
            onClick={(e) => scrollToSection(e, "pricing")}
            className="nav-link"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => scrollToSection(e, "faq")}
            className="nav-link"
          >
            FAQ
          </a>
        </div>

        <div className="nav-actions-desktop">
          {user ? (
            <div className="nav-user-cluster">
              <button
                className="glow-btn nav-btn-primary"
                onClick={() => onNavigate("chat")}
              >
                <span>Launch Chat</span>
                <ArrowRight size={15} />
              </button>

              <div className="profile-wrapper" ref={profileRef}>
                <button
                  className="avatar-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  title="Account"
                  aria-label="User profile menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="avatar-circle">
                    {user?.fullName?.firstName
                      ? user.fullName.firstName[0].toUpperCase()
                      : "U"}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="profile-dropdown glass-panel">
                    <div className="profile-header">
                      <div className="profile-name">
                        {user?.fullName?.firstName
                          ? `${user.fullName.firstName} ${user.fullName.lastName || ""}`.trim()
                          : "ChatNova User"}
                      </div>
                      <div className="profile-email">
                        {user?.email || "user@chatnova.ai"}
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-item danger"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                className="nav-btn-secondary"
                onClick={() => onNavigate("login")}
              >
                Sign In
              </button>
              <button
                className="glow-btn nav-btn-primary"
                onClick={() => onNavigate("signup")}
              >
                <span>Get Started Free</span>
                <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-links">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="mobile-nav-link"
            >
              <span>Features</span>
              <ArrowRight size={15} className="mobile-link-arrow" />
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="mobile-nav-link"
            >
              <span>Workflow</span>
              <ArrowRight size={15} className="mobile-link-arrow" />
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="mobile-nav-link"
            >
              <span>Pricing</span>
              <ArrowRight size={15} className="mobile-link-arrow" />
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="mobile-nav-link"
            >
              <span>FAQ</span>
              <ArrowRight size={15} className="mobile-link-arrow" />
            </a>
          </div>

          <div className="mobile-nav-actions">
            {user ? (
              <>
                <div className="mobile-user-profile-info">
                  <div className="avatar-circle">
                    {user?.fullName?.firstName
                      ? user.fullName.firstName[0].toUpperCase()
                      : "U"}
                  </div>
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">
                      {user?.fullName?.firstName
                        ? `${user.fullName.firstName} ${user.fullName.lastName || ""}`.trim()
                        : "ChatNova User"}
                    </span>
                    <span className="mobile-user-email">
                      {user?.email || "user@chatnova.ai"}
                    </span>
                  </div>
                </div>

                <button
                  className="glow-btn mobile-primary-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate("chat");
                  }}
                >
                  <span>Launch Chat Workspace</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  className="mobile-secondary-btn danger"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="mobile-secondary-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate("login");
                  }}
                >
                  Sign In
                </button>
                <button
                  className="glow-btn mobile-primary-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate("signup");
                  }}
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
