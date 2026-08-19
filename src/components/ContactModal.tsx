import React, { useState } from 'react';
import { X, Send, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '유튜브 롱폼 영상 편집',
    budget: '50만 원 ~ 100만 원',
    timeline: '2~3주 이내',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = 'contact@staylovey.com';

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      }
      setCopied(true);
      onShowToast('이메일 주소가 클립보드에 복사되었습니다.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      onShowToast('이메일 주소가 클립보드에 복사되었습니다.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('성함과 연락 가능한 이메일을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onShowToast(`문의가 정상적으로 접수되었습니다. 감사합니다, ${formData.name}님.`);
    }, 900);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      projectType: '유튜브 롱폼 영상 편집',
      budget: '50만 원 ~ 100만 원',
      timeline: '2~3주 이내',
      message: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 sm:p-10 shadow-2xl border border-neutral-200"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950 transition cursor-pointer"
            aria-label="닫기"
          >
            <X size={18} />
          </button>

          {isSubmitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                <Check size={32} />
              </div>
              <h3 className="font-display text-3xl font-black text-neutral-950">
                문의가 접수되었습니다
              </h3>
              <p className="mt-3 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                감사합니다, <strong className="text-neutral-900">{formData.name}</strong>님. 남겨주신 프로젝트 내용을 확인한 후 24시간 이내에 빠른 회신을 드리겠습니다.
              </p>
              <div className="mt-8">
                <button
                  onClick={handleReset}
                  className="rounded-full bg-blue-600 px-8 py-3 text-xs font-bold text-white uppercase tracking-wider hover:bg-blue-700 transition cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tag font-bold tracking-widest text-blue-600 uppercase">
                <Sparkles size={14} /> PROJECT INQUIRY
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-neutral-950">
                작업 문의 및 견적 상담
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500">
                준비 중이신 영상 편집이나 상세페이지 디자인에 대해 편하게 남겨주세요.
              </p>

              {/* Direct email pill */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-neutral-50 p-3 border border-neutral-200/80">
                <div className="text-xs text-neutral-600">
                  직접 이메일 문의:{' '}
                  <a href={`mailto:${email}`} className="font-bold text-neutral-900 hover:underline">
                    {email}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1 rounded-lg border border-neutral-200 shadow-2xs cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? '복사완료' : '이메일 복사'}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      성함 또는 브랜드/채널명 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 홍길동 / 브랜드명"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      회신받으실 이메일 주소 *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="예: example@naver.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      작업 유형
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                    >
                      <option>유튜브 롱폼 영상 편집</option>
                      <option>이커머스 상세페이지 제작</option>
                      <option>유튜브 숏폼 / 릴스 편집</option>
                      <option>정기 협업 및 다건 의뢰</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      희망 예산 (KRW)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                    >
                      <option>10만 원 ~ 30만 원 미만</option>
                      <option>30만 원 ~ 50만 원</option>
                      <option>50만 원 ~ 100만 원</option>
                      <option>100만 원 ~ 200만 원</option>
                      <option>200만 원 이상 / 정기 협업</option>
                      <option>상담 후 협의</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      희망 일정
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                    >
                      <option>급행 (3일 이내)</option>
                      <option>1주일 이내</option>
                      <option>2~3주 이내</option>
                      <option>일정 조율 가능</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    프로젝트 내용 및 요청사항
                  </label>
                  <textarea
                    rows={3}
                    placeholder="작업 분량, 참고할 레퍼런스 영상/링크, 전달해주실 소스 내용 등을 간단히 적어주세요."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white uppercase tracking-wider shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>문의 전송 중...</span>
                    ) : (
                      <>
                        <span>문의 및 견적 신청하기</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
