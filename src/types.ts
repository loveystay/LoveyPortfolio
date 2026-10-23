export type NavTab = 'home' | 'about' | 'works' | 'contact' | 'admin';

export type FilterCategory = 'ALL' | 'YOUTUBE VIDEO' | 'PRODUCT PAGE' | 'SHORTS';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface DetailSection {
  title?: string;
  badge?: string;
  subtitle?: string;
  image: string;
  text?: string;
  points?: string[];
  specs?: { label: string; value: string }[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: 'YOUTUBE VIDEO' | 'PRODUCT PAGE' | 'SHORTS / REELS' | 'VIDEO EDITING';
  categoryTag: 'VIDEO' | 'PRODUCT' | 'SHORTS' | 'DESIGN';
  year: string;
  description: string;
  fullStory?: string;
  client?: string;
  role?: string;
  duration?: string;
  tools?: string[];
  image: string;
  videoUrl?: string;
  isWide?: boolean;
  featuredInHome?: boolean;
  metrics?: ProjectMetric[];
  highlights?: string[];
  gallery?: string[];
  detailSections?: DetailSection[];
  longDetailImage?: string;
  productCategory?: string;
  storeUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  projectName: string;
}

export type ProjectType = 'youtube_long' | 'shortform' | 'ecommerce_detail' | 'other';

export interface StartProjectFormData {
  // [섹션 1] 기본 정보 (항상 노출 / 고정)
  companyOrChannel: string;      // 필수: 업체/채널명
  managerNameAndTitle: string;   // 필수: 담당자 성함 / 직함
  contact: string;               // 필수: 연락처 (유선 / 메일)
  brandUrl?: string;             // 선택: 브랜드 및 채널 링크

  // [섹션 2] 의뢰 프로젝트 유형 (항상 노출 / 트리거 선택자)
  projectType: ProjectType;      // 필수: 라디오/칩 택1

  // [섹션 3] 작업 세부 사항 (조건부)
  // CASE 1: 영상 편집 (롱폼/숏폼)
  videoRawFootage?: string;      // 필수 (영상 선택 시): 원본 촬영본 분량
  videoTargetLength?: string;    // 필수 (영상 선택 시): 최종 납품 희망 길이
  videoScope: string[];          // 다중선택: 컷편집, 자막, 모션·CG, BGM·효과음, 썸네일
  videoFrequency?: string;       // 선택: 업로드 주기 또는 의뢰 건수

  // CASE 2: E-커머스 상세페이지
  ecommerceUsp?: string;         // 필수 (상세페이지 선택 시): 제품군 및 주요 셀링 포인트
  ecommerceResources: string[];  // 다중선택: 기획안 유무, 연출컷/누끼컷, 원고 보유
  ecommerceWorkload?: string;    // 선택: 예상 작업 분량

  // CASE 3: 기타
  otherDetails?: string;         // 필수 (기타 선택 시): 문의 세부 내용 직접 입력

  // [섹션 4] 레퍼런스 및 스타일 가이드 (항상 노출)
  targetMood?: string;           // 선택: 지향하는 무드 / 톤앤매너
  referenceLink1: string;        // 필수: 참고 레퍼런스 링크 1
  referenceLink2?: string;       // 선택: 참고 레퍼런스 링크 2
  avoidStyles?: string;          // 선택: 지양하는 스타일이나 필수 주의사항

  // [섹션 5] 일정 및 예산 (항상 노출)
  rawMaterialDate?: string;      // 선택: 원본(자료) 전달 가능 일자
  firstDraftDate?: string;       // 선택: 1차 시안 희망 수령일
  finalDeliveryDate: string;     // 필수: 최종 완료 및 납품 희망일
  budgetRange: string;           // 필수: 책정 예산 범위 (건당/월정액, VAT 포함/별도)

  // [섹션 6] 기타 요청 및 전달사항 (항상 노출)
  additionalNotes?: string;      // 선택: 기타 요청 및 전달사항
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

