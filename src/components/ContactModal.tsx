import React, { useState } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  Sparkles,
  Video,
  Film,
  FileSpreadsheet,
  HelpCircle,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Mail,
  HardDrive,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectType, StartProjectFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
  initialData?: Partial<StartProjectFormData>;
}

const DEFAULT_FORM_DATA: StartProjectFormData = {
  // [섹션 1] 기본 정보
  companyOrChannel: '',
  managerNameAndTitle: '',
  contact: '',
  brandUrl: '',

  // [섹션 2] 프로젝트 유형
  projectType: 'youtube_long',

  // [섹션 3] 작업 세부 사항
  videoRawFootage: '',
  videoTargetLength: '',
  videoScope: ['컷편집', '자막', 'BGM·효과음'],
  videoFrequency: '',
  videoDriveUrl: '',

  ecommerceUsp: '',
  ecommerceResources: ['기획안 보유'],
  ecommerceWorkload: '',
  ecommerceDriveUrl: '',

  otherDetails: '',

  // [섹션 4] 레퍼런스
  targetMood: '',
  referenceLink1: '',
  referenceLink2: '',
  avoidStyles: '',

  // [섹션 5] 일정 및 예산
  rawMaterialDate: '',
  firstDraftDate: '',
  finalDeliveryDate: '',
  budgetRange: '',

  // [섹션 6] 기타
  additionalNotes: '',
};

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialData,
}) => {
  const [formData, setFormData] = useState<StartProjectFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formattedSummary, setFormattedSummary] = useState('');
  const [copied, setCopied] = useState(false);

  const targetEmail = 'contact@staylovey.com';

  const projectTypeOptions: {
    type: ProjectType;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'youtube_long',
      label: '유튜브 롱폼',
      sublabel: '스토리텔링 & 컷/자막/모션',
      icon: <Video size={18} />,
    },
    {
      type: 'shortform',
      label: '숏폼 (쇼츠/릴스/틱톡)',
      sublabel: '트렌디한 호흡 & 모션 그래픽',
      icon: <Film size={18} />,
    },
    {
      type: 'ecommerce_detail',
      label: '상세페이지 기획 & 디자인',
      sublabel: 'USP 중심 고전환 디자인',
      icon: <FileSpreadsheet size={18} />,
    },
    {
      type: 'other',
      label: '기타 프로젝트',
      sublabel: '종합 브랜딩, 맞춤형 제작',
      icon: <HelpCircle size={18} />,
    },
  ];

  const videoScopeOptions = [
    '컷편집',
    '자막',
    '모션·CG',
    'BGM·효과음',
    '썸네일 포함 여부',
  ];

  const ecommerceResourceOptions = [
    '기획안 보유',
    '제품 연출컷·누끼컷 보유',
    '원고/텍스트 보유',
  ];

  const handleScopeToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.videoScope.includes(item);
      const updated = exists
        ? prev.videoScope.filter((s) => s !== item)
        : [...prev.videoScope, item];
      return { ...prev, videoScope: updated };
    });
  };

  const handleResourceToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.ecommerceResources.includes(item);
      const updated = exists
        ? prev.ecommerceResources.filter((r) => r !== item)
        : [...prev.ecommerceResources, item];
      return { ...prev, ecommerceResources: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // [섹션 1] 필수 검증
    if (!formData.companyOrChannel.trim()) {
      newErrors.companyOrChannel = '업체/채널명을 입력해 주세요.';
    }
    if (!formData.managerNameAndTitle.trim()) {
      newErrors.managerNameAndTitle = '담당자 성함 및 직함을 입력해 주세요.';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = '연락처(유선 또는 메일)를 입력해 주세요.';
    }

    // [섹션 3] 조건부 필수 검증
    if (formData.projectType === 'youtube_long' || formData.projectType === 'shortform') {
      if (!formData.videoRawFootage?.trim()) {
        newErrors.videoRawFootage = '원본 촬영본 분량(러닝타임 또는 용량)을 입력해 주세요.';
      }
      if (!formData.videoTargetLength?.trim()) {
        newErrors.videoTargetLength = '최종 납품 희망 영상 길이를 입력해 주세요.';
      }
    } else if (formData.projectType === 'ecommerce_detail') {
      if (!formData.ecommerceUsp?.trim()) {
        newErrors.ecommerceUsp = '제품군 및 주요 셀링 포인트(USP)를 작성해 주세요.';
      }
    } else if (formData.projectType === 'other') {
      if (!formData.otherDetails?.trim()) {
        newErrors.otherDetails = '문의 세부 내용을 직접 입력해 주세요.';
      }
    }

    // [섹션 5] 필수 검증
    if (!formData.finalDeliveryDate.trim()) {
      newErrors.finalDeliveryDate = '최종 완료 및 납품 희망일을 입력해 주세요.';
    }
    if (!formData.budgetRange.trim()) {
      newErrors.budgetRange = '희망하시는 금액을 입력해 주세요.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      onShowToast('필수 입력 항목을 확인해 주세요.');
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const generateProjectSummaryText = (): string => {
    const typeLabel =
      formData.projectType === 'youtube_long'
        ? '(A) 영상 편집 - 유튜브 롱폼'
        : formData.projectType === 'shortform'
        ? '(B) 영상 편집 - 숏폼 (쇼츠/릴스/틱톡)'
        : formData.projectType === 'ecommerce_detail'
        ? '(C) E-커머스 상세페이지 기획 & 디자인'
        : '(D) 기타 프로젝트';

    let section3Details = '';
    if (formData.projectType === 'youtube_long' || formData.projectType === 'shortform') {
      section3Details = `
• 원본 촬영본 분량: ${formData.videoRawFootage || '-'}
• 최종 납품 희망 영상 길이: ${formData.videoTargetLength || '-'}
• 작업 범위: ${formData.videoScope.length > 0 ? formData.videoScope.join(', ') : '미지정'}
• 영상 자료 드라이브 URL: ${formData.videoDriveUrl?.trim() || '미입력 (협의 후 전달)'}
• 업로드 주기 / 의뢰 건수: ${formData.videoFrequency || '단건 또는 미정'}`.trim();
    } else if (formData.projectType === 'ecommerce_detail') {
      section3Details = `
• 제품군 및 주요 셀링 포인트 (USP):
${formData.ecommerceUsp || '-'}
• 제공 가능 리소스: ${formData.ecommerceResources.length > 0 ? formData.ecommerceResources.join(', ') : '없음'}
• 상세페이지 자료 드라이브 URL: ${formData.ecommerceDriveUrl?.trim() || '이메일(contact@staylovey.com) 별도 송부 또는 미입력'}
• 예상 작업 분량: ${formData.ecommerceWorkload || '미정'}`.trim();
    } else {
      section3Details = `
• 문의 세부 내용:
${formData.otherDetails || '-'}`.trim();
    }

    return `[staylovey] Start a Project 프로젝트 의뢰 문의서

■ [섹션 1] 기본 정보
• 업체/채널명: ${formData.companyOrChannel}
• 담당자 성함 / 직함: ${formData.managerNameAndTitle}
• 연락처 (유선 / 메일): ${formData.contact}
• 브랜드 및 채널 링크: ${formData.brandUrl || '미입력'}

■ [섹션 2] 의뢰 프로젝트 유형
• ${typeLabel}

■ [섹션 3] 작업 세부 사항
${section3Details}

■ [섹션 4] 레퍼런스 및 스타일 가이드
• 지향하는 무드 / 톤앤매너: ${formData.targetMood || '미입력'}
• 참고 레퍼런스 링크 1: ${formData.referenceLink1 || '미입력'}
• 참고 레퍼런스 링크 2: ${formData.referenceLink2 || '미입력'}
• 지양 스타일 및 필수 주의사항: ${formData.avoidStyles || '없음'}

■ [섹션 5] 일정 및 예산
• 원본(자료) 전달 가능 일자: ${formData.rawMaterialDate || '미정'}
• 1차 시안 희망 수령일: ${formData.firstDraftDate || '협의'}
• 최종 완료 및 납품 희망일 (필수): ${formData.finalDeliveryDate}
• 책정 예산 범위 (필수): ${formData.budgetRange}

■ [섹션 6] 기타 요청 및 전달사항
${formData.additionalNotes || '없음'}
`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const summary = generateProjectSummaryText();
    setFormattedSummary(summary);

    // 1. Copy to clipboard automatically for convenience
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
      }
    } catch {
      // Ignore clipboard fallback error
    }

    // 2. Build mailto link
    const subject = `[프로젝트 문의] ${formData.companyOrChannel} (${formData.managerNameAndTitle}님)`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(summary)}`;

    // 3. Trigger mail client
    try {
      window.location.href = mailtoUrl;
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onShowToast('문의 내용이 클립보드에 복사되었으며 메일 앱이 실행되었습니다.');
    }, 350);
  };

  const handleCopySummary = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(formattedSummary);
      }
      setCopied(true);
      onShowToast('문의 내용이 클립보드에 복사되었습니다.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      onShowToast('클립보드에 복사되었습니다.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col h-[94vh] max-h-[920px] w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0d0d10] border border-neutral-800 text-neutral-100 shadow-2xl shadow-black/80"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#121216] px-5 sm:px-7 py-4.5 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Start a Project
                </h2>
              </div>
              <p className="text-xs text-neutral-400 leading-normal">
                준비 중이신 프로젝트에 대해 편하게 남겨주세요. 꼼꼼히 확인 후 회신드립니다.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700 hover:text-white transition cursor-pointer shrink-0 ml-3"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6 custom-scrollbar bg-[#0d0d10]">
            {isSubmitted ? (
              /* Success / Completed View */
              <div className="py-8 sm:py-12 text-center max-w-lg mx-auto space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
                  <Check size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    프로젝트 문의 작성이 완료되었습니다
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed break-keep">
                    기본 메일 앱이 실행되었습니다. 메일 앱이 바로 열리지 않더라도
                    <strong className="text-neutral-200"> 내용이 클립보드에 복사</strong>되어 있으니
                    네이버, Gmail 등 웹메일에 그대로 붙여넣어 전송하실 수 있습니다.
                  </p>
                </div>

                {/* Direct Mail Info Box */}
                <div className="rounded-xl border border-neutral-800 bg-[#141418] p-4.5 text-left space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                    <span>수신 메일 주소</span>
                    <strong className="text-white font-mono">{targetEmail}</strong>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <button
                      onClick={handleCopySummary}
                      className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition cursor-pointer border border-neutral-700"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copied ? '복사 완료' : '문의 전문 다시 복사'}
                    </button>

                    <a
                      href={`mailto:${targetEmail}?subject=${encodeURIComponent(
                        `[프로젝트 문의] ${formData.companyOrChannel}`
                      )}&body=${encodeURIComponent(formattedSummary)}`}
                      className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer shadow-md shadow-indigo-600/20"
                    >
                      <ExternalLink size={13} />
                      메일 앱 다시 열기
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-6 py-2.5 text-xs font-semibold text-neutral-200 transition cursor-pointer border border-neutral-700"
                  >
                    <RotateCcw size={13} />
                    확인 및 창 닫기
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* [섹션 1] 기본 정보 */}
                <section className="rounded-2xl border border-neutral-800/90 bg-[#121217] p-5 sm:p-6 space-y-4 shadow-sm hover:border-neutral-700/80 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                        01
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        기본 정보
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      필수 입력
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 업체/채널명 */}
                    <div id="field-companyOrChannel" className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                        <span className="flex items-center gap-1.5">
                          업체 / 채널명
                          <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyOrChannel}
                        onChange={(e) => {
                          setFormData({ ...formData, companyOrChannel: e.target.value });
                          if (errors.companyOrChannel) {
                            setErrors({ ...errors, companyOrChannel: '' });
                          }
                        }}
                        placeholder="예: staylovey (또는 브랜드 / 채널명)"
                        className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                          errors.companyOrChannel
                            ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.companyOrChannel && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle size={11} /> {errors.companyOrChannel}
                        </p>
                      )}
                    </div>

                    {/* 담당자 성함 / 직함 */}
                    <div id="field-managerNameAndTitle" className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                        <span className="flex items-center gap-1.5">
                          담당자 성함 및 직함
                          <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.managerNameAndTitle}
                        onChange={(e) => {
                          setFormData({ ...formData, managerNameAndTitle: e.target.value });
                          if (errors.managerNameAndTitle) {
                            setErrors({ ...errors, managerNameAndTitle: '' });
                          }
                        }}
                        placeholder="예: 홍길동 팀장 / 마케팅 디렉터"
                        className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                          errors.managerNameAndTitle
                            ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.managerNameAndTitle && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle size={11} /> {errors.managerNameAndTitle}
                        </p>
                      )}
                    </div>

                    {/* 연락처 */}
                    <div id="field-contact" className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                        <span className="flex items-center gap-1.5">
                          연락처 (유선 또는 이메일)
                          <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.contact}
                        onChange={(e) => {
                          setFormData({ ...formData, contact: e.target.value });
                          if (errors.contact) {
                            setErrors({ ...errors, contact: '' });
                          }
                        }}
                        placeholder="예: 010-1234-5678 또는 contact@domain.com"
                        className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                          errors.contact
                            ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.contact && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle size={11} /> {errors.contact}
                        </p>
                      )}
                    </div>

                    {/* 브랜드 및 채널 링크 */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                        <span className="flex items-center gap-1.5">브랜드 및 채널 링크</span>
                        <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                      </label>
                      <input
                        type="text"
                        value={formData.brandUrl}
                        onChange={(e) => setFormData({ ...formData, brandUrl: e.target.value })}
                        placeholder="예: https://youtube.com/@staylovey 또는 웹사이트 링크"
                        className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* [섹션 2] 의뢰 프로젝트 유형 */}
                <section className="rounded-2xl border border-neutral-800/90 bg-[#121217] p-5 sm:p-6 space-y-4 shadow-sm hover:border-neutral-700/80 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                        02
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        의뢰 프로젝트 유형
                      </h3>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      선택 시 세부 항목이 자동 구성됩니다
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectTypeOptions.map((opt) => {
                      const isSelected = formData.projectType === opt.type;
                      return (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, projectType: opt.type }));
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.videoRawFootage;
                              delete updated.videoTargetLength;
                              delete updated.ecommerceUsp;
                              delete updated.otherDetails;
                              return updated;
                            });
                          }}
                          className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/[0.08] text-white ring-1 ring-indigo-500/25 shadow-sm shadow-indigo-500/5'
                              : 'border-neutral-800 bg-[#0b0b0e] text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                : 'bg-neutral-800/80 text-neutral-400'
                            }`}
                          >
                            {opt.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-semibold truncate text-white">
                                {opt.label}
                              </span>
                              <span
                                className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-1.5 transition-all ${
                                  isSelected
                                    ? 'border-indigo-500 bg-indigo-600 text-white'
                                    : 'border-neutral-700 bg-neutral-900'
                                }`}
                              >
                                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-neutral-400 leading-tight">
                              {opt.sublabel}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* [섹션 3] 작업 세부 사항 (조건부 전환) */}
                <section className="rounded-2xl border border-neutral-800/90 bg-[#121217] p-5 sm:p-6 space-y-4 shadow-sm hover:border-neutral-700/80 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                        03
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        작업 세부 사항
                      </h3>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                      {formData.projectType === 'youtube_long' && '유튜브 롱폼'}
                      {formData.projectType === 'shortform' && '숏폼 영상'}
                      {formData.projectType === 'ecommerce_detail' && '상세페이지'}
                      {formData.projectType === 'other' && '기타 문의'}
                    </span>
                  </div>

                  {/* CASE 1: 유튜브 롱폼 또는 숏폼 */}
                  {(formData.projectType === 'youtube_long' ||
                    formData.projectType === 'shortform') && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 원본 촬영본 분량 */}
                        <div id="field-videoRawFootage" className="space-y-1.5">
                          <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                            <span className="flex items-center gap-1.5">
                              원본 촬영본 분량 (총 러닝타임 / 용량)
                              <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.videoRawFootage}
                            onChange={(e) => {
                              setFormData({ ...formData, videoRawFootage: e.target.value });
                              if (errors.videoRawFootage) {
                                setErrors({ ...errors, videoRawFootage: '' });
                              }
                            }}
                            placeholder="예: 4K 촬영본 약 1시간 분량 / 30GB"
                            className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                              errors.videoRawFootage
                                ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                                : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                          />
                          {errors.videoRawFootage && (
                            <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                              <AlertCircle size={11} /> {errors.videoRawFootage}
                            </p>
                          )}
                        </div>

                        {/* 최종 납품 희망 영상 길이 */}
                        <div id="field-videoTargetLength" className="space-y-1.5">
                          <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                            <span className="flex items-center gap-1.5">
                              최종 납품 희망 영상 길이
                              <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.videoTargetLength}
                            onChange={(e) => {
                              setFormData({ ...formData, videoTargetLength: e.target.value });
                              if (errors.videoTargetLength) {
                                setErrors({ ...errors, videoTargetLength: '' });
                              }
                            }}
                            placeholder={
                              formData.projectType === 'shortform'
                                ? '예: 30초 ~ 60초 내외'
                                : '예: 10분 ~ 15분 내외'
                            }
                            className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                              errors.videoTargetLength
                                ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                                : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                            }`}
                          />
                          {errors.videoTargetLength && (
                            <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                              <AlertCircle size={11} /> {errors.videoTargetLength}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 영상 자료 드라이브 URL */}
                      <div className="space-y-1.5 rounded-xl border border-neutral-800/70 bg-[#0b0b0e] p-3.5">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                          <span className="flex items-center gap-1.5">
                            <HardDrive size={13} className="text-indigo-400" />
                            영상 자료 / 원본 드라이브 URL
                          </span>
                          <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                        </label>
                        <input
                          type="text"
                          value={formData.videoDriveUrl || ''}
                          onChange={(e) => setFormData({ ...formData, videoDriveUrl: e.target.value })}
                          placeholder="구글 드라이브, Dropbox 공유 링크 (권한: 링크가 있는 모든 사용자 보기 가능)"
                          className="w-full rounded-lg border border-neutral-800 bg-[#121217] px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                        <p className="text-[11px] text-neutral-400 leading-relaxed pt-0.5">
                          촬영 원본 또는 대본 파일이 담긴 드라이브 링크를 남겨주시면 더 빠르고 정확한 견적 검토가 가능합니다.
                        </p>
                      </div>

                      {/* 작업 범위 */}
                      <div className="space-y-2 pt-1">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                          <span>작업 범위 (중복 선택)</span>
                          <span className="text-[10px] text-neutral-500 font-normal">다중 선택 가능</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {videoScopeOptions.map((item) => {
                            const isChecked = formData.videoScope.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => handleScopeToggle(item)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                  isChecked
                                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm'
                                    : 'border-neutral-800 bg-[#0b0b0e] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                                }`}
                              >
                                <span
                                  className={`h-3.5 w-3.5 rounded flex items-center justify-center text-[10px] transition-colors ${
                                    isChecked ? 'bg-indigo-600 text-white' : 'border border-neutral-700 bg-neutral-900'
                                  }`}
                                >
                                  {isChecked && <Check size={10} />}
                                </span>
                                <span>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 업로드 주기 또는 의뢰 건수 */}
                      <div className="space-y-1.5 pt-1">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                          <span>업로드 주기 또는 의뢰 건수</span>
                          <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                        </label>
                        <input
                          type="text"
                          value={formData.videoFrequency}
                          onChange={(e) => setFormData({ ...formData, videoFrequency: e.target.value })}
                          placeholder="예: 단건 의뢰 / 주 1회 정기 업로드 / 월 4편 정기 계약"
                          className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* CASE 2: E-커머스 상세페이지 기획 & 디자인 */}
                  {formData.projectType === 'ecommerce_detail' && (
                    <div className="space-y-4">
                      {/* 제품군 및 셀링 포인트 */}
                      <div id="field-ecommerceUsp" className="space-y-1.5">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                          <span className="flex items-center gap-1.5">
                            제품군 및 주요 셀링 포인트(USP)
                            <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                          </span>
                        </label>
                        <textarea
                          rows={3}
                          value={formData.ecommerceUsp}
                          onChange={(e) => {
                            setFormData({ ...formData, ecommerceUsp: e.target.value });
                            if (errors.ecommerceUsp) {
                              setErrors({ ...errors, ecommerceUsp: '' });
                            }
                          }}
                          placeholder="예: 기능성 스킨케어 앰플 — 특허 성분 흡수율 및 임상 전후 데이터 시각화 필요"
                          className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all resize-none ${
                            errors.ecommerceUsp
                              ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                              : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                          }`}
                        />
                        {errors.ecommerceUsp && (
                          <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                            <AlertCircle size={11} /> {errors.ecommerceUsp}
                          </p>
                        )}
                      </div>

                      {/* 이미지 / 리소스 전달 안내 배너 */}
                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-3.5 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                          <Mail size={13} className="text-indigo-400" />
                          <span>상세페이지 이미지 및 기획 자료 전달 안내</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          대용량 파일(고해상도 제품컷, 누끼컷, 원고, PSD 등)은 파일 용량 관계로 문의 전송 후
                          <strong className="text-indigo-300 font-medium"> contact@staylovey.com </strong>
                          으로 별도 첨부하여 송부해 주시거나, 아래 클라우드 링크로 공유해 주시면 원활히 검토됩니다.
                        </p>
                      </div>

                      {/* 자료 드라이브 링크 입력 필드 */}
                      <div className="space-y-1.5 rounded-xl border border-neutral-800/70 bg-[#0b0b0e] p-3.5">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                          <span className="flex items-center gap-1.5">
                            <HardDrive size={13} className="text-indigo-400" />
                            상세페이지 자료 드라이브 URL
                          </span>
                          <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                        </label>
                        <input
                          type="text"
                          value={formData.ecommerceDriveUrl || ''}
                          onChange={(e) => setFormData({ ...formData, ecommerceDriveUrl: e.target.value })}
                          placeholder="구글 드라이브, Dropbox, 네이버 MYBOX 공유 링크"
                          className="w-full rounded-lg border border-neutral-800 bg-[#121217] px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                      </div>

                      {/* 제공 가능 리소스 */}
                      <div className="space-y-2 pt-1">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                          <span>제공 가능 리소스 (중복 선택)</span>
                          <span className="text-[10px] text-neutral-500 font-normal">다중 선택 가능</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {ecommerceResourceOptions.map((item) => {
                            const isChecked = formData.ecommerceResources.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => handleResourceToggle(item)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                  isChecked
                                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm'
                                    : 'border-neutral-800 bg-[#0b0b0e] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                                }`}
                              >
                                <span
                                  className={`h-3.5 w-3.5 rounded flex items-center justify-center text-[10px] transition-colors ${
                                    isChecked ? 'bg-indigo-600 text-white' : 'border border-neutral-700 bg-neutral-900'
                                  }`}
                                >
                                  {isChecked && <Check size={10} />}
                                </span>
                                <span>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 예상 작업 분량 */}
                      <div className="space-y-1.5 pt-1">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                          <span>예상 작업 분량</span>
                          <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                        </label>
                        <input
                          type="text"
                          value={formData.ecommerceWorkload}
                          onChange={(e) => setFormData({ ...formData, ecommerceWorkload: e.target.value })}
                          placeholder="예: 모바일 가로 860px 기준 8~12개 섹션 내외"
                          className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* CASE 3: 기타 */}
                  {formData.projectType === 'other' && (
                    <div id="field-otherDetails" className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                        <span className="flex items-center gap-1.5">
                          문의 세부 내용 직접 입력
                          <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={formData.otherDetails}
                        onChange={(e) => {
                          setFormData({ ...formData, otherDetails: e.target.value });
                          if (errors.otherDetails) {
                            setErrors({ ...errors, otherDetails: '' });
                          }
                        }}
                        placeholder="기획 의도, 프로젝트 목표, 필요하신 협업 범위(브랜딩/모션/종합 콘텐츠 등)를 구체적으로 남겨주세요."
                        className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all resize-none ${
                          errors.otherDetails
                            ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.otherDetails && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle size={11} /> {errors.otherDetails}
                        </p>
                      )}
                    </div>
                  )}
                </section>

                {/* [섹션 4] 레퍼런스 및 스타일 가이드 */}
                <section className="rounded-2xl border border-neutral-800/90 bg-[#121217] p-5 sm:p-6 space-y-4 shadow-sm hover:border-neutral-700/80 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                        04
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        레퍼런스 및 스타일 가이드
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 bg-neutral-800/80 border border-neutral-700/60 px-2 py-0.5 rounded-full">
                      선택 사항
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* 지향하는 무드 / 톤앤매너 */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                        <span>지향하는 무드 / 톤앤매너</span>
                        <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                      </label>
                      <input
                        type="text"
                        value={formData.targetMood}
                        onChange={(e) => setFormData({ ...formData, targetMood: e.target.value })}
                        placeholder="예: 미니멀하고 신뢰감 있는 톤 / 빠른 템포의 예능형 / 감성적 시네마틱 룩"
                        className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 참고 레퍼런스 링크 1 (선택) */}
                      <div className="space-y-1.5">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                          <span className="flex items-center gap-1.5">
                            <LinkIcon size={12} className="text-neutral-500" />
                            참고 레퍼런스 링크 1
                          </span>
                          <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                        </label>
                        <input
                          type="text"
                          value={formData.referenceLink1}
                          onChange={(e) => setFormData({ ...formData, referenceLink1: e.target.value })}
                          placeholder="예: https://youtube.com/watch?v=... 또는 웹페이지 링크"
                          className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                      </div>

                      {/* 참고 레퍼런스 링크 2 (선택) */}
                      <div className="space-y-1.5">
                        <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                          <span className="flex items-center gap-1.5">
                            <LinkIcon size={12} className="text-neutral-500" />
                            참고 레퍼런스 링크 2
                          </span>
                          <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                        </label>
                        <input
                          type="text"
                          value={formData.referenceLink2}
                          onChange={(e) => setFormData({ ...formData, referenceLink2: e.target.value })}
                          placeholder="추가 참고 레퍼런스 URL (선택)"
                          className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* 지양하는 스타일 */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                        <span>지양하는 스타일이나 필수 주의사항</span>
                        <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                      </label>
                      <input
                        type="text"
                        value={formData.avoidStyles}
                        onChange={(e) => setFormData({ ...formData, avoidStyles: e.target.value })}
                        placeholder="예: 자극적인 자막 지양 / 브랜드 공식 CI 및 컬러 가이드라인 준수"
                        className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* [섹션 5] 일정 및 예산 */}
                <section className="rounded-2xl border border-neutral-800/90 bg-[#121217] p-5 sm:p-6 space-y-4.5 shadow-sm hover:border-neutral-700/80 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                        05
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        일정 및 예산
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      납품일 & 예산 필수
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* 원본 전달 가능일 */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-neutral-500" />
                          자료 전달 가능일
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                      </label>
                      <input
                        type="date"
                        value={formData.rawMaterialDate}
                        onChange={(e) => setFormData({ ...formData, rawMaterialDate: e.target.value })}
                        className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3 py-2.5 text-xs sm:text-sm text-neutral-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                      />
                    </div>

                    {/* 1차 시안 희망일 */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-neutral-500" />
                          1차 시안 희망일
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal bg-neutral-800/80 px-1.5 py-0.5 rounded">선택</span>
                      </label>
                      <input
                        type="date"
                        value={formData.firstDraftDate}
                        onChange={(e) => setFormData({ ...formData, firstDraftDate: e.target.value })}
                        className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3 py-2.5 text-xs sm:text-sm text-neutral-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all"
                      />
                    </div>

                    {/* 최종 납품 희망일 (필수) */}
                    <div id="field-finalDeliveryDate" className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-indigo-400" />
                          최종 납품 희망일
                          <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                        </span>
                      </label>
                      <input
                        type="date"
                        value={formData.finalDeliveryDate}
                        onChange={(e) => {
                          setFormData({ ...formData, finalDeliveryDate: e.target.value });
                          if (errors.finalDeliveryDate) {
                            setErrors({ ...errors, finalDeliveryDate: '' });
                          }
                        }}
                        className={`w-full rounded-xl border bg-[#0b0b0e] px-3 py-2.5 text-xs sm:text-sm text-neutral-100 focus:outline-none transition-all ${
                          errors.finalDeliveryDate
                            ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.finalDeliveryDate && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle size={11} /> {errors.finalDeliveryDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 책정 예산 범위 (필수) */}
                  <div id="field-budgetRange" className="space-y-1.5 pt-2">
                    <label className="flex items-center justify-between text-xs font-medium text-neutral-200">
                      <span className="flex items-center gap-1.5">
                        <DollarSign size={13} className="text-indigo-400" />
                        책정 예산 범위
                        <span className="text-rose-400 text-xs font-bold" title="필수">*</span>
                      </span>
                    </label>

                    <input
                      type="text"
                      value={formData.budgetRange}
                      onChange={(e) => {
                        setFormData({ ...formData, budgetRange: e.target.value });
                        if (errors.budgetRange) {
                          setErrors({ ...errors, budgetRange: '' });
                        }
                      }}
                      placeholder="희망하시는 금액을 적어주세요"
                      className={`w-full rounded-xl border bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                        errors.budgetRange
                          ? 'border-rose-500/90 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                          : 'border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                      }`}
                    />

                    {errors.budgetRange ? (
                      <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle size={11} /> {errors.budgetRange}
                      </p>
                    ) : (
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        희망하시는 예산에 맞춰 최적의 작업 범위와 퀄리티 방안을 유연하게 제안해 드립니다.
                      </p>
                    )}
                  </div>
                </section>

                {/* [섹션 6] 기타 요청 및 전달사항 */}
                <section className="rounded-2xl border border-neutral-800/90 bg-[#121217] p-5 sm:p-6 space-y-4 shadow-sm hover:border-neutral-700/80 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                        06
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        기타 요청 및 전달사항
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 bg-neutral-800/80 border border-neutral-700/60 px-2 py-0.5 rounded-full">
                      선택 사항
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <textarea
                      rows={3}
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="작업 시 특별히 강조하고 싶은 점이나 협의가 필요한 사항을 자유롭게 적어주세요."
                      className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0e] px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </section>

                {/* 하단 고정 전송 버튼 */}
                <div className="pt-3 sticky bottom-0 bg-[#0d0d10]/95 pb-1 backdrop-blur-md border-t border-neutral-800/80">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>문의 내용 취합 중...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>프로젝트 문의 보내기</span>
                        <Send size={15} className="ml-0.5" />
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[11px] text-neutral-500">
                    클릭 시 문의 내용이 클립보드에 자동 복사되고 {targetEmail} 수신 메일 창이 호출됩니다.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
