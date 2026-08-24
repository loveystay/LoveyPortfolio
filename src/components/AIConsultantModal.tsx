import React, { useState, useRef, useEffect, useCallback } from 'react';
import Markdown from 'react-markdown';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Mail,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';
import type { Project } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
  recommendedProjectIds?: string[];
  shouldContact?: boolean;
}

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  projects,
  onOpenProject,
}) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Slider state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const email = 'contact@staylovey.com';
  const localText = {
    ko: {
      recommended: '추천 포트폴리오',
      viewProject: '프로젝트 보기',
      inquiry: '상담 내용으로 문의 메일 작성',
      mailSubject: '포트폴리오 프로젝트 문의',
      mailIntro: '안녕하세요. AI 상담 내용을 바탕으로 프로젝트를 문의드립니다.',
      mailHistory: '상담 내용',
      failed: '답변을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      networkError: `일시적인 통신 오류가 발생했습니다. ${email}으로 문의해 주세요.`,
    },
    en: {
      recommended: 'Recommended work',
      viewProject: 'View project',
      inquiry: 'Continue by email',
      mailSubject: 'Portfolio project inquiry',
      mailIntro: 'Hello, I would like to inquire about a project based on this AI consultation.',
      mailHistory: 'Consultation details',
      failed: 'Failed to retrieve a response. Please try again.',
      networkError: `A temporary network issue occurred. Please contact ${email}.`,
    },
    ja: {
      recommended: 'おすすめの実績',
      viewProject: 'プロジェクトを見る',
      inquiry: '相談内容をメールで送る',
      mailSubject: 'ポートフォリオ制作のご相談',
      mailIntro: 'こんにちは。AI相談の内容をもとに、プロジェクトについてお問い合わせします。',
      mailHistory: '相談内容',
      failed: '回答を取得できませんでした。もう一度お試しください。',
      networkError: `一時的な通信エラーが発生しました。${email}までお問い合わせください。`,
    },
  }[language];

  const buildInquiryMailto = () => {
    const history = messages
      .filter((message) => message.role === 'user')
      .slice(-6)
      .map((message) => `- ${message.text}`)
      .join('\n');
    const body = `${localText.mailIntro}\n\n${localText.mailHistory}:\n${history || '-'}`;
    return `mailto:${email}?subject=${encodeURIComponent(localText.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  // Initialize or update welcome message when language or modal state changes
  useEffect(() => {
    if (isOpen) {
      const timeLocale = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';
      setMessages([
        {
          id: 'welcome-1',
          role: 'model',
          text: t.aiConsultant.welcomeMsg,
          time: new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, language, t.aiConsultant.welcomeMsg]);

  const checkScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, isOpen]);

  const handleSlide = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 280;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 320);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      sliderRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  // Mouse Drag to Slide Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    checkScroll();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      }
      setCopied(true);
      onShowToast(t.aiConsultant.copied);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      onShowToast(t.aiConsultant.copied);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const timeLocale = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const requestBody = {
        language,
        messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
        projects: projects.slice(0, 40).map((project) => ({
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          client: project.client,
          duration: project.duration,
          highlights: project.highlights?.slice(0, 3),
        })),
      };
      let data: Record<string, unknown>;

      if (isSupabaseConfigured) {
        const result = await requireSupabase().functions.invoke('chat', { body: requestBody });
        if (result.error) throw result.error;
        data = result.data as Record<string, unknown>;
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        data = await response.json() as Record<string, unknown>;
        if (!response.ok) throw new Error('AI consultation request failed');
      }

      const botReply = typeof data.reply === 'string' && data.reply.trim()
        ? data.reply
        : localText.failed;
      const recommendedProjectIds = Array.isArray(data.recommendedProjectIds)
        ? data.recommendedProjectIds
            .filter((id: unknown): id is string =>
              typeof id === 'string' && projects.some((project) => project.id === id)
            )
            .slice(0, 3)
        : [];

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: botReply,
          time: new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' }),
          recommendedProjectIds,
          shouldContact: data.shouldContact === true,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: localText.networkError,
          time: new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' }),
          shouldContact: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const timeLocale = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: t.aiConsultant.welcomeMsg,
        time: new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col h-[90vh] max-h-[780px] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-200 will-change-transform"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-6 py-4 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                <Bot size={20} />
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base font-bold text-neutral-950">
                    {t.aiConsultant.title}
                  </h3>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                    AI Online
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  {t.aiConsultant.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetChat}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200/70 hover:text-neutral-700 transition cursor-pointer"
                title="Reset Chat"
                aria-label="Reset Chat"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-900 transition cursor-pointer"
                aria-label={t.aiConsultant.close}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/40">
            {messages.map((msg) => {
              const isBot = msg.role === 'model';
              const recommendedProjects = (msg.recommendedProjectIds ?? [])
                .map((id) => projects.find((project) => project.id === id))
                .filter((project): project is Project => Boolean(project));
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs mt-0.5">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[85%]`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed break-keep shadow-xs ${
                        isBot
                          ? 'bg-white text-neutral-800 border border-neutral-200/80'
                          : 'bg-blue-600 text-white rounded-br-xs'
                      }`}
                    >
                      {isBot ? (
                        <div className="prose prose-xs sm:prose-sm max-w-none text-neutral-800 space-y-2">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                    {isBot && recommendedProjects.length > 0 && (
                      <div className="mt-2 w-full space-y-2">
                        <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {localText.recommended}
                        </p>
                        {recommendedProjects.map((project) => (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => onOpenProject(project)}
                            className="group flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-2 text-left shadow-xs transition hover:border-blue-400 hover:shadow-md cursor-pointer"
                          >
                            <img
                              src={project.image}
                              alt=""
                              className="h-14 w-16 shrink-0 rounded-xl object-cover"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-bold text-neutral-900">
                                {project.title}
                              </span>
                              <span className="mt-0.5 block text-[10px] font-medium text-neutral-500">
                                {project.category}
                              </span>
                              <span className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-blue-600">
                                {localText.viewProject}
                                <ChevronRight size={11} />
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {isBot && msg.shouldContact && (
                      <a
                        href={buildInquiryMailto()}
                        className="mt-2 flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        <Mail size={12} />
                        {localText.inquiry}
                      </a>
                    )}
                    <span className="mt-1 text-[10px] text-neutral-400 px-1">{msg.time}</span>
                  </div>

                  {!isBot && (
                    <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-2xs mt-0.5">
                      <User size={16} />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl rounded-tl-xs bg-white px-4 py-3 shadow-xs border border-neutral-200/80 flex items-center space-x-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Slider Recommendation Bar */}
          <div className="border-t border-neutral-100 bg-white/95 px-4 pt-2.5 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600">
                <Sparkles size={12} className="text-blue-600" />
                <span>{t.aiConsultant.suggestedTitle}</span>
                <span className="text-[10px] text-neutral-400 font-normal ml-1 hidden sm:inline">
                  {t.aiConsultant.suggestedHint}
                </span>
              </div>

              {/* Slider Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSlide('left')}
                  disabled={!canScrollLeft}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  aria-label="Previous suggested question"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={() => handleSlide('right')}
                  disabled={!canScrollRight}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  aria-label="Next suggested question"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* Horizontal Draggable / Scrollable Slider Container */}
            <div className="relative group">
              {/* Left Gradient Fade Mask */}
              {canScrollLeft && (
                <div
                  onClick={() => handleSlide('left')}
                  className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-auto cursor-pointer flex items-center justify-start"
                >
                  <ChevronLeft size={14} className="text-neutral-400 -ml-1" />
                </div>
              )}

              {/* Slider Track */}
              <div
                ref={sliderRef}
                onScroll={checkScroll}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`flex gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                }}
              >
                {t.aiConsultant.questions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!isDragging) {
                        handleSendMessage(q);
                      }
                    }}
                    disabled={isLoading}
                    className="shrink-0 rounded-full border border-neutral-200/90 bg-neutral-50/90 px-3.5 py-1.5 text-xs text-neutral-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 active:scale-98 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 text-left shadow-2xs whitespace-nowrap"
                  >
                    <span>{q}</span>
                    <ChevronRight size={12} className="text-neutral-400 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Right Gradient Fade Mask */}
              {canScrollRight && (
                <div
                  onClick={() => handleSlide('right')}
                  className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-auto cursor-pointer flex items-center justify-end"
                >
                  <ChevronRight size={14} className="text-neutral-400 -mr-1" />
                </div>
              )}
            </div>
          </div>

          {/* Input & Direct Inquiry Bar */}
          <div className="border-t border-neutral-200 bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.aiConsultant.placeholder}
                disabled={isLoading}
                maxLength={1000}
                className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label={t.aiConsultant.send}
              >
                <Send size={16} />
              </button>
            </form>

            {/* Bottom Contact Pill */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
              <span className="flex items-center gap-1 font-medium text-neutral-600 truncate">
                <Mail size={12} className="text-blue-600 shrink-0" />
                <span>Contact: <strong className="text-neutral-900 truncate">{email}</strong></span>
              </span>
              <button
                onClick={handleCopyEmail}
                className="self-start sm:self-auto flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 px-2 py-0.5 rounded bg-blue-50/70 hover:bg-blue-100 transition cursor-pointer"
              >
                {copied ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                {copied ? t.aiConsultant.copied : t.aiConsultant.copyEmail}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
