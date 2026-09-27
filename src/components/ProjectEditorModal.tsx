import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Project, DetailSection } from "../types";
import {
  X,
  Check,
  Film,
  Image as ImageIcon,
  Play,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  Wand2,
  RefreshCw,
  CheckCheck,
  ShoppingBag,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Monitor,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { requireSupabase } from "../lib/supabase";
import { uploadPortfolioAsset } from "../lib/storage";
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from "../lib/youtube";

interface ProjectEditorModalProps {
  isOpen: boolean;
  projectToEdit: Project | null;
  onClose: () => void;
  onSave: (projectData: Omit<Project, "id">, id?: string) => Promise<void>;
}

const PRESET_VIDEO_IMAGES = [
  {
    label: "테크/기기 리뷰",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "감성 브이로그",
    url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "패션/뷰티 숏폼",
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "지식/경제 정보",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  },
];

const PRESET_PRODUCT_IMAGES = [
  {
    label: "뷰티/스킨케어 LP",
    url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "프리미엄 텀블러 LP",
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "주방/생활용품 LP",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "원두/F&B 식품 LP",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "음향/테크 가전 LP",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
];

const PRODUCT_CATEGORIES = [
  "뷰티/화장품",
  "식품/F&B",
  "생활/가전",
  "패션/잡화",
  "헬스/건강식",
  "와디즈/텀블벅 펀딩",
  "IT/테크",
];

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  projectToEdit,
  onClose,
  onSave,
}) => {
  // Category state
  const [category, setCategory] = useState<
    "YOUTUBE VIDEO" | "PRODUCT PAGE" | "SHORTS / REELS"
  >("YOUTUBE VIDEO");
  const isProductPage = category === "PRODUCT PAGE";
  const isShorts = category === "SHORTS / REELS";

  // Common metadata
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("2024");
  const [client, setClient] = useState("");
  const [role, setRole] = useState("영상 컷편집 & 모션 자막");
  const [duration, setDuration] = useState("12분 40초 롱폼");
  const [image, setImage] = useState(PRESET_VIDEO_IMAGES[0].url);
  const [videoUrl, setVideoUrl] = useState("");
  const [mediaDisplay, setMediaDisplay] = useState<"thumbnail" | "youtube">(
    "thumbnail",
  );
  const [description, setDescription] = useState("");
  const [fullStory, setFullStory] = useState("");
  const [featuredInHome, setFeaturedInHome] = useState(true);
  const [tools, setTools] = useState<string[]>(["Premiere Pro", "Photoshop"]);
  const [toolInput, setToolInput] = useState("");

  // Product Page Exclusive fields
  const [productCategory, setProductCategory] = useState("뷰티/화장품");
  const [longDetailImage, setLongDetailImage] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [detailSections, setDetailSections] = useState<DetailSection[]>([]);
  const [showSectionBuilder, setShowSectionBuilder] = useState(false);

  // Highlights
  const [highlights, setHighlights] = useState<string[]>([
    "말과 말 사이 불필요한 숨소리 및 딜레이 완벽 제거 (타이트한 컷편집)",
    "눈에 띄는 가독성 높은 맞춤 자막 바 및 하이라이트 텍스트",
    "상황에 맞는 적재적소 효과음(SFX) 및 BGM 볼륨 밸런싱",
  ]);

  // AI Suggestion State
  const [roughNotes, setRoughNotes] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<{
    description?: string;
    fullStory?: string;
    highlights?: string[];
  } | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  // Handle Category Switching and smart defaults
  const handleCategorySelect = (
    newCat: "YOUTUBE VIDEO" | "PRODUCT PAGE" | "SHORTS / REELS",
  ) => {
    setCategory(newCat);
    setAiGeneratedResult(null);
    setRoughNotes("");

    if (newCat === "PRODUCT PAGE") {
      if (!projectToEdit) {
        setRole("상세페이지 기획 & 비주얼 디자인 (올인원)");
        setDuration("860px x 12,000px (8단락)");
        setImage(PRESET_PRODUCT_IMAGES[0].url);
        setTools(["Photoshop", "Figma", "Illustrator"]);
        setHighlights([
          "소비자의 시선을 단숨에 사로잡는 상단 인트로 히어로 섹션 및 카피라이팅",
          "제품의 핵심 소구점(USP)과 특장점을 한눈에 각인시키는 직관적인 인포그래픽",
          "모바일(390px) 스크롤 환경에 최적화된 폰트 위계 및 구매 전환(CTA) 유도 설계",
        ]);
        setVideoUrl("");
      }
    } else if (newCat === "SHORTS / REELS") {
      if (!projectToEdit) {
        setRole("숏폼 기획 & 빠른 템포 컷편집");
        setDuration("0:45 (세로형 9:16)");
        setImage(PRESET_VIDEO_IMAGES[2].url);
        setTools(["Premiere Pro", "After Effects", "CapCut"]);
        setHighlights([
          "초반 1~3초 내 시청자 이탈을 방지하는 강력한 시각적 훅(Hooking)",
          "모바일 화면에 최적화된 중앙 볼드 자막 및 모션 그래픽",
          "비트에 맞춘 빠른 템포의 점프컷과 트렌디한 SFX 효과음",
        ]);
        setVideoUrl(
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        );
      }
    } else {
      if (!projectToEdit) {
        setRole("유튜브 메인 영상 컷편집 & 자막 디자인");
        setDuration("12분 40초 롱폼");
        setImage(PRESET_VIDEO_IMAGES[0].url);
        setTools(["Premiere Pro", "Photoshop"]);
        setHighlights([
          "시청 지속시간을 높이는 타이트한 컷 호흡 조절",
          "가독성을 극대화한 맞춤 폰트 자막 디자인",
          "오디오 정밀 레벨링 및 현장감을 살리는 SFX/BGM 밸런싱",
        ]);
        setVideoUrl(
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        );
      }
    }
  };

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setSubtitle(projectToEdit.subtitle || "");
      const cat =
        projectToEdit.category === "PRODUCT PAGE"
          ? "PRODUCT PAGE"
          : projectToEdit.category === "SHORTS / REELS"
            ? "SHORTS / REELS"
            : "YOUTUBE VIDEO";
      setCategory(cat);
      setYear(projectToEdit.year || "2024");
      setClient(projectToEdit.client || "");
      setRole(
        projectToEdit.role ||
          (cat === "PRODUCT PAGE" ? "상세페이지 디자인" : "영상 편집"),
      );
      setDuration(projectToEdit.duration || "");
      setImage(
        projectToEdit.image ||
          (cat === "PRODUCT PAGE"
            ? PRESET_PRODUCT_IMAGES[0].url
            : PRESET_VIDEO_IMAGES[0].url),
      );
      setVideoUrl(projectToEdit.videoUrl || "");
      setMediaDisplay(
        projectToEdit.mediaDisplay ||
          (projectToEdit.videoUrl ? "youtube" : "thumbnail"),
      );
      setDescription(projectToEdit.description || "");
      setFullStory(projectToEdit.fullStory || "");
      setFeaturedInHome(projectToEdit.featuredInHome ?? true);
      setTools(
        projectToEdit.tools ||
          (cat === "PRODUCT PAGE"
            ? ["Photoshop", "Figma"]
            : ["Premiere Pro", "Photoshop"]),
      );
      setProductCategory(projectToEdit.productCategory || "뷰티/화장품");
      setLongDetailImage(projectToEdit.longDetailImage || "");
      setStoreUrl(projectToEdit.storeUrl || "");
      setDetailSections(projectToEdit.detailSections || []);
      setHighlights(
        projectToEdit.highlights && projectToEdit.highlights.length > 0
          ? projectToEdit.highlights
          : [""],
      );
      setRoughNotes("");
      setAiGeneratedResult(null);
      setShowAiAssistant(false);
    } else {
      // Default reset to YouTube Video
      setTitle("");
      setSubtitle("");
      setCategory("YOUTUBE VIDEO");
      setYear(new Date().getFullYear().toString());
      setClient("");
      setRole("유튜브 메인 영상 컷편집 & 자막 디자인");
      setDuration("12분 40초 롱폼");
      setImage(PRESET_VIDEO_IMAGES[0].url);
      setVideoUrl(
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      );
      setMediaDisplay("thumbnail");
      setDescription("");
      setFullStory("");
      setFeaturedInHome(true);
      setTools(["Premiere Pro", "Photoshop"]);
      setProductCategory("뷰티/화장품");
      setLongDetailImage("");
      setStoreUrl("");
      setDetailSections([]);
      setHighlights([
        "시청 지속시간을 높이는 타이트한 컷 호흡 조절",
        "가독성을 극대화한 맞춤 폰트 자막 디자인",
        "오디오 정밀 레벨링 및 현장감을 살리는 SFX/BGM 밸런싱",
      ]);
      setRoughNotes("");
      setAiGeneratedResult(null);
      setShowAiAssistant(false);
    }
  }, [projectToEdit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setShowCloseConfirm(false);
  }, [isOpen]);

  // AI Suggestion function tailored for Category
  const handleRequestAISuggest = async (
    targetField?: "description" | "fullStory" | "all",
  ) => {
    setIsGeneratingAI(true);
    setAiSuccessMsg(null);
    try {
      const { data, error } = await requireSupabase().functions.invoke(
        "ai-suggest",
        {
          body: {
            title,
            category,
            client,
            role,
            productCategory: isProductPage ? productCategory : undefined,
            roughNotes:
              roughNotes.trim() ||
              description ||
              title ||
              (isProductPage
                ? "이커머스 상세페이지 기획 디자인"
                : "전문적인 영상 편집 작업"),
            targetField: targetField || "all",
          },
        },
      );

      if (error) throw error;
      if (data && data.result) {
        if (targetField === "description" && typeof data.result === "string") {
          setDescription(data.result);
          setAiSuccessMsg(
            isProductPage
              ? "상세페이지 요약 카피가 적용되었습니다!"
              : "영상 요약 문구가 적용되었습니다!",
          );
        } else if (
          targetField === "fullStory" &&
          typeof data.result === "string"
        ) {
          setFullStory(data.result);
          setAiSuccessMsg(
            isProductPage
              ? "상세페이지 기획/디자인 스토리가 적용되었습니다!"
              : "영상 편집 스토리가 적용되었습니다!",
          );
        } else if (typeof data.result === "object") {
          setAiGeneratedResult(data.result);
          setShowAiAssistant(true);
          setAiSuccessMsg(
            isProductPage
              ? "✨ AI가 이커머스 상세페이지에 최적화된 전문 카피와 스토리를 작성했습니다!"
              : "✨ AI가 영상 포트폴리오에 어울리는 소개 문구를 작성했습니다!",
          );
        }
      }
    } catch (err) {
      console.error("AI Suggest call failed", err);
      alert("AI 문구 추천 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyAllAI = () => {
    if (!aiGeneratedResult) return;
    if (aiGeneratedResult.description)
      setDescription(aiGeneratedResult.description);
    if (aiGeneratedResult.fullStory) setFullStory(aiGeneratedResult.fullStory);
    if (
      aiGeneratedResult.highlights &&
      aiGeneratedResult.highlights.length > 0
    ) {
      setHighlights(aiGeneratedResult.highlights);
    }
    setAiSuccessMsg("✨ 모든 AI 추천 문구가 폼에 적용되었습니다!");
  };

  if (!isOpen) return null;

  const handleAddTool = () => {
    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
      setTools([...tools, toolInput.trim()]);
      setToolInput("");
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const requestClose = () => {
    if (!isSaving) setShowCloseConfirm(true);
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };

  const handleAddHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Section Builder handlers for Detail Page
  const handleAddSection = () => {
    const newSectionNum = detailSections.length + 1;
    setDetailSections([
      ...detailSections,
      {
        badge: `POINT 0${newSectionNum}`,
        title: `섹션 0${newSectionNum} 타이틀`,
        subtitle: "핵심 소구점 및 설명",
        image: image || PRESET_PRODUCT_IMAGES[0].url,
        text: "이 섹션에서 전달하고자 하는 제품 특장점과 신뢰도 요소 설명입니다.",
        points: ["세부 특징 1", "세부 특징 2"],
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setDetailSections(detailSections.filter((_, i) => i !== index));
  };

  const handleSectionFieldChange = (
    index: number,
    field: keyof DetailSection,
    value: any,
  ) => {
    const updated = [...detailSections];
    updated[index] = { ...updated[index], [field]: value };
    setDetailSections(updated);
  };

  const categoryTag = isProductPage ? "PRODUCT" : isShorts ? "SHORTS" : "VIDEO";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(
        isProductPage
          ? "상품명 / 프로젝트 제목을 입력해 주세요."
          : "영상 제목을 입력해 주세요.",
      );
      return;
    }
    if (!description.trim()) {
      alert("요약 설명을 입력해 주세요.");
      return;
    }

    if (
      !isProductPage &&
      mediaDisplay === "youtube" &&
      !getYouTubeVideoId(videoUrl)
    ) {
      alert(
        "YouTube 영상 표시를 사용하려면 유효한 YouTube 링크를 입력해 주세요.",
      );
      return;
    }

    const youtubeThumbnail =
      !isProductPage && mediaDisplay === "youtube"
        ? getYouTubeThumbnailUrl(videoUrl)
        : null;

    const projectData: Omit<Project, "id"> = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      categoryTag,
      year: year.trim() || "2024",
      client:
        client.trim() ||
        (isProductPage ? "브랜드사 프로젝트" : "개인/채널 프로젝트"),
      role:
        role.trim() ||
        (isProductPage ? "상세페이지 디자인" : "영상 컷편집 & 디자인"),
      duration: duration.trim() || undefined,
      image:
        youtubeThumbnail ||
        image.trim() ||
        (isProductPage
          ? PRESET_PRODUCT_IMAGES[0].url
          : PRESET_VIDEO_IMAGES[0].url),
      videoUrl: isProductPage ? undefined : videoUrl.trim() || undefined,
      mediaDisplay: isProductPage ? undefined : mediaDisplay,
      description: description.trim(),
      fullStory: fullStory.trim() || description.trim(),
      featuredInHome,
      tools:
        tools.length > 0
          ? tools
          : isProductPage
            ? ["Photoshop", "Figma"]
            : ["Premiere Pro"],
      highlights: highlights.filter((h) => h.trim().length > 0),
      productCategory: isProductPage ? productCategory : undefined,
      longDetailImage: isProductPage
        ? longDetailImage.trim() || undefined
        : undefined,
      storeUrl: isProductPage ? storeUrl.trim() || undefined : undefined,
      detailSections:
        isProductPage && detailSections.length > 0 ? detailSections : undefined,
    };

    setIsSaving(true);
    try {
      await onSave(projectData, projectToEdit?.id);
      onClose();
    } catch (error) {
      console.error("Project save failed", error);
      alert(
        error instanceof Error
          ? error.message
          : "프로젝트를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-none p-3 pt-20 sm:p-6 sm:pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={requestClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-neutral-200/90 z-10 overflow-hidden my-2 sm:my-4 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 sm:px-8 bg-neutral-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-blue-600 uppercase border border-blue-200/60">
                  {projectToEdit ? "EDIT PROJECT" : "NEW PROJECT"}
                </span>
                <span className="text-xs text-neutral-400">게시글 관리자</span>
              </div>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
                {projectToEdit
                  ? isProductPage
                    ? "🛍️ 상세페이지 게시글 수정"
                    : "📹 영상 프로젝트 게시글 수정"
                  : isProductPage
                    ? "🛍️ 새 상세페이지 등록"
                    : "📹 새 영상 프로젝트 등록"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-full bg-neutral-200/80 p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === "form"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  편집 폼
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === "preview"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <Eye size={12} />
                  <span>미리보기</span>
                </button>
              </div>

              <button
                onClick={requestClose}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          {activeTab === "form" ? (
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-2">
                  1. 작업 카테고리 선택 (카테고리에 따라 양식과 AI 작성이 자동
                  최적화됩니다) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "YOUTUBE VIDEO",
                      label: "유튜브 롱폼",
                      sub: "Long-form Video",
                      icon: Film,
                      color: "blue",
                    },
                    {
                      id: "SHORTS / REELS",
                      label: "숏폼 / 릴스",
                      sub: "Vertical 9:16",
                      icon: Play,
                      color: "purple",
                    },
                    {
                      id: "PRODUCT PAGE",
                      label: "상세페이지 LP",
                      sub: "e-Commerce LP",
                      icon: ShoppingBag,
                      color: "emerald",
                    },
                  ].map((cat) => {
                    const isSelected = category === cat.id;
                    const IconComp = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id as any)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? cat.id === "PRODUCT PAGE"
                              ? "border-emerald-600 bg-emerald-50/60 text-emerald-950 shadow-xs ring-2 ring-emerald-600/20"
                              : "border-blue-600 bg-blue-50/60 text-blue-950 shadow-xs ring-2 ring-blue-600/20"
                            : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600"
                        }`}
                      >
                        <IconComp
                          size={20}
                          className={
                            isSelected
                              ? cat.id === "PRODUCT PAGE"
                                ? "text-emerald-600 mb-1.5"
                                : "text-blue-600 mb-1.5"
                              : "text-neutral-400 mb-1.5"
                          }
                        />
                        <span className="font-bold text-xs sm:text-sm">
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          {cat.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Metadata Section depending on Category */}
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/40 p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200/60 pb-2.5">
                  <Tag
                    size={15}
                    className={
                      isProductPage ? "text-emerald-600" : "text-blue-600"
                    }
                  />
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    {isProductPage
                      ? "2. 상세페이지 기본 정보"
                      : "2. 영상 프로젝트 기본 정보"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      {isProductPage
                        ? "상품명 / 상세페이지 프로젝트 제목 *"
                        : "영상 프로젝트 제목 *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        isProductPage
                          ? "예: 퓨어랩스 비건 시카 카밍 수분크림 펀딩 상세페이지"
                          : isShorts
                            ? "예: 데일리 OOTD & 뷰티 트렌드 숏폼"
                            : "예: 2026 플래그십 스마트폰 언박싱 리뷰 롱폼"
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      영문 서브타이틀 / 프로젝트 서브명
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder={
                        isProductPage
                          ? "예: Wadiz & SmartStore High-Conversion Landing Page"
                          : "예: Tech & Gadget Review Long-form"
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Client / Channel / Brand */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      {isProductPage
                        ? "브랜드명 / 고객사 (Brand / Client)"
                        : "클라이언트 / 유튜브 채널명"}
                    </label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder={
                        isProductPage
                          ? "예: 퓨어랩스 (PureLabs)"
                          : "예: IT/테크 크리에이터 채널"
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Product Category (Only for Product Page) */}
                  {isProductPage && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                        상품 / 비즈니스 카테고리 (AI 문구 생성 시 정밀 반영)
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setProductCategory(cat)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              productCategory === cat
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        placeholder="직접 입력 (예: 뷰티/스킨케어, 텀블벅 크라우드 펀딩, 캠핑/아웃도어 등)"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-emerald-600 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  )}

                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      제작 연도 (Year)
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Duration / Page Spec */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      {isProductPage
                        ? "상세페이지 규격 / 길이 (Spec / Height)"
                        : "영상 분량 / 길이 (Duration)"}
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder={
                        isProductPage
                          ? "예: 860px x 12,000px (8단락) or 스마트스토어 규격"
                          : isShorts
                            ? "예: 0:45 (세로형 9:16)"
                            : "예: 14분 30초 롱폼"
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Role */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      담당 역할 (Role)
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder={
                        isProductPage
                          ? "예: 기획 100% + 비주얼 디자인 100% (올인원 제작)"
                          : "예: 메인 영상 컷편집 & 가독성 자막 디자인"
                      }
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Media & Visual Assets */}
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/40 p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200/60 pb-2.5">
                  <ImageIcon
                    size={15}
                    className={
                      isProductPage ? "text-emerald-600" : "text-blue-600"
                    }
                  />
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    {isProductPage
                      ? "3. 상세페이지 대표 이미지 및 뷰어 에셋"
                      : "3. 썸네일 및 동영상 링크"}
                  </span>
                </div>

                {/* Primary Thumbnail Image URL */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                    {isProductPage
                      ? "대표 썸네일 / 히어로 메인 이미지 URL *"
                      : "대표 썸네일 이미지 URL *"}
                  </label>
                  <input
                    type="url"
                    required={isProductPage || mediaDisplay === "thumbnail"}
                    disabled={!isProductPage && mediaDisplay === "youtube"}
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium focus:outline-none transition shadow-2xs mb-2 ${
                      !isProductPage && mediaDisplay === "youtube"
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                        : "border-neutral-200 bg-white text-neutral-900 focus:border-blue-600"
                    }`}
                  />
                  <label
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-bold ${
                      !isProductPage && mediaDisplay === "youtube"
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                        : "cursor-pointer border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Upload image to Supabase Storage
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!isProductPage && mediaDisplay === "youtube"}
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        try {
                          setImage(await uploadPortfolioAsset(file));
                        } catch (error) {
                          alert(
                            error instanceof Error
                              ? error.message
                              : "Image upload failed.",
                          );
                        } finally {
                          event.target.value = "";
                        }
                      }}
                    />
                  </label>

                  {/* Preset Image Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                    <span className="text-[11px] text-neutral-400 font-bold shrink-0">
                      추천 프리셋:
                    </span>
                    {(isProductPage
                      ? PRESET_PRODUCT_IMAGES
                      : PRESET_VIDEO_IMAGES
                    ).map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        disabled={!isProductPage && mediaDisplay === "youtube"}
                        onClick={() => setImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg font-medium text-[11px] shrink-0 transition ${
                          !isProductPage && mediaDisplay === "youtube"
                            ? "cursor-not-allowed bg-neutral-100 text-neutral-300"
                            : isProductPage
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media display mode and video URL (Only for Video Projects) */}
                {!isProductPage && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3">
                      <div className="min-w-0">
                        <label
                          htmlFor="media-display-toggle"
                          className="block text-xs font-bold tracking-wider text-neutral-800 uppercase"
                        >
                          대표 미디어 표시 방식
                        </label>
                        <p className="mt-1 text-[11px] text-neutral-500 break-keep">
                          {mediaDisplay === "thumbnail"
                            ? "프로젝트를 열면 등록한 썸네일 이미지가 먼저 표시됩니다."
                            : "썸네일 이미지 입력이 비활성화되고 YouTube 영상이 먼저 표시됩니다."}
                        </p>
                      </div>
                      <button
                        id="media-display-toggle"
                        type="button"
                        role="switch"
                        aria-checked={mediaDisplay === "thumbnail"}
                        onClick={() =>
                          setMediaDisplay((current) =>
                            current === "youtube" ? "thumbnail" : "youtube",
                          )
                        }
                        className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                          mediaDisplay === "thumbnail"
                            ? "bg-blue-600"
                            : "bg-neutral-300"
                        }`}
                        title={
                          mediaDisplay === "thumbnail"
                            ? "YouTube 영상으로 표시"
                            : "썸네일 이미지로 표시"
                        }
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                            mediaDisplay === "thumbnail"
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                        <span className="sr-only">
                          {mediaDisplay === "thumbnail"
                            ? "썸네일 이미지 표시 ON"
                            : "YouTube 영상 표시 OFF"}
                        </span>
                      </button>
                    </div>
                    <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                      동영상 재생 링크 (MP4 또는 YouTube 링크)
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/... or YouTube link"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:outline-none transition shadow-2xs"
                    />
                    {mediaDisplay === "youtube" && (
                      <p className="text-[11px] font-medium text-blue-600">
                        YouTube 영상 표시 OFF: 썸네일 이미지 입력이
                        비활성화됩니다.
                      </p>
                    )}
                  </div>
                )}

                {/* Product Page Exclusive: Long Detail Image & Store Link */}
                {isProductPage && (
                  <>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                        세로형 전체 상세페이지 롱 이미지 URL (상세 모달 뷰어용)
                      </label>
                      <input
                        type="url"
                        value={longDetailImage}
                        onChange={(e) => setLongDetailImage(e.target.value)}
                        placeholder="https://... (전체 세로 스크롤 상세페이지 고화질 이미지 링크)"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-emerald-600 focus:outline-none transition shadow-2xs"
                      />
                      <p className="text-[11px] text-neutral-400 mt-1">
                        * 비워둘 경우 기본 섹션 뷰어 또는 대표 썸네일로 자동
                        구성됩니다.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                        실제 판매처 / 펀딩 링크 (선택 사항 -
                        스마트스토어/쿠팡/와디즈)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={storeUrl}
                          onChange={(e) => setStoreUrl(e.target.value)}
                          placeholder="https://smartstore.naver.com/... or https://wadiz.kr/..."
                          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-emerald-600 focus:outline-none transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Expandable Detail Sections Builder for Product Pages */}
                    <div className="pt-2 border-t border-neutral-200/60">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setShowSectionBuilder(!showSectionBuilder)
                          }
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                        >
                          <Layers size={14} className="text-emerald-600" />
                          <span>
                            상세페이지 단락별 섹션 블록 빌더 (
                            {detailSections.length}개)
                          </span>
                          {showSectionBuilder ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleAddSection}
                          className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>섹션 단락 추가</span>
                        </button>
                      </div>

                      {showSectionBuilder && (
                        <div className="mt-3 space-y-3">
                          {detailSections.length === 0 ? (
                            <div className="text-center p-4 rounded-xl bg-white border border-dashed border-neutral-200 text-xs text-neutral-400">
                              등록된 세부 섹션이 없습니다. [섹션 단락 추가]
                              버튼을 눌러 인트로, 특장점, 스펙 단락을
                              빌드해보세요.
                            </div>
                          ) : (
                            detailSections.map((sec, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs"
                              >
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                                  <span className="font-bold text-emerald-800">
                                    섹션 0{idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSection(idx)}
                                    className="text-neutral-400 hover:text-red-600 transition"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={sec.badge || ""}
                                    onChange={(e) =>
                                      handleSectionFieldChange(
                                        idx,
                                        "badge",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="배지 (예: INTRO POINT 01)"
                                    className="p-1.5 rounded-lg border border-neutral-200 font-semibold"
                                  />
                                  <input
                                    type="text"
                                    value={sec.title || ""}
                                    onChange={(e) =>
                                      handleSectionFieldChange(
                                        idx,
                                        "title",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="섹션 제목"
                                    className="p-1.5 rounded-lg border border-neutral-200 font-bold"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={sec.subtitle || ""}
                                  onChange={(e) =>
                                    handleSectionFieldChange(
                                      idx,
                                      "subtitle",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="서브 카피문구"
                                  className="w-full p-1.5 rounded-lg border border-neutral-200"
                                />
                                <input
                                  type="text"
                                  value={sec.image || ""}
                                  onChange={(e) =>
                                    handleSectionFieldChange(
                                      idx,
                                      "image",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="섹션 이미지 URL"
                                  className="w-full p-1.5 rounded-lg border border-neutral-200"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* AI Auto-Suggestion Assistant Bar - Custom tailored for Category */}
              <div
                className={`rounded-2xl border p-4 shadow-xs transition-all ${
                  isProductPage
                    ? "border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-emerald-50/80"
                    : "border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-indigo-50/70"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg text-white shadow-xs ${
                        isProductPage ? "bg-emerald-600" : "bg-indigo-600"
                      }`}
                    >
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                          isProductPage ? "text-emerald-950" : "text-indigo-950"
                        }`}
                      >
                        {isProductPage
                          ? "🛍️ 상세페이지 전용 AI 카피라이팅 & 스토리 어시스턴트"
                          : "📹 영상 편집 전용 AI 소개문구 어시스턴트"}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isProductPage
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {isProductPage
                            ? "e-Commerce MD AI"
                            : "Video Director AI"}
                        </span>
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {isProductPage
                          ? "상품 특성, 타깃 고객, 소구점을 입력하시면 스마트스토어/펀딩에 최적화된 설득력 높은 카피와 스토리를 작성합니다."
                          : "원 소스 특징과 편집 방향을 입력하시면 시청 지속률과 편집 스킬이 돋보이는 문구를 작성합니다."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRequestAISuggest("all")}
                    disabled={isGeneratingAI}
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 shrink-0 ${
                      isProductPage
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>AI 문구 생성 중...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 size={13} />
                        <span>
                          {isProductPage
                            ? "상세페이지 카피 일괄 추천"
                            : "전체 문구 일괄 추천"}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roughNotes}
                    onChange={(e) => setRoughNotes(e.target.value)}
                    placeholder={
                      isProductPage
                        ? "상품 기획 메모 (예: 2030 여성 타깃 수분크림, 끈적임 없는 72시간 보습, 임상실험 결과 인포그래픽, 와디즈 펀딩용)"
                        : isShorts
                          ? "숏폼 메모 (예: 초반 1초 훅킹 연출, 빠른 비트 싱크 컷편집, 중앙 집중형 볼드 자막)"
                          : "영상 편집 메모 (예: 긴 호흡 컷편집으로 지루함 없앰, 가독성 자막, 텐션 높은 SFX 효과음)"
                    }
                    className={`flex-1 rounded-xl border bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition shadow-2xs ${
                      isProductPage
                        ? "border-emerald-200 focus:border-emerald-600"
                        : "border-indigo-200 focus:border-indigo-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRequestAISuggest("all")}
                    disabled={isGeneratingAI}
                    className={`px-3 py-2 rounded-xl border bg-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shrink-0 ${
                      isProductPage
                        ? "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                        : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    작성 요청
                  </button>
                </div>

                {/* Quick note suggestion chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar text-xs">
                  <span className="text-[10px] text-neutral-400 font-bold shrink-0">
                    빠른 키워드:
                  </span>
                  {(isProductPage
                    ? [
                        "2030 타깃 진정 수분크림 (와디즈 펀딩)",
                        "프리미엄 원두 드립백 (스마트스토어)",
                        "노이즈캔슬링 무선 헤드폰 (쿠팡 로켓)",
                        "주방 조리도구 5종 세트 (브랜드 자사몰)",
                      ]
                    : [
                        "테크/기기 언박싱 (타이트한 컷편집)",
                        "일상 감성 브이로그 (색보정 & BGM)",
                        "숏폼 3초 훅킹 바이럴 (볼드 자막)",
                        "지식/경제 정보 롱폼 (인포그래픽 바)",
                      ]
                  ).map((kw, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setRoughNotes(kw)}
                      className="px-2 py-0.5 rounded-md bg-white/80 border border-neutral-200 hover:bg-white text-neutral-600 text-[10px] font-medium shrink-0 transition cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                {/* AI Notification Message */}
                {aiSuccessMsg && (
                  <div
                    className={`mt-2.5 flex items-center justify-between text-xs font-semibold px-3 py-1.5 rounded-lg ${
                      isProductPage
                        ? "text-emerald-800 bg-emerald-100/80"
                        : "text-indigo-800 bg-indigo-100/80"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} />
                      {aiSuccessMsg}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAiSuccessMsg(null)}
                      className="text-neutral-400 hover:text-neutral-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* AI Preview Result Drawer if Generated */}
                {aiGeneratedResult && showAiAssistant && (
                  <div className="mt-3 pt-3 border-t border-neutral-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isProductPage ? "text-emerald-950" : "text-indigo-950"
                        }`}
                      >
                        {isProductPage
                          ? "🛍️ 상세페이지 AI 맞춤 추천 결과"
                          : "📹 영상 편집 AI 추천 결과"}
                      </span>
                      <button
                        type="button"
                        onClick={handleApplyAllAI}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                          isProductPage
                            ? "text-emerald-800 bg-emerald-100 hover:bg-emerald-200"
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                      >
                        <CheckCheck size={13} />
                        <span>추천 내용 전체 폼에 적용</span>
                      </button>
                    </div>

                    {aiGeneratedResult.description && (
                      <div className="p-2.5 rounded-xl bg-white/90 border border-neutral-200 text-xs text-neutral-700 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500">
                          <span>[요약 설명]</span>
                          <button
                            type="button"
                            onClick={() => {
                              setDescription(
                                aiGeneratedResult.description || "",
                              );
                              setAiSuccessMsg("요약 설명에 적용되었습니다.");
                            }}
                            className={
                              isProductPage
                                ? "text-emerald-600 hover:underline cursor-pointer"
                                : "text-indigo-600 hover:underline cursor-pointer"
                            }
                          >
                            적용
                          </button>
                        </div>
                        <p className="line-clamp-2">
                          {aiGeneratedResult.description}
                        </p>
                      </div>
                    )}

                    {aiGeneratedResult.fullStory && (
                      <div className="p-2.5 rounded-xl bg-white/90 border border-neutral-200 text-xs text-neutral-700 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500">
                          <span>[상세 스토리]</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFullStory(aiGeneratedResult.fullStory || "");
                              setAiSuccessMsg("상세 스토리에 적용되었습니다.");
                            }}
                            className={
                              isProductPage
                                ? "text-emerald-600 hover:underline cursor-pointer"
                                : "text-indigo-600 hover:underline cursor-pointer"
                            }
                          >
                            적용
                          </button>
                        </div>
                        <p className="line-clamp-4 whitespace-pre-line text-[11px] text-neutral-600">
                          {aiGeneratedResult.fullStory}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    {isProductPage
                      ? "카드 요약 카피라이팅 (1~2문장) *"
                      : "카드 요약 설명 *"}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRequestAISuggest("description")}
                    disabled={isGeneratingAI}
                    className={`text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      isProductPage
                        ? "text-emerald-700 hover:text-emerald-900"
                        : "text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>
                      {isProductPage
                        ? "AI 상세페이지 요약만 생성"
                        : "AI 요약 문구만 생성"}
                    </span>
                  </button>
                </div>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isProductPage
                      ? "브랜드의 아이덴티티와 핵심 셀링포인트를 분석하여, 직관적인 비주얼 구성과 설득력 있는 카피라이팅으로 전환율을 극대화한 상세페이지입니다."
                      : "시청 지속시간을 극대화하는 컷 편집, 핵심 강조 자막, 깔끔한 오디오 레벨링..."
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none transition resize-none"
                />
              </div>

              {/* Full Case Study Story */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    {isProductPage
                      ? "상세 기획 & 디자인 스토리 (모달 상세페이지용)"
                      : "상세 작업 스토리 (모달 상세페이지용)"}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRequestAISuggest("fullStory")}
                    disabled={isGeneratingAI}
                    className={`text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      isProductPage
                        ? "text-emerald-700 hover:text-emerald-900"
                        : "text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>
                      {isProductPage
                        ? "AI 상세 스토리만 생성"
                        : "AI 스토리만 생성"}
                    </span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={fullStory}
                  onChange={(e) => setFullStory(e.target.value)}
                  placeholder={
                    isProductPage
                      ? "[기획 의도 및 타깃 분석]\n소비자의 페인포인트를 해결하는 서사 구조 설계...\n\n[비주얼 & 디자인 전략]\n고해상도 제품 톤보정 및 모바일 최적화 레이아웃..."
                      : "프로젝트의 배경, 해결한 문제점, 편집 및 디자인 전략을 상세히 기록합니다."
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none transition resize-none"
                />
              </div>

              {/* 3 Key Highlights */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase">
                    {isProductPage
                      ? "상세페이지 핵심 작업 포인트 (Highlights)"
                      : "핵심 작업 포인트 (Highlights)"}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>항목 추가</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-400 w-4 text-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) =>
                          handleHighlightChange(index, e.target.value)
                        }
                        placeholder={`핵심 포인트 ${index + 1}`}
                        className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2 text-xs sm:text-sm font-medium text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                      />
                      {highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Home Feature Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-2">
                    {isProductPage
                      ? "사용 디자인 툴 태그 (Tools)"
                      : "사용 툴 태그 (Tools)"}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTool();
                        }
                      }}
                      placeholder={
                        isProductPage
                          ? "예: Photoshop, Figma"
                          : "예: Premiere Pro, AE"
                      }
                      className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs font-medium text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
                    >
                      추가
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800"
                      >
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className="text-neutral-400 hover:text-neutral-900"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-2">
                    홈 화면 노출 설정
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/60 cursor-pointer hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={featuredInHome}
                      onChange={(e) => setFeaturedInHome(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        홈(Home) 큐레이션 노출
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        메인 홈 상위 4개 큐레이션 작업물에 포함
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              </div>

              {/* Submit / Cancel Footer Buttons */}
              <div className="shrink-0 bg-white px-6 py-4 sm:px-8 border-t border-neutral-100 shadow-[0_-10px_24px_rgba(255,255,255,0.95)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={requestClose}
                  disabled={isSaving}
                  className="rounded-full border border-neutral-300 px-6 py-2.5 text-xs font-bold tracking-wider text-neutral-700 uppercase hover:bg-neutral-50 transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`rounded-full px-7 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition cursor-pointer flex items-center gap-2 ${
                    isProductPage
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                  }`}
                >
                  <Check size={15} />
                  <span>
                    {isSaving
                      ? "저장 중…"
                      : projectToEdit
                        ? "수정 내용 저장"
                        : "새 프로젝트 등록"}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Live Preview Mode */
            <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col items-center justify-center bg-neutral-50/50">
              <div className="w-full max-w-sm rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-neutral-950">
                    <img
                      src={
                        (mediaDisplay === "youtube"
                          ? getYouTubeThumbnailUrl(videoUrl) || image
                          : image) ||
                        (isProductPage
                          ? PRESET_PRODUCT_IMAGES[0].url
                          : PRESET_VIDEO_IMAGES[0].url)
                      }
                      alt={title || "미리보기"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                      <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-xs ${
                          isProductPage
                            ? "bg-emerald-950/80"
                            : "bg-neutral-950/75"
                        }`}
                      >
                        {category}
                      </span>
                      {isProductPage && productCategory && (
                        <span className="rounded-md bg-white/90 text-neutral-900 px-2 py-1 text-[9px] font-bold shadow-xs">
                          {productCategory}
                        </span>
                      )}
                    </div>
                    {videoUrl &&
                      !isProductPage &&
                      mediaDisplay === "youtube" && (
                        <div className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-md">
                            <Play size={16} className="fill-blue-600 ml-0.5" />
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400">
                      <span>
                        {client || (isProductPage ? "브랜드사" : "고객사 명")}
                      </span>
                      <span>{year || "2024"}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-bold tracking-tight text-neutral-950 line-clamp-1">
                      {title || "프로젝트 제목이 여기에 표시됩니다"}
                    </h3>
                    <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {description || "프로젝트 요약 설명이 여기에 나타납니다."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${isProductPage ? "text-emerald-600" : "text-blue-600"}`}
                  >
                    {isProductPage ? "VIEW DETAIL LP →" : "VIEW PROJECT →"}
                  </span>
                  <span className="text-neutral-400">
                    {duration || (isProductPage ? "860px LP" : "소요 분량")}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer"
                >
                  폼으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {showCloseConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-neutral-950/35 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="close-confirm-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3
              id="close-confirm-title"
              className="text-base font-bold text-neutral-950"
            >
              정말 닫으시겠습니까?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              저장하지 않은 내용은 사라질 수 있습니다.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
              >
                계속 작성
              </button>
              <button
                type="button"
                onClick={confirmClose}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
    ),
    document.body,
  );
};
