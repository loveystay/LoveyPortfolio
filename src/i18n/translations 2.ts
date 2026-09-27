export type Language = 'ko' | 'en' | 'ja';

export interface ProjectTranslation {
  title: string;
  subtitle: string;
  description: string;
  client: string;
  duration: string;
  metrics: { label: string; value: string }[];
  highlights: string[];
}

export interface Translations {
  nav: {
    home: string;
    about: string;
    works: string;
    contact: string;
    letsTalk: string;
    aiConsult: string;
    availableBadge: string;
  };
  hero: {
    status: string;
    title1: string;
    title2: string;
    subtitle: string;
    exploreBtn: string;
  };
  homeWorks: {
    title1: string;
    title2: string;
    tabAll: string;
    tabVideo: string;
    tabProduct: string;
    viewAll: string;
    viewCaseStudy: string;
    playVideo: string;
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  contactSection: {
    headingPart1: string;
    headingHighlight: string;
    headingPart2: string;
    subtitle: string;
    subtitlePart1: string;
    subtitlePart2: string;
    emailLabel: string;
    copyEmail: string;
    copied: string;
    aiConsultBtn: string;
  };
  worksPage: {
    title: string;
    subtitle: string;
    tabs: {
      all: string;
      youtube: string;
      shorts: string;
      product: string;
    };
    empty: string;
    emptyState: {
      title: string;
      videoEmptyTitle: string;
      productEmptyTitle: string;
      subtitle: string;
      allFilterBtn: string;
      contactBtn: string;
    };
  };
  aboutPage: {
    eyebrow: string;
    mainHeading: string;
    mainHeadingPart1: string;
    mainHeadingPart2: string;
    intro1: string;
    intro2: string;
    intro3: string;
    principlesTitle: string;
    principlesSubtitle: string;
    p1Title: string;
    p1Desc: string;
    p1Tag: string;
    p2Title: string;
    p2Desc: string;
    p2Tag: string;
    p3Title: string;
    p3Desc: string;
    p3Tag: string;
    p4Title: string;
    p4Desc: string;
    p4Tag: string;
    toolsTitle: string;
    toolsSubtitle: string;
    tool1Title: string;
    tool1Desc: string;
    tool2Title: string;
    tool2Desc: string;
    tool3Title: string;
    tool3Desc: string;
    policyTitle: string;
    policySubtitle: string;
    policyDepositTitle: string;
    policyDepositDesc: string;
    policyDurationTitle: string;
    policyDurationDesc: string;
    policyPrepTitle: string;
    policyPrepDesc: string;
    policyFeedbackTitle: string;
    policyFeedbackDesc: string;
    bannerTitle: string;
    bannerDesc: string;
    bannerBtn: string;
  };
  modal: {
    overview: string;
    keyHighlights: string;
    metricsTitle: string;
    specsTitle: string;
    toolsTitle: string;
    client: string;
    duration: string;
    year: string;
    category: string;
    close: string;
    nextProject: string;
    prevProject: string;
  };
  aiConsultant: {
    title: string;
    status: string;
    welcomeMsg: string;
    suggestedTitle: string;
    suggestedHint: string;
    placeholder: string;
    send: string;
    copyEmail: string;
    copied: string;
    close: string;
    questions: string[];
  };
  footer: {
    tagline: string;
    rights: string;
    backToTop: string;
    privacy: string;
    privacyText: string;
    terms: string;
    termsText: string;
    close: string;
  };
  projects: Record<string, ProjectTranslation>;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ko: {
    nav: {
      home: 'OVERVIEW',
      about: 'ABOUT',
      works: 'WORKS',
      contact: 'CONTACT',
      letsTalk: "LET'S TALK",
      aiConsult: 'AI 상담',
      availableBadge: 'AVAILABLE FOR WORK',
    },
    hero: {
      status: 'OPEN FOR PROJECTS',
      title1: 'Portfolio',
      title2: 'Designed to Stay',
      subtitle: '불필요한 것은 덜어내고, 시선이 오래 머무는 결과물을 만듭니다.',
      exploreBtn: 'EXPLORE WORKS',
    },
    homeWorks: {
      title1: 'Curated',
      title2: 'Selected Works',
      tabAll: 'ALL WORK',
      tabVideo: 'VIDEO EDITING',
      tabProduct: 'PRODUCT PAGE',
      viewAll: 'VIEW ALL WORKS',
      viewCaseStudy: 'VIEW PROJECT',
      playVideo: 'PLAY VIDEO',
    },
    process: {
      eyebrow: 'HOW I WORK',
      title: '작업 진행 프로세스',
      subtitle: '혼선 없이 빠르고 명확하게 결과물을 완성하는 4단계 과정입니다.',
      step1Title: '기획 & 소스 전달',
      step1Desc: '영상 원본 소스, 레퍼런스, 상세페이지 제품 정보와 희망하시는 방향성을 공유받습니다.',
      step2Title: '1차 컷편집 / 초안',
      step2Desc: '호흡과 텐션을 맞춘 컷편집 및 주요 상세페이지 레이아웃 시안을 먼저 확인합니다.',
      step3Title: '디테일 & 텍스트 완성',
      step3Desc: '가독성 높은 자막 디자인, 효과음/BGM 싱크, 고화질 이미지 보정과 문구를 정돈합니다.',
      step4Title: '피드백 수정 & 납품',
      step4Desc: '수정 요청사항을 꼼꼼하게 반영하여 최적의 해상도 파일로 최종 전달합니다.',
    },
    contactSection: {
      headingPart1: "Let's create ",
      headingHighlight: 'something',
      headingPart2: ' amazing.',
      subtitle: '흥미로운 협업, 유튜브 작업, 콘텐츠 편집에 대한 이야기.\n언제든 편하게 연락해 주세요.',
      subtitlePart1: '흥미로운 협업, 유튜브 작업, 콘텐츠 편집에 대한 이야기.',
      subtitlePart2: '언제든 편하게 연락해 주세요.',
      emailLabel: 'CONTACT',
      copyEmail: '이메일 주소 복사',
      copied: '이메일이 복사되었습니다!',
      aiConsultBtn: '1:1 AI 상담 및 프로젝트 문의',
    },
    worksPage: {
      title: 'Selected Works',
      subtitle: '그동안 만들어온 영상과 상세페이지 작업 레퍼런스입니다.',
      tabs: {
        all: '전체 (ALL)',
        youtube: '유튜브 롱폼 (YOUTUBE)',
        shorts: '숏폼/릴스 (SHORTS)',
        product: '상세페이지 (PRODUCT PAGE)',
      },
      empty: '해당 카테고리에 등록된 프로젝트가 없습니다.',
      emptyState: {
        title: '등록된 작업물이 없습니다',
        videoEmptyTitle: '등록된 영상 작업물이 없습니다',
        productEmptyTitle: '등록된 상세페이지 작업물이 없습니다',
        subtitle: '현재 새로운 프로젝트 레퍼런스를 준비 및 업데이트하고 있습니다.\n영상 편집 및 상세페이지 제작에 대한 의뢰와 문의는 언제든 편하게 남겨주세요.',
        allFilterBtn: '전체 작업 보기',
        contactBtn: '1:1 프로젝트 상담 및 의뢰하기',
      },
    },
    aboutPage: {
      eyebrow: 'ABOUT LOVEY',
      mainHeading: '끝까지 보게 만드는 편집, 끝내 사게 만드는 디자인',
      mainHeadingPart1: '끝까지 보게 만드는 편집,',
      mainHeadingPart2: '끝내 사게 만드는 디자인',
      intro1: 'Video Editor & Designer lovey입니다.',
      intro2: '장식은 덜어내고 본질을 담습니다.',
      intro3: '시선을 머물게 하는 컷 편집과 구매 전환을 이끄는 상세페이지를 만듭니다.',
      principlesTitle: '작업 원칙 & 가치',
      principlesSubtitle: '모든 프로젝트에서 타협하지 않고 지켜나가는 lovey의 4가지 핵심 원칙입니다.',
      p1Title: '루즈함 없는 타이트한 컷편집',
      p1Desc: '말과 말 사이의 불필요한 숨소리와 딜레이를 덜어내어, 시청자가 끝까지 몰입할 수 있는 텐션을 만듭니다.',
      p1Tag: '#시청지속시간',
      p2Title: '구매자를 설득하는 셀링포인트',
      p2Desc: '단순히 예쁜 배치를 넘어, 소비자가 왜 사야 하는지 핵심 특장점과 신뢰 요소를 직관적으로 전달합니다.',
      p2Tag: '#구매전환설계',
      p3Title: '철저한 마감 기한 준수',
      p3Desc: '약속된 일정은 반드시 지킵니다. 작업 진행 상황을 투명하게 공유하며 신뢰를 최우선으로 합니다.',
      p3Tag: '#일정준수',
      p4Title: '빠르고 꼼꼼한 피드백 반영',
      p4Desc: '수정 요청사항을 정확하게 파악하고 신속하게 반영하여 만족스러운 결과물을 함께 완성합니다.',
      p4Tag: '#원활한소통',
      toolsTitle: '전문 작업 분야 & 툴',
      toolsSubtitle: '프로젝트 목적에 맞는 최적의 소프트웨어를 활용하여 결과물의 퀄리티를 완성합니다.',
      tool1Title: 'YouTube Long-form Video',
      tool1Desc: '채널 맞춤형 호흡 컷편집, 가독성 높은 맞춤 자막, 사운드 믹싱',
      tool2Title: 'Short-form & Reels',
      tool2Desc: '3초 이탈 방지 훅킹, 모바일 최적화 9:16 볼드 자막 편집',
      tool3Title: 'E-commerce Product Page',
      tool3Desc: '스마트스토어·쿠팡 규격, 셀링포인트 기획, 제품 누끼 및 보정',
      policyTitle: '작업 기준 및 협업 가이드',
      policySubtitle: '원활한 협업과 최고의 결과물을 위해 안내해 드리는 기본 작업 가이드라인입니다.',
      policyDepositTitle: '입금 확인 후 순차 제작 착수',
      policyDepositDesc: '모든 작업은 입금 확인 후 본격 착수되며, 작업 대기 순서는 입금 순서에 따라 순차 배정됩니다.',
      policyDurationTitle: '제작 소요 기간 기준',
      policyDurationDesc: '롱폼(30분 이상 완성본 기준 약 2주), 숏폼(약 3일~1주) 소요되며 분량에 따라 조율됩니다.',
      policyPrepTitle: '상세페이지 의뢰 시 준비물',
      policyPrepDesc: '원하는 분위기/레퍼런스 설명, 고화질 제품 사진(필수), 필수 삽입 문구를 미리 준비해 주시면 빠른 진행이 가능합니다.',
      policyFeedbackTitle: '피드백 및 수정 정책',
      policyFeedbackDesc: '기본 2회 무상 수정을 지원합니다. (단, 기획 없는 추상적 요청에 따른 전면 수정/환불은 불가합니다)',
      bannerTitle: '새로운 프로젝트를 구상 중이신가요?',
      bannerDesc: '원하시는 영상 스타일이나 상세페이지 기획을 편하게 남겨주세요. 꼼꼼히 검토 후 연락드리겠습니다.',
      bannerBtn: '프로젝트 의뢰하기',
    },
    modal: {
      overview: 'PROJECT OVERVIEW',
      keyHighlights: 'KEY WORKING POINTS',
      metricsTitle: 'KEY PERFORMANCE METRICS',
      specsTitle: 'PROJECT SPECS',
      toolsTitle: 'TOOLS USED',
      client: 'Client',
      duration: 'Format / Length',
      year: 'Year',
      category: 'Category',
      close: '닫기',
      nextProject: '다음 프로젝트',
      prevProject: '이전 프로젝트',
    },
    aiConsultant: {
      title: 'AI 상담 어시스턴트',
      status: '온라인 • 실시간 답변 가능',
      welcomeMsg: '안녕하세요! 영상 편집자 & 상세페이지 디자이너 **lovey**의 AI 상담 어시스턴트입니다.\n\n유튜브 롱폼/숏폼 편집 일정, 이커머스 상세페이지 기획, 견적 및 협업 프로세스 등 궁금하신 점을 무엇이든 편하게 물어보세요! 😊\n\n*(※ 유튜브 썸네일 단독 제작은 진행하지 않습니다)*',
      suggestedTitle: '추천 질문',
      suggestedHint: '(클릭하여 질문 또는 좌우 슬라이드)',
      placeholder: '궁금하신 작업 일정, 견적, 준비 자료 등을 입력하세요...',
      send: '전송',
      copyEmail: '공식 이메일 복사',
      copied: '이메일이 복사되었습니다!',
      close: '닫기',
      questions: [
        '롱폼 영상 편집 소요 기간은 얼마나 걸리나요?',
        '숏폼/릴스 제작 기간은 얼마나 걸리나요?',
        '상세페이지 디자인 의뢰 시 어떤 자료를 준비해야 하나요?',
        '피드백 수정 횟수와 추가 수정 정책이 어떻게 되나요?',
        '견적 산정 방식과 협업 진행 절차가 궁금합니다.',
        '작업 착수 및 결제 기준이 궁금합니다.',
        '정기 월 단위 영상 편집 계약도 가능한가요?',
      ],
    },
    footer: {
      tagline: 'Video Editor & E-commerce Product Page Designer',
      rights: 'All rights reserved.',
      backToTop: 'BACK TO TOP',
      privacy: '개인정보처리방침',
      privacyText: 'lovey 포트폴리오 사이트는 문의 접수 및 상담 목적 외에 개인정보를 수집하거나 제3자에게 제공하지 않습니다. 입력하신 모든 정보는 상담 완료 후 안전하게 파기됩니다.',
      terms: '이용약관',
      termsText: '본 사이트에 게재된 모든 포트폴리오 영상, 그래픽, 상세페이지 작업물에 대한 저작권은 lovey 및 해당 클라이언트에 귀속되어 있으며 무단 복제 및 상업적 도용을 금합니다.',
      close: '닫기',
    },
    projects: {
      '1': {
        title: '테크 & 기기 리뷰 롱폼 편집',
        subtitle: 'Tech & Gadget Review Long-form',
        description: '시청 지속시간을 극대화하는 컷 편집, 핵심 강조 자막, 깔끔한 오디오 레벨링 및 텐션 조절.',
        client: 'IT/테크 크리에이터 채널',
        duration: '14분 30초 롱폼',
        metrics: [
          { label: '누적 조회수', value: '45만+' },
          { label: '평균 시청 지속시간', value: '52.4%' },
          { label: '신규 구독자 유입', value: '+3,800명' },
        ],
        highlights: [
          '말과 말 사이 불필요한 숨소리 및 딜레이 완벽 제거 (타이트한 컷편집)',
          '눈에 띄는 가독성 높은 맞춤 자막 바 및 하이라이트 텍스트',
          '상황에 맞는 적재적소 효과음(SFX) 및 BGM 볼륨 밸런싱',
        ],
      },
      '2': {
        title: '감성 브이로그 & 루틴 롱폼 편집',
        subtitle: 'Daily Life & Aesthetic Vlog',
        description: '편안한 영상 색감 보정과 잔잔하면서도 늘어지지 않는 감각적인 일상 컷편집.',
        client: '라이프스타일 유튜버',
        duration: '18분 20초 롱폼',
        metrics: [
          { label: '누적 조회수', value: '28만+' },
          { label: '댓글 긍정 반응률', value: '98%' },
          { label: '시청 유지율', value: '48.9%' },
        ],
        highlights: [
          '차분하고 따뜻한 자연광 톤 컬러 밸런스 조정',
          '대화 및 일상 소음(Foley) 살림 & 거슬리는 잡음 제거',
          '브이로그 분위기에 어울리는 깔끔한 감성 자막',
        ],
      },
      '3': {
        title: '유튜브 쇼츠 & 인스타 릴스 숏폼 팩',
        subtitle: 'High-Retention Short-form Videos',
        description: '3초 훅킹, 빠른 화면 전환, 중앙 집중식 볼드 자막으로 스크롤을 멈추게 하는 숏폼.',
        client: '다수 크리에이터 & 브랜드 채널',
        duration: '30초 ~ 60초 (10편 세트)',
        metrics: [
          { label: '쇼츠 최고 조회수', value: '180만+' },
          { label: '평균 조회율', value: '82%' },
          { label: '채널 유입 증가', value: '+340%' },
        ],
        highlights: [
          '처음 1~3초 안에 이탈을 막는 강력한 훅 구성',
          '모바일 화면에 최적화된 볼드 자막 및 강조 그래픽',
          '음악 비트에 맞춘 타이트한 컷 전환',
        ],
      },
      '4': {
        title: '프리미엄 워치 이커머스 상세페이지',
        subtitle: 'Minimalist Watch Product Page',
        description: '제품의 실물감과 셀링포인트를 극대화하여 구매 전환율을 높이는 고품질 상세페이지.',
        client: '패션/시계 이커머스 브랜드',
        duration: '스마트스토어 / 쿠팡 규격 풀페이지',
        metrics: [
          { label: '상세페이지 전환율', value: '4.8%' },
          { label: '이탈률 감소', value: '-28%' },
          { label: '고객 만족도', value: '4.9점' },
        ],
        highlights: [
          '소비자 구매 결정을 돕는 논리적인 셀링포인트 배치',
          '고화질 누끼 및 제품 텍스처를 살린 정밀 보정',
          '모바일 쇼핑 환경에 최적화된 큰 글씨와 명확한 가독성',
        ],
      },
      '5': {
        title: '생활/주방용품 스마트스토어 상세페이지',
        subtitle: 'Living & Kitchen Product Detail Page',
        description: 'Before & After 비교와 실사용 Gif 및 특장점 인포그래픽 중심의 실속형 상세페이지.',
        client: '리빙 라이프 브랜드',
        duration: '쿠팡 & 스마트스토어 최적화',
        metrics: [
          { label: '출시 첫 달 매출', value: '5,200만원' },
          { label: '구매 전환율', value: '5.1%' },
          { label: '재주문율', value: '34%' },
        ],
        highlights: [
          '실사용 전후 비교 시각화로 설득력 극대화',
          '핵심 스펙 인포그래픽 일러스트 적용',
          '빠른 로딩을 위한 이미지 슬라이싱 및 압축 최적화',
        ],
      },
      '6': {
        title: '지식/정보 채널 롱폼 영상 편집',
        subtitle: 'Knowledge & Edu YouTube Video',
        description: '복잡한 설명을 시각 자료와 타이포로 명확하게 전달하는 지식 정보형 유튜브 편집.',
        client: '경제/지식 크리에이터',
        duration: '12분 00초 롱폼',
        metrics: [
          { label: '누적 조회수', value: '62만+' },
          { label: '평균 시청 지속시간', value: '55.2%' },
          { label: '영상 공유 수', value: '1.2만회' },
        ],
        highlights: [
          '핵심 수치 및 그래프 모션 타이포 그래픽',
          '시청 피로도를 낮추는 리듬감 있는 인서트 컷 배치',
          '신뢰감을 높이는 명확한 음성 레벨링 및 마스터링',
        ],
      },
    },
  },
  en: {
    nav: {
      home: 'OVERVIEW',
      about: 'ABOUT',
      works: 'WORKS',
      contact: 'CONTACT',
      letsTalk: "LET'S TALK",
      aiConsult: 'AI CONSULT',
      availableBadge: 'AVAILABLE FOR WORK',
    },
    hero: {
      status: 'OPEN FOR PROJECTS',
      title1: 'Portfolio',
      title2: 'Designed to Stay',
      subtitle: 'Eliminating the superfluous to create work where attention lingers.',
      exploreBtn: 'EXPLORE WORKS',
    },
    homeWorks: {
      title1: 'Curated',
      title2: 'Selected Works',
      tabAll: 'ALL WORK',
      tabVideo: 'VIDEO EDITING',
      tabProduct: 'PRODUCT PAGE',
      viewAll: 'VIEW ALL WORKS',
      viewCaseStudy: 'VIEW PROJECT',
      playVideo: 'PLAY VIDEO',
    },
    process: {
      eyebrow: 'HOW I WORK',
      title: 'Workflow Process',
      subtitle: 'A structured 4-step workflow to deliver clear, top-tier results without friction.',
      step1Title: '01. Planning & Briefing',
      step1Desc: 'We receive raw video footage, reference moods, product specifications, and desired goals.',
      step2Title: '02. Rough Cut / Draft Layout',
      step2Desc: 'Review the initial rhythm-focused cut or primary product page layout draft.',
      step3Title: '03. Details & Typography Sync',
      step3Desc: 'Polishing high-contrast subtitles, SFX/BGM sound balance, and refined image retouching.',
      step4Title: '04. Feedback & Final Delivery',
      step4Desc: 'Incorporate revisions precisely and deliver master-quality files in optimal formats.',
    },
    contactSection: {
      headingPart1: "Let's create ",
      headingHighlight: 'something',
      headingPart2: ' amazing.',
      subtitle: 'Exciting collaborations, YouTube projects, and high-converting design. Feel free to reach out anytime.',
      subtitlePart1: 'Exciting collaborations, YouTube projects, and high-converting design.',
      subtitlePart2: 'Feel free to reach out anytime.',
      emailLabel: 'CONTACT',
      copyEmail: 'Copy Email Address',
      copied: 'Email copied to clipboard!',
      aiConsultBtn: '1:1 AI Project Inquiry & Consultation',
    },
    worksPage: {
      title: 'Selected Works',
      subtitle: 'Curated portfolio of video editing and e-commerce product page case studies.',
      tabs: {
        all: 'ALL (전체)',
        youtube: 'YOUTUBE LONG-FORM',
        shorts: 'SHORTS / REELS',
        product: 'PRODUCT PAGE',
      },
      empty: 'No projects found in this category.',
      emptyState: {
        title: 'No Projects Found',
        videoEmptyTitle: 'No Video Projects Found',
        productEmptyTitle: 'No Product Page Projects Found',
        subtitle: 'New project showcases are currently being curated and updated.\nInquiries for custom video editing and product page design are always open.',
        allFilterBtn: 'View All Works',
        contactBtn: '1:1 Project Consultation & Inquiry',
      },
    },
    aboutPage: {
      eyebrow: 'ABOUT LOVEY',
      mainHeading: 'Editing that hooks till the end, Design that drives the conversion',
      mainHeadingPart1: 'Editing that hooks till the end,',
      mainHeadingPart2: 'Design that drives ultimate purchases',
      intro1: "I am lovey, a dedicated Video Editor & E-commerce Product Page Designer.",
      intro2: 'Stripping away redundant noise to highlight the true essence.',
      intro3: 'Crafting tight cuts that hold attention and high-converting pages that drive sales.',
      principlesTitle: 'Core Principles & Values',
      principlesSubtitle: 'The four non-negotiable principles guiding every project lovey undertakes.',
      p1Title: 'Tight Cut Editing Without Slack',
      p1Desc: 'Eliminating unnecessary dead air and breathing pauses to keep audiences fully immersed.',
      p1Tag: '#AudienceRetention',
      p2Title: 'Compelling Selling Points',
      p2Desc: 'Beyond visual aesthetics, we strategically place key features to persuade prospective buyers.',
      p2Tag: '#ConversionDesign',
      p3Title: 'Strict Deadline Adherence',
      p3Desc: 'We strictly respect agreed timelines, maintaining transparent communication at all stages.',
      p3Tag: '#OnTimeDelivery',
      p4Title: 'Rapid & Thorough Feedback',
      p4Desc: 'Accurately grasping revision notes and promptly applying changes for optimal satisfaction.',
      p4Tag: '#SmoothCommunication',
      toolsTitle: 'Specializations & Tools',
      toolsSubtitle: 'Leveraging industry-standard creative software tailored to each project goal.',
      tool1Title: 'YouTube Long-form Video',
      tool1Desc: 'Channel-custom pacing, clean high-contrast subtitles, and balanced audio mixing',
      tool2Title: 'Short-form & Reels',
      tool2Desc: '3-second hook optimization, bold vertical subtitles, and viral pacing',
      tool3Title: 'E-commerce Product Page',
      tool3Desc: 'Marketplace standard layouts, selling point storytelling, and precision retouching',
      policyTitle: 'Collaboration Standards & Guidelines',
      policySubtitle: 'Essential working principles to ensure seamless collaboration and premium quality.',
      policyDepositTitle: 'Deposit-First Production Queue',
      policyDepositDesc: 'Production initiates strictly upon deposit confirmation, scheduled sequentially in order of payment.',
      policyDurationTitle: 'Standard Turnaround Time',
      policyDurationDesc: 'Long-form (approx. 2 weeks for 30+ min final cut), Shorts (3 days to 1 week), subject to length.',
      policyPrepTitle: 'Required Materials for Product Pages',
      policyPrepDesc: 'Please provide desired mood/references, high-res product photos (essential), and key copy.',
      policyFeedbackTitle: 'Revision & Feedback Policy',
      policyFeedbackDesc: 'Includes 2 rounds of standard revisions. (Re-edits due to vague initial briefs are non-refundable).',
      bannerTitle: 'Planning a new project?',
      bannerDesc: 'Feel free to share your desired video style or product concept. We will review and get back promptly.',
      bannerBtn: 'Inquire for Project',
    },
    modal: {
      overview: 'PROJECT OVERVIEW',
      keyHighlights: 'KEY WORKING POINTS',
      metricsTitle: 'KEY PERFORMANCE METRICS',
      specsTitle: 'PROJECT SPECS',
      toolsTitle: 'TOOLS USED',
      client: 'Client',
      duration: 'Format / Length',
      year: 'Year',
      category: 'Category',
      close: 'Close',
      nextProject: 'Next Project',
      prevProject: 'Previous Project',
    },
    aiConsultant: {
      title: 'AI Consultation Assistant',
      status: 'Online • Instant Responses',
      welcomeMsg: 'Hello! I am the AI assistant for **lovey** (Video Editor & Product Page Designer).\n\nFeel free to ask anything about long-form/short-form timelines, product page briefs, quote standards, and workflows! 😊\n\n*(※ Note: YouTube thumbnail standalone design is not offered)*',
      suggestedTitle: 'Recommended Questions',
      suggestedHint: '(Click to ask or slide horizontally)',
      placeholder: 'Ask about schedules, quotes, required briefs...',
      send: 'Send',
      copyEmail: 'Copy Official Email',
      copied: 'Email copied to clipboard!',
      close: 'Close',
      questions: [
        'How long does long-form video editing take?',
        'What is the turnaround time for shorts/reels?',
        'What materials are needed for a product page brief?',
        'What is the feedback revision policy?',
        'How is the quote calculated and what is the workflow?',
        'What are the payment and project kickoff terms?',
        'Is monthly retainer video editing available?',
      ],
    },
    footer: {
      tagline: 'Video Editor & E-commerce Product Page Designer',
      rights: 'All rights reserved.',
      backToTop: 'BACK TO TOP',
      privacy: 'Privacy Policy',
      privacyText: 'The lovey portfolio website does not collect or distribute personal information to third parties except for direct inquiries and consultations. All submitted details are securely handled.',
      terms: 'Terms of Service',
      termsText: 'All portfolio videos, graphics, and product page designs displayed on this website belong to lovey and respective clients. Unauthorized duplication or commercial use is strictly prohibited.',
      close: 'Close',
    },
    projects: {
      '1': {
        title: 'Tech & Gadget Review Long-form Editing',
        subtitle: 'Tech & Gadget Review Long-form',
        description: 'Pacing cut edits to maximize audience retention, bold highlight subtitles, and clean audio leveling.',
        client: 'IT / Tech Creator Channel',
        duration: '14m 30s Long-form',
        metrics: [
          { label: 'Total Views', value: '450K+' },
          { label: 'Avg. Retention Rate', value: '52.4%' },
          { label: 'New Subscribers', value: '+3,800' },
        ],
        highlights: [
          'Eliminating unnecessary dead air & speech pauses (tight rhythm cuts)',
          'High-contrast customized subtitle bars and visual text highlights',
          'Precise context-aware SFX and background music volume balancing',
        ],
      },
      '2': {
        title: 'Aesthetic Lifestyle & Routine Vlog',
        subtitle: 'Daily Life & Aesthetic Vlog',
        description: 'Warm natural color grading and rhythmic, relaxing everyday life video editing.',
        client: 'Lifestyle YouTuber Channel',
        duration: '18m 20s Long-form',
        metrics: [
          { label: 'Total Views', value: '280K+' },
          { label: 'Positive Comments', value: '98%' },
          { label: 'Retention Rate', value: '48.9%' },
        ],
        highlights: [
          'Warm daylight color correction and balanced skin tone grading',
          'Preserving dialogue & ambient Foley while filtering noise',
          'Clean, minimalist aesthetic subtitles matching channel tone',
        ],
      },
      '3': {
        title: 'High-Retention Shorts & Reels Pack',
        subtitle: 'High-Retention Short-form Videos',
        description: '3-second hook, high-speed transitions, and center-focused bold typography stopping the scroll.',
        client: 'Multi Creator & Brand Channels',
        duration: '30s ~ 60s (10 Episodes)',
        metrics: [
          { label: 'Top Short Views', value: '1.8M+' },
          { label: 'Avg. View Rate', value: '82%' },
          { label: 'Channel Inflow', value: '+340%' },
        ],
        highlights: [
          'Irresistible 1-3 second visual hook preventing scroll-aways',
          'Bold vertical subtitles and dynamic callouts optimized for mobile',
          'Fast-paced rhythm synced precisely to background beats',
        ],
      },
      '4': {
        title: 'Premium Watch E-commerce Product Page',
        subtitle: 'Minimalist Watch Product Page',
        description: 'High-end detail page highlighting tactile product textures and convincing selling points.',
        client: 'Fashion / Watch Brand',
        duration: 'Full Marketplace Standard Page',
        metrics: [
          { label: 'Conversion Rate', value: '4.8%' },
          { label: 'Bounce Rate', value: '-28%' },
          { label: 'Customer Rating', value: '4.9 / 5.0' },
        ],
        highlights: [
          'Structured selling point layout guiding purchase decisions',
          'High-resolution background cutout and precision texture retouching',
          'Mobile-first responsive typography ensuring immediate legibility',
        ],
      },
      '5': {
        title: 'Living & Kitchen Product Detail Page',
        subtitle: 'Living & Kitchen Product Detail Page',
        description: 'High-converting product page featuring Before/After comparisons and animated infographics.',
        client: 'Home & Living Brand',
        duration: 'Marketplace Optimized Page',
        metrics: [
          { label: 'Launch Month Sales', value: '$45K+' },
          { label: 'Conversion Rate', value: '5.1%' },
          { label: 'Reorder Rate', value: '34%' },
        ],
        highlights: [
          'Visual Before & After demos for persuasive proof',
          'Clean vector infographics showcasing key product specs',
          'Optimized slicing and compression for lightning-fast page loads',
        ],
      },
      '6': {
        title: 'Knowledge & Edu YouTube Video Editing',
        subtitle: 'Knowledge & Edu YouTube Video',
        description: 'Transforming complex data into clear visuals and kinetic typography for educational channels.',
        client: 'Finance & Knowledge Creator',
        duration: '12m 00s Long-form',
        metrics: [
          { label: 'Total Views', value: '620K+' },
          { label: 'Avg. Retention', value: '55.2%' },
          { label: 'Total Shares', value: '12K+' },
        ],
        highlights: [
          'Kinetic typography and motion data chart visualizers',
          'Rhythmic insert cut pacing to reduce viewer fatigue',
          'Clear speech leveling and audio mastering for high credibility',
        ],
      },
    },
  },
  ja: {
    nav: {
      home: 'OVERVIEW',
      about: 'ABOUT',
      works: 'WORKS',
      contact: 'CONTACT',
      letsTalk: "LET'S TALK",
      aiConsult: 'AI相談',
      availableBadge: 'AVAILABLE FOR WORK',
    },
    hero: {
      status: 'OPEN FOR PROJECTS',
      title1: 'Portfolio',
      title2: 'Designed to Stay',
      subtitle: '無駄を削ぎ落とし、視線が長く留まるクリエイティブを創ります。',
      exploreBtn: 'EXPLORE WORKS',
    },
    homeWorks: {
      title1: 'Curated',
      title2: 'Selected Works',
      tabAll: 'ALL WORK',
      tabVideo: 'VIDEO EDITING',
      tabProduct: 'PRODUCT PAGE',
      viewAll: 'VIEW ALL WORKS',
      viewCaseStudy: 'VIEW PROJECT',
      playVideo: 'PLAY VIDEO',
    },
    process: {
      eyebrow: 'HOW I WORK',
      title: '制作進行プロセス',
      subtitle: 'スムーズで明確に高品質な成果物を完成させる4つのステップです。',
      step1Title: '01. 企画＆素材共有',
      step1Desc: '動画素材、参考イメージ、商品情報、ご希望の方向性をヒアリングします。',
      step2Title: '02. 1次カット編集・初案',
      step2Desc: 'テンポ感を合わせたカット割りや主要なLP構成案を事前にご確認いただきます。',
      step3Title: '03. 詳細テロップ＆音声調整',
      step3Desc: '視認性の高い字幕デザイン、効果音/BGMのバランス調整、高画質補正を行います。',
      step4Title: '04. 修正＆最終納品',
      step4Desc: '修正リクエストを丁寧に反映し、最適なフォーマットで最終納品いたします。',
    },
    contactSection: {
      headingPart1: "Let's create ",
      headingHighlight: 'something',
      headingPart2: ' amazing.',
      subtitle: 'YouTube動画編集、LP制作、各種コラボレーションのご相談はお気軽にご連絡ください。',
      subtitlePart1: 'YouTube動画編集、LP制作、各種コラボレーションのご相談。',
      subtitlePart2: 'いつでもお気軽にご連絡ください。',
      emailLabel: 'CONTACT',
      copyEmail: 'メールアドレスをコピー',
      copied: 'メールアドレスをコピーしました！',
      aiConsultBtn: '1:1 AI相談・プロジェクトお問い合わせ',
    },
    worksPage: {
      title: 'Selected Works',
      subtitle: 'これまでに手掛けてきた動画編集およびLP制作の実績一覧です。',
      tabs: {
        all: 'すべて (ALL)',
        youtube: 'YouTube 長編動画',
        shorts: 'ショート / リール',
        product: '商品詳細LP (PRODUCT PAGE)',
      },
      empty: 'このカテゴリーのプロジェクトはありません。',
      emptyState: {
        title: '登録された制作実績がありません',
        videoEmptyTitle: '登録された動画実績がありません',
        productEmptyTitle: '登録された商品LP実績がありません',
        subtitle: '現在新しいプロジェクト実績を準備・更新中です。\n動画編集や商品ページ制作のご依頼・お見積り相談は随時受け付けております。',
        allFilterBtn: 'すべての実績を見る',
        contactBtn: '1:1 相談・プロジェクトを依頼する',
      },
    },
    aboutPage: {
      eyebrow: 'ABOUT LOVEY',
      mainHeading: '最後まで見せる編集、思わず買わせるデザイン',
      mainHeadingPart1: '最後まで見入らせる映像編集、',
      mainHeadingPart2: '思わず買わせるLPデザイン',
      intro1: '映像エディター＆LPデザイナーの lovey です。',
      intro2: '無駄な装飾を削ぎ落とし、本質を際立たせます。',
      intro3: '離脱を防ぐテンポの良いカット編集と、購買転換率を高めるLPを制作します。',
      principlesTitle: '制作方針とこだわり',
      principlesSubtitle: 'すべてのプロジェクトにおいて妥協せず守り続ける4つのコアバリューです。',
      p1Title: '間延びのないタイトなカット編集',
      p1Desc: '無駄な息遣いや沈黙を削ぎ落とし、視聴者が最後まで没入できるリズムを作ります。',
      p1Tag: '#視聴維持率',
      p2Title: '購買意欲を刺激するセールス設計',
      p2Desc: '単なる見栄えだけでなく、商品の強みと信頼要素を直感的に伝えて購買へ導きます。',
      p2Tag: '#CVR向上',
      p3Title: '厳格な納期遵守',
      p3Desc: 'お約束した納期は必ず守ります。進捗状況を透明に共有し信頼を最優先とします。',
      p3Tag: '#納期厳守',
      p4Title: '迅速かつ丁寧なフィードバック反映',
      p4Desc: '修正点を正確に把握し、スピーディーに反映して納得のいくクオリティに仕上げます。',
      p4Tag: '#円滑なコミュニケーション',
      toolsTitle: '専門分野＆使用ツール',
      toolsSubtitle: '目的に応じた最適なツールを駆使し、ハイクオリティな成果物を提供します。',
      tool1Title: 'YouTube Long-form Video',
      tool1Desc: 'チャンネルに合わせたテンポ設計、読みやすいカスタム字幕、音響ミックス',
      tool2Title: 'Short-form & Reels',
      tool2Desc: '冒頭3秒のフック強化、スマホ最適化9:16ボールド字幕',
      tool3Title: 'E-commerce Product Page',
      tool3Desc: 'ECモール規格対応、セールスポイント構成、高解像度画像補正',
      policyTitle: '制作基準＆ご依頼ガイド',
      policySubtitle: '円滑な進行と最高の成果物のため、事前にご確認いただく基本ガイドラインです。',
      policyDepositTitle: 'ご入金確認後の順次制作着手',
      policyDepositDesc: 'すべての作業はご入金確認後に着手となり、着手順序はご入金順に割り当てられます。',
      policyDurationTitle: '標準制作期間の目安',
      policyDurationDesc: '長編動画（30分以上完成基準で約2週間）、ショート動画（約3日〜1週間）となります。',
      policyPrepTitle: '商品LPご依頼時のご準備物',
      policyPrepDesc: '希望のテイスト/参考事例、商品高画質写真（必須）、必須掲載テキストをご準備ください。',
      policyFeedbackTitle: '修正・フィードバック規定',
      policyFeedbackDesc: '基本2回の無償修正に対応します。（曖昧な指示による全面作り直し・返金は承りかねます）',
      bannerTitle: '新しいプロジェクトをご検討中ですか？',
      bannerDesc: 'ご希望の動画スタイルやLP企画をお気軽にご相談ください。確認後すぐにご連絡いたします。',
      bannerBtn: 'プロジェクトを相談する',
    },
    modal: {
      overview: 'PROJECT OVERVIEW',
      keyHighlights: 'KEY WORKING POINTS',
      metricsTitle: 'KEY PERFORMANCE METRICS',
      specsTitle: 'PROJECT SPECS',
      toolsTitle: 'TOOLS USED',
      client: 'Client',
      duration: 'Format / Length',
      year: 'Year',
      category: 'Category',
      close: '閉じる',
      nextProject: '次のプロジェクト',
      prevProject: '前のプロジェクト',
    },
    aiConsultant: {
      title: 'AI相談アシスタント',
      status: 'オンライン • 即時返答可能',
      welcomeMsg: 'こんにちは！映像編集＆LPデザイナー **lovey** のAIアシスタントです。\n\nYouTube長編/ショートの制作スケジュール、商品LPの企画構成、見積りや進め方など、何でもお気軽にご相談ください！😊\n\n*(※ サムネイル単体制作は承っておりません)*',
      suggestedTitle: 'よくある質問',
      suggestedHint: '(クリックして質問または左右スライド)',
      placeholder: '納期、お見積り、必要素材などをご入力ください...',
      send: '送信',
      copyEmail: 'メールアドレスをコピー',
      copied: 'メールアドレスをコピーしました！',
      close: '閉じる',
      questions: [
        '長編動画の編集にはどのくらい日数がかかりますか？',
        'ショート/リール動画の制作期間はどのくらいですか？',
        '商品LPデザインの依頼時に必要な素材は何ですか？',
        '修正回数や追加修正ポリシーについて教えてください。',
        '見積もり算出方法と制作の流れを教えてください。',
        '作業着手と支払い基準について教えてください。',
        '月額契約での定期動画編集は可能ですか？',
      ],
    },
    footer: {
      tagline: 'Video Editor & E-commerce Product Page Designer',
      rights: 'All rights reserved.',
      backToTop: 'TOPに戻る',
      privacy: 'プライバシーポリシー',
      privacyText: 'loveyポートフォリオサイトは、お問い合わせおよび相談以外の目的で個人情報を収集・第三者へ提供することはありません。',
      terms: '利用規約',
      termsText: '本サイトに掲載されているすべての動画、グラフィック、商品ページ作品の著作権はloveyおよびクライアントに帰属します。無断転載・商用流用を固く禁じます。',
      close: '閉じる',
    },
    projects: {
      '1': {
        title: 'テック＆ガジェット レビュー長編動画編集',
        subtitle: 'Tech & Gadget Review Long-form',
        description: '視聴維持率を最大化するカット割り、強調テロップ、クリアな音響レベル調整。',
        client: 'IT / ガジェット系クリエイター',
        duration: '14分30秒 長編',
        metrics: [
          { label: '累計再生回数', value: '45万+' },
          { label: '平均視聴維持率', value: '52.4%' },
          { label: '新規登録者増加', value: '+3,800人' },
        ],
        highlights: [
          '不要な息遣いや間を徹底除去するタイトなカット編集',
          '視認性の高いカスタム字幕バーとハイライトテキスト',
          '場面に合わせた効果音(SFX)およびBGMの音量バランス調整',
        ],
      },
      '2': {
        title: 'ライフスタイル VLOG 長編動画編集',
        subtitle: 'Daily Life & Aesthetic Vlog',
        description: '自然で温かみのあるカラーグレーディングと、心地よく流れる日常カット編集。',
        client: 'ライフスタイル系YouTuber',
        duration: '18分20秒 長編',
        metrics: [
          { label: '累計再生回数', value: '28万+' },
          { label: '高評価・好感度', value: '98%' },
          { label: '視聴維持率', value: '48.9%' },
        ],
        highlights: [
          '自然光を活かした温かみのあるスキントーン補正',
          '日常音(Foley)を活かしつつ不要なノイズを除去',
          'VLOGの雰囲気に溶け込むミニマルな字幕デザイン',
        ],
      },
      '3': {
        title: '高維持率 YouTube Shorts & Reels パック',
        subtitle: 'High-Retention Short-form Videos',
        description: '3秒フック、スピーディーな画面遷移、中央ボールド字幕でスクロールを止めるショート動画。',
        client: '多数のクリエイター＆ブランド',
        duration: '30秒〜60秒 (10本セット)',
        metrics: [
          { label: '最高再生数', value: '180万+' },
          { label: '平均視聴完了率', value: '82%' },
          { label: 'チャンネル流入増', value: '+340%' },
        ],
        highlights: [
          '冒頭1〜3秒で離脱を防ぐ強力なフック構成',
          'スマホ画面に最適化されたボールド字幕と強調グラフィック',
          '音楽ビートに合わせたタイトなカットチェンジ',
        ],
      },
      '4': {
        title: 'プレミアムウォッチ EC商品LPデザイン',
        subtitle: 'Minimalist Watch Product Page',
        description: '製品の高級感とセールスポイントを際立たせ、購買転換率を高める高品位LP。',
        client: 'ファッション / 時計ブランド',
        duration: 'ECモール規格フルページ',
        metrics: [
          { label: '購買転換率(CVR)', value: '4.8%' },
          { label: '離脱率低減', value: '-28%' },
          { label: '顧客満足度', value: '4.9点' },
        ],
        highlights: [
          '購買決定を後押しする論理的なセールス構成',
          '高精細な切り抜きと質感を引き出す精密レタッチ',
          'スマホ閲覧に最適化した視認性の高い文字組',
        ],
      },
      '5': {
        title: 'キッチン・日用品 EC商品詳細LP',
        subtitle: 'Living & Kitchen Product Detail Page',
        description: 'Before & After 比較や実使用イメージ、インフォグラフィック中心の実用型LP。',
        client: 'リビング・ライフスタイルブランド',
        duration: 'モール最適化ページ',
        metrics: [
          { label: '発売初月売上', value: '520万円' },
          { label: '購買転換率(CVR)', value: '5.1%' },
          { label: 'リピート率', value: '34%' },
        ],
        highlights: [
          '使用前後の視覚的比較で納得感を最大化',
          '特徴をひと目で伝えるインフォグラフィック',
          '高速表示のための画像スライス＆圧縮最適化',
        ],
      },
      '6': {
        title: '知識・教育チャンネル 長編動画編集',
        subtitle: 'Knowledge & Edu YouTube Video',
        description: '複雑な解説を図解とモーショングラフィックスで明快に伝える教育型YouTube編集。',
        client: '経済・教養系クリエイター',
        duration: '12分00秒 長編',
        metrics: [
          { label: '累計再生回数', value: '62万+' },
          { label: '平均視聴維持率', value: '55.2%' },
          { label: 'シェア数', value: '1.2万回' },
        ],
        highlights: [
          '重要数値やグラフのモーショングラフィックス',
          '視聴疲れを防ぐリズミカルなインサートカット配置',
          '信頼感を高める明瞭な音声マスタリング',
        ],
      },
    },
  },
};
