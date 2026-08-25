import { Project, Testimonial } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'tech-review-youtube',
    title: '테크 & 기기 리뷰 롱폼 편집',
    subtitle: 'Tech & Gadget Review Long-form',
    category: 'YOUTUBE VIDEO',
    categoryTag: 'VIDEO',
    year: '2024',
    description: '시청 지속시간을 극대화하는 컷 편집, 핵심 강조 자막, 깔끔한 오디오 레벨링 및 텐션 조절.',
    fullStory: '15분 분량의 테크 리뷰 영상으로, 지루할 틈 없는 템포 조절과 핵심 스펙 자막 하이라이트, 깔끔한 BGM 및 효과음 배치를 통해 평균 시청 지속시간 52% 이상을 기록했습니다.',
    client: 'IT/테크 크리에이터 채널',
    role: '유튜브 메인 영상 편집',
    duration: '14분 30초 롱폼',
    tools: ['Premiere Pro', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isWide: true,
    featuredInHome: true,
    metrics: [
      { label: '누적 조회수', value: '45만+' },
      { label: '평균 시청 지속시간', value: '52.4%' },
      { label: '신규 구독자 유입', value: '+3,800명' }
    ],
    highlights: [
      '말과 말 사이 불필요한 숨소리 및 딜레이 완벽 제거 (타이트한 컷편집)',
      '눈에 띄는 가독성 높은 맞춤 자막 바 및 하이라이트 텍스트',
      '상황에 맞는 적재적소 효과음(SFX) 및 BGM 볼륨 밸런싱'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'lifestyle-vlog-youtube',
    title: '감성 브이로그 & 루틴 롱폼 편집',
    subtitle: 'Daily Life & Aesthetic Vlog',
    category: 'YOUTUBE VIDEO',
    categoryTag: 'VIDEO',
    year: '2024',
    description: '편안한 영상 색감 보정과 잔잔하면서도 늘어지지 않는 감각적인 일상 컷편집.',
    fullStory: '일상의 소소한 순간과 브이로그 특유의 자연스러운 무드를 살리면서도, 오디오 노이즈 캔슬링과 감각적인 폰트 레이아웃으로 높은 몰입도를 이끌어낸 프로젝트입니다.',
    client: '라이프스타일 유튜버',
    role: '영상 컷편집 & 자막 디자인',
    duration: '18분 20초',
    tools: ['Premiere Pro', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    isWide: false,
    featuredInHome: true,
    metrics: [
      { label: '조회수', value: '28만+' },
      { label: '댓글 반응률', value: '98% 긍정' },
      { label: '시청 유지율', value: '48.9%' }
    ],
    highlights: [
      '차분하고 따뜻한 자연광 톤 컬러 밸런스 조정',
      '대화 및 일상 소음(Foley) 살림 & 거슬리는 잡음 제거',
      '브이로그 분위기에 어울리는 깔끔한 감성 자막'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'shorts-reels-package',
    title: '유튜브 쇼츠 & 인스타 릴스 숏폼 팩',
    subtitle: 'High-Retention Short-form Videos',
    category: 'SHORTS / REELS',
    categoryTag: 'SHORTS',
    year: '2024',
    description: '3초 훅킹, 빠른 화면 전환, 중앙 집중식 볼드 자막으로 스크롤을 멈추게 하는 숏폼.',
    fullStory: '유튜브 롱폼의 핵심 하이라이트를 50초 내외 숏폼으로 재가공하거나 전용 숏폼을 제작하여 알고리즘 바이럴을 유도한 패키지 작업입니다.',
    client: '다수 크리에이터 & 브랜드 채널',
    role: '숏폼 기획 컷편집 & 텍스트 효과',
    duration: '30초 ~ 60초 (10편 세트)',
    tools: ['Premiere Pro', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    isWide: false,
    featuredInHome: true,
    metrics: [
      { label: '쇼츠 최고 조회수', value: '180만+' },
      { label: '평균 조회율 (VV)', value: '82%' },
      { label: '채널 유입 증가', value: '+340%' }
    ],
    highlights: [
      '처음 1~3초 안에 이탈을 막는 강력한 훅 구성',
      '모바일 화면에 최적화된 볼드 자막 및 강조 그래픽',
      '음악 비트에 맞춘 타이트한 컷 전환'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'minimalist-watch-store',
    title: '프리미엄 워치 이커머스 상세페이지',
    subtitle: 'Minimalist Watch Product Page',
    category: 'PRODUCT PAGE',
    categoryTag: 'PRODUCT',
    year: '2023',
    description: '제품의 실물감과 셀링포인트를 극대화하여 구매 전환율을 높이는 고품질 상세페이지.',
    fullStory: '단순한 사진 나열이 아닌, 소비자가 궁금해하는 핵심 특장점(사파이어 글래스, 스위스 무브먼트, 방수 등급, 럭셔리 스트랩)을 상단에서 직관적으로 인지시키고 신뢰감을 주는 구조로 기획·디자인된 상세페이지입니다.',
    client: '패션/시계 이커머스 브랜드',
    role: '상세페이지 기획 및 디자인',
    duration: '스마트스토어 / 쿠팡 규격 풀페이지',
    tools: ['Photoshop', 'Figma'],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    isWide: false,
    featuredInHome: true,
    metrics: [
      { label: '상세페이지 전환율', value: '4.8%' },
      { label: '이탈률 감소', value: '-28%' },
      { label: '고객 리뷰 만족도', value: '4.9점' }
    ],
    highlights: [
      '소비자 구매 결정을 돕는 논리적인 셀링포인트 배치',
      '고화질 누끼 및 제품 텍스처를 살린 정밀 보정',
      '모바일 쇼핑 환경에 최적화된 큰 글씨와 명확한 가독성'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1200&auto=format&fit=crop'
    ],
    detailSections: [
      {
        badge: 'INTRO HOOK 01',
        title: '클래식의 본질, 손목 위의 미니멀리즘',
        subtitle: '완벽한 비율과 정밀함이 선사하는 품격',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
        text: '불필요한 장식을 배제하고 시간을 가장 아름답게 표현하는 방법. 316L 의료용 스테인리스 스틸과 스위스 쿼츠 무브먼트의 결합으로 완성되었습니다.',
        points: ['초슬림 6.8mm 케이스 두께', '스크래치 없는 사파이어 크리스탈 글래스', '이태리산 베지터블 천연 소가죽 스트랩']
      },
      {
        badge: 'POINT 02. CRAFTSMANSHIP',
        title: '타협 없는 스펙 & 하이엔드 마감',
        subtitle: '100% 방수 테스트 및 엄격한 48단계 공정 검수',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
        text: '일상생활의 가벼운 손씻기부터 50m(5ATM) 방수 지원까지, 어떠한 환경에서도 당신의 스타일과 정밀한 시간을 지켜줍니다.',
        specs: [
          { label: '케이스 크기', value: '40mm / 두께 6.8mm' },
          { label: '글래스 소재', value: '긁힘 방지 사파이어 글래스' },
          { label: '무브먼트', value: 'Swiss Ronda Quartz 762' },
          { label: '방수 등급', value: '5 ATM (50m 일상 방수)' },
          { label: '스트랩 너비', value: '20mm 퀵릴리즈 교체형' }
        ]
      },
      {
        badge: 'POINT 03. STYLING & PACKAGING',
        title: '일상과 비즈니스를 아우르는 데일리 룩',
        subtitle: '고급 선물용 하드케이스 패키지 기본 증정',
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1200&auto=format&fit=crop',
        text: '수트부터 캐주얼웨어까지 손쉬운 스타일링. 별도의 포장 없이도 바로 선물 가능한 마그네틱 하드케이스와 정품 보증서가 동봉됩니다.'
      }
    ]
  },
  {
    id: 'living-kitchen-detail',
    title: '생활/주방용품 스마트스토어 상세페이지',
    subtitle: 'Living & Kitchen Product Detail Page',
    category: 'PRODUCT PAGE',
    categoryTag: 'PRODUCT',
    year: '2023',
    description: 'Before & After 비교와 실사용 Gif 및 특장점 인포그래픽 중심의 실속형 상세페이지.',
    fullStory: '소비자의 페인 포인트(기존 주방용품의 세척 불편함, 부피 문제)를 먼저 짚어주고 직관적인 해결책을 제시하는 스토리텔링형 상세페이지 디자인입니다.',
    client: '리빙 라이프 브랜드',
    role: '상세페이지 디자인 & GIF 편집',
    duration: '쿠팡 & 스마트스토어 최적화',
    tools: ['Photoshop', 'Figma'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    isWide: false,
    featuredInHome: false,
    metrics: [
      { label: '출시 첫 달 매출', value: '5,200만원' },
      { label: '구매 전환율', value: '5.1%' },
      { label: '재주문율', value: '34%' }
    ],
    highlights: [
      '소비자 공감을 유도하는 문제 제기 및 해결 프레임워크',
      '실사용 체감을 돕는 움짤(GIF) 및 규격 인포그래픽',
      '신뢰도를 높이는 Q&A 및 품질 보증 섹션'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1200&auto=format&fit=crop'
    ],
    detailSections: [
      {
        badge: 'PROBLEM & SOLUTION',
        title: '요리가 쉬워지고 주방이 정돈되는 순간',
        subtitle: '기존 주방용품의 불편함을 한번에 해결한 스마트 디자인',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
        text: '식기세척기 100% 사용 가능, 내열 항균 코팅으로 기름때 걱정 없이 가볍게 닦아내는 혁신적인 위생 주방 케어 솔루션.',
        points: ['BPA-FREE 안심 인증 친환경 실리콘', '영하 40도 ~ 영상 250도 초강력 내열성', '원터치 스택형 공간 절약형 수납 구조']
      },
      {
        badge: 'SPECIFICATIONS',
        title: '엄격한 안전 규격과 세부 스펙',
        subtitle: 'KCL 한국건설생활환경시험연구원 유해물질 불검출 인증 완료',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1200&auto=format&fit=crop',
        specs: [
          { label: '제품 구성', value: '본품 4종 세트 + 전용 거치대' },
          { label: '주요 소재', value: 'Platinum Grade Food-Safe Silicone' },
          { label: '내열 온도', value: '-40℃ ~ 250℃ (전자레인지/열탕 소독 가능)' },
          { label: '제조국', value: '대한민국 (Made in Korea)' }
        ]
      }
    ]
  },
  {
    id: 'info-education-youtube',
    title: '지식/정보 채널 롱폼 영상 편집',
    subtitle: 'Knowledge & Edu YouTube Video',
    category: 'YOUTUBE VIDEO',
    categoryTag: 'VIDEO',
    year: '2023',
    description: '복잡한 설명을 시각 자료와 타이포로 명확하게 전달하는 지식 정보형 유튜브 편집.',
    fullStory: '자료 화면, 도표, 텍스트 요약을 적재적소에 배치하여 시청자가 끝까지 몰입하여 내용을 이해할 수 있도록 구조화된 편집을 진행했습니다.',
    client: '경제/지식 크리에이터',
    role: '자료 조사 싱크 & 영상 편집',
    duration: '12분 00초',
    tools: ['Premiere Pro', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    isWide: false,
    featuredInHome: false,
    metrics: [
      { label: '조회수', value: '62만+' },
      { label: '시청 지속시간', value: '55.2%' },
      { label: '공유 수', value: '1.2만회' }
    ],
    highlights: [
      '어려운 개념을 빠르게 짚어주는 깔끔한 요약 자막',
      '자료 화면 전환 시 오디오 싱크 및 팝업 효과음',
      '지루할 틈 없는 시각 자료 인서트 및 모션 컷'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'wireless-audio-detail',
    title: '무선 음향기기 제품 상세페이지 디자인',
    subtitle: 'Wireless Audio Detail Page Design',
    category: 'PRODUCT PAGE',
    categoryTag: 'PRODUCT',
    year: '2023',
    description: '스펙 비교표와 깔끔한 제품 누끼로 기술력과 가성비를 동시에 어필하는 상세페이지.',
    fullStory: '음질과 배터리 성능, 노이즈 캔슬링 등 핵심 스펙을 한눈에 알기 쉽게 정리하고, 소비자의 신뢰를 높이는 구성으로 디자인했습니다.',
    client: '음향기기 수입/유통사',
    role: '상세페이지 기획 및 디자인',
    duration: '스마트스토어 / 쿠팡 규격',
    tools: ['Photoshop', 'Figma'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    isWide: true,
    featuredInHome: false,
    metrics: [
      { label: '오픈마켓 베스트', value: '카테고리 1위' },
      { label: '구매 전환율', value: '6.2%' },
      { label: '클릭률 (CTR)', value: '+45%' }
    ],
    highlights: [
      '직관적인 스펙 비교표 및 제품 분해도 강조',
      '모바일 쿠팡/스마트스토어 해상도 완벽 대응',
      '눈에 띄는 검색 썸네일 배리에이션'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop'
    ],
    detailSections: [
      {
        badge: 'SOUND TECHNOLOGY',
        title: '공간을 채우는 압도적 사운드와 하이브리드 ANC',
        subtitle: '40mm 다이내믹 드라이버로 원음 그대로의 감동',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
        text: '주변 소음을 최대 -38dB까지 상쇄하는 액티브 노이즈 캔슬링과 초저지연 게이밍 모드를 완벽 지원합니다.',
        points: ['최대 45시간 연속 재생 대용량 배터리', 'C타입 고속충전 10분 충전 시 5시간 재생', '블루투스 5.3 듀얼 페어링 지원']
      }
    ]
  },
  {
    id: 'beauty-skincare-detail',
    title: '클린 뷰티 & 스킨케어 상세페이지 기획·디자인',
    subtitle: 'Clean Beauty & Skincare Product Page',
    category: 'PRODUCT PAGE',
    categoryTag: 'PRODUCT',
    year: '2023',
    description: '맑고 투명한 제품 텍스처 강조와 효능 검증 임상 수치 중심의 뷰티 상세페이지.',
    fullStory: '성분과 수분감, 발림성을 극대화한 고화질 클로즈업 컷과 직관적인 테스트 인포그래픽을 배치하여 소비자의 신뢰도를 극대화한 뷰티 브랜드 상세페이지입니다.',
    client: '코스메틱 브랜드',
    role: '상세페이지 기획 및 비주얼 디자인',
    duration: '와디즈 & 스마트스토어 규격',
    tools: ['Photoshop', 'Figma'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
    isWide: false,
    featuredInHome: true,
    metrics: [
      { label: '펀딩 달성률', value: '1,420%' },
      { label: '구매 전환율', value: '5.8%' },
      { label: '장바구니 전환', value: '18.4%' }
    ],
    highlights: [
      '제품 제형(수분/유분/흡수력) 클로즈업 비주얼 극대화',
      '임상 시험 결과 및 피부 자극 테스트 인포그래픽',
      '스마트폰 화면에 최적화된 모바일 중심 레이아웃'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop'
    ],
    detailSections: [
      {
        badge: 'DERMA FORMULA',
        title: '바르는 즉시 차오르는 10중 히알루론산 수분 진정',
        subtitle: '민감성 피부 자극 지수 0.00 비자극 인증 완료',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
        text: '단 1회 사용만으로 피부 속보습 128% 개선. EWG 그린 등급 원료 100% 처방으로 연약한 피부도 안심하고 사용할 수 있습니다.',
        points: ['인체 적용 시험 피부 속당김 개선율 99%', '비건 표준 인증원 정식 비건 인증', '인공 향료 및 색소 0% 무첨가 안심 처방']
      }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: '말이 늘어지지 않고 컷이 정말 타이트해서 시청 지속시간이 확실히 올라갔습니다. 피드백 반영도 정말 빠르세요.',
    author: '박민우 님',
    role: '채널 운영자 (구독자 24만)',
    company: '테크 유튜브 채널',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    projectName: '테크 리뷰 롱폼 편집'
  },
  {
    id: 't2',
    quote: '상세페이지 바꾼 뒤로 스마트스토어 유입 대비 구매 전환율이 2배 넘게 뛰었습니다. 셀링포인트를 기가 막히게 잡아주세요.',
    author: '이선영 대표',
    role: '브랜드 대표',
    company: '스마트스토어 리빙 브랜드',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    projectName: '주방용품 상세페이지'
  },
  {
    id: 't3',
    quote: '마감 기한 한 번도 어기신 적 없고 소통이 너무 편합니다. 롱폼 맡기면서 숏폼까지 알아서 뽑아주셔서 채널이 크게 컸습니다.',
    author: '김도현 님',
    role: '크리에이터',
    company: '지식/정보 채널',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    projectName: '유튜브 롱폼 & 숏폼 패키지'
  }
];

export const SKILL_STACK = [
  {
    name: '유튜브 롱폼 영상 편집',
    description: '호흡과 텐션을 고려한 컷편집, 가독성 높은 자막 및 오디오 밸런싱',
    tools: ['프리미어 프로 (Premiere Pro)', '타이트한 컷편집', '호흡 및 템포 조절', '맞춤 자막 디자인', 'BGM / 효과음 믹싱']
  },
  {
    name: '유튜브 숏폼 / 릴스 편집',
    description: '3초 훅킹과 스크롤을 멈추게 하는 빠른 템포의 세로형 영상',
    tools: ['3초 훅킹 편집', '중앙 집중식 볼드 자막', '빠른 컷 전환', '9:16 모바일 최적화']
  },
  {
    name: '이커머스 상세페이지 디자인',
    description: '구매 결정을 돕는 논리적 셀링포인트 기획 및 깔끔한 제품 비주얼',
    tools: ['포토샵 (Photoshop)', '피그마 (Figma)', '셀링포인트 기획', '제품 누끼 & 톤보정', 'GIF 시연 움짤 제작']
  }
];

export const STATS = [
  { number: '100%+', label: '납기 기한 준수율' },
  { number: '350편+', label: '영상 편집 완료' },
  { number: '120건+', label: '상세페이지 제작' },
  { number: '95%', label: '클라이언트 재의뢰율' }
];
