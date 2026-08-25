import React, { useState } from 'react';
import { NavTab } from '../types';
import { Menu, X, ArrowUpRight, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenContactModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenContactModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAdminAuth();

  const navItems: { key: NavTab; label: string }[] = [
    { key: 'about', label: t.nav.about },
    { key: 'works', label: t.nav.works },
    { key: 'contact', label: t.nav.contact },
  ];

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-[#fafafc]/90 backdrop-blur-md transition-all"
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        {/* Left: Logo matching exact lowercase bold font in screenshots */}
        <div className="flex items-center gap-3">
          <button
            id="logo-button"
            onClick={() => onSelectTab('home')}
            className="group flex items-center space-x-1 text-left focus:outline-none cursor-pointer"
          >
            <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 transition-opacity group-hover:opacity-80">
              lovey
            </span>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => onSelectTab('admin')}
              className="hidden lg:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              <ShieldCheck size={11} />
              <span>관리자 ON</span>
            </button>
          )}
        </div>

        {/* Center Desktop Navigation (Mathematically centered) */}
        <nav
          id="desktop-navigation"
          aria-label="Main Navigation"
          className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:gap-11"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                id={`nav-link-${item.key}`}
                onClick={() => {
                  if (item.key === 'contact') {
                    onSelectTab('contact');
                  } else {
                    onSelectTab(item.key);
                  }
                }}
                className={`relative py-2 text-xs font-semibold tracking-wider transition-colors duration-200 uppercase ${
                  isActive
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}

          {/* EDIT / ADMIN Nav Button - ONLY VISIBLE WHEN AUTHENTICATED */}
          {isAuthenticated && (
            <button
              id="nav-link-admin"
              onClick={() => onSelectTab('admin')}
              className={`relative py-2 text-xs font-semibold tracking-wider transition-colors duration-200 uppercase flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'text-emerald-600 font-bold'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <SlidersHorizontal size={12} />
              <span>EDIT</span>
              {activeTab === 'admin' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-600 rounded-full animate-fadeIn" />
              )}
            </button>
          )}
        </nav>

        {/* Right Action Area: Language Selector + LET'S TALK */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector variant="header" />
          <button
            id="header-lets-talk-btn"
            onClick={onOpenContactModal}
            className="inline-flex items-center gap-1.5 justify-center rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow active:scale-95 cursor-pointer"
          >
            <Sparkles size={13} className="text-blue-200" />
            <span>{t.nav.letsTalk}</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSelector variant="header" />
          <button
            id="mobile-lets-talk-btn"
            onClick={onOpenContactModal}
            className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase"
          >
            <Sparkles size={12} className="text-blue-200" />
            <span>{t.nav.aiConsult}</span>
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-700 hover:text-neutral-950 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="border-b border-neutral-200 bg-white px-6 py-6 md:hidden shadow-lg animate-fadeIn"
        >
          <div className="flex flex-col space-y-4">
            <button
              id="mobile-nav-home"
              onClick={() => {
                onSelectTab('home');
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm font-semibold tracking-wider text-neutral-600 hover:text-blue-600 uppercase py-2"
            >
              {t.nav.home}
            </button>
            {navItems.map((item) => (
              <button
                key={item.key}
                id={`mobile-nav-${item.key}`}
                onClick={() => {
                  onSelectTab(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-semibold tracking-wider py-2 uppercase ${
                  activeTab === item.key
                    ? 'text-blue-600 font-bold border-l-2 border-blue-600 pl-2'
                    : 'text-neutral-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAuthenticated && (
              <button
                id="mobile-nav-admin"
                onClick={() => {
                  onSelectTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-semibold tracking-wider py-2 uppercase flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'text-emerald-600 font-bold border-l-2 border-emerald-600 pl-2'
                    : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>게시글 관리 (EDIT)</span>
              </button>
            )}

            <LanguageSelector variant="mobile" />

            <div className="pt-2 border-t border-neutral-100">
              <button
                id="mobile-nav-cta-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContactModal();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-xs font-bold tracking-wider text-white uppercase shadow"
              >
                {t.nav.letsTalk} <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

