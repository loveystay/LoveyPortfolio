import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Health check endpoint for Cloud Run container probes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function getSystemInstruction(language: 'ko' | 'en' | 'ja'): string {
  if (language === 'en') {
    return `You are the official 1:1 project AI Consultation Assistant for video editor & e-commerce product page designer 'lovey'.
You MUST respond strictly and fluently in English.

[lovey's Official Scope & Consultation Guidelines]

0. Professional Scope (Crucial):
   • lovey specializes EXCLUSIVELY in **Video Editing (YouTube Long-form, Shorts / Reels / TikTok)** and **E-commerce Product Detail Page Design**.
   • **lovey NEVER creates standalone YouTube thumbnails.** If asked about thumbnails, clarify politely: "lovey focuses exclusively on video editing and product detail page design, and does not provide standalone thumbnail design services."
   • Motion graphics are also not in the primary specialization scope.

1. Payment & Project Kickoff Principles (Crucial):
   • **All work begins strictly after deposit / payment confirmation.**
   • Production scheduling and kickoff priority are **assigned chronologically in the order payment is received**.

2. Briefing Requirements, Revision & Refund Policy (Crucial):
   • For product pages & video editing, clients must provide **clear mood/atmosphere references, high-resolution original product photos, and mandatory text/copy**.
   • **If only vague or abstract instructions are provided, the work will be produced at the creator's discretion**, and subsequent requests for **full redesigns, total re-edits, or refunds will be declined**.

3. Standard Turnaround Time:
   • **Long-form Video Editing**: Varies by raw footage length, approx. **2 weeks** for a 30+ minute final cut.
   • **Short-form Video** (Shorts / Reels / TikTok): approx. **3 days to 1 week**.

4. Revision Policy:
   • Includes **2 rounds of standard complimentary revisions** (typos, timing fine-tuning, audio leveling, color adjustments).

5. Official Contact:
   • Official contact email: **contact@staylovey.com** (available for custom quote inquiries and monthly retainer contracts).

[Response Style & Formatting Rules]
• Assistant Identity Name: Always refer to yourself as '**AI Consultation Assistant**'.
• Single Brand Name: Always use '**lovey**' (lowercase).
• Format with clean Markdown: Use **bold** for key terms and bullet points (•) or numbers for effortless readability.
• ALWAYS respond in English.`;
  }

  if (language === 'ja') {
    return `あなたは映像エディター＆EC・商品LPデザイナー「lovey」の公式1:1プロジェクト「AI相談アシスタント」です。
必ず丁寧で自然な日本語（ビジネス敬語）で回答してください。

【loveyの公式作業範囲および案内方針】

0. 専門作業範囲（重要）:
   • loveyは**動画編集（YouTube長編、ショート/リール/TikTok）およびECモール商品ページ（LP）デザインのみ**を専門として制作しています。
   • **YouTubeサムネイルの単体制作は一切承っておりません。** サムネイル制作に関するお問い合わせには「loveyは動画編集と商品LP制作に特化しており、サムネイルデザインは行っておりません」と明確にご案内してください。
   • モーショングラフィックスも専門対象外となります。

1. お支払いおよび作業着手の原則（重要）:
   • **すべての作業はご入金確認後に着手**となり、制作スケジュールは**ご入金順に順次割り当て**られます。

2. 必要素材および修正・返金規定（重要）:
   • 商品LPや動画編集のご依頼時は、**希望するテイスト/参考事例（URL等）、高画質の商品元画像（必須）、必須掲載テキスト**をご共有いただく必要があります。
   • **明確な指示がなく抽象的なご要望のみで進めた場合、クリエイターの裁量で制作**され、それに伴う**全面作り直し・全修正リクエストおよび返金はお受けできかねます**。

3. 制作所要期間の目安:
   • **長編動画編集**: 元動画の尺により異なりますが、完成尺30分以上の動画で**約2週間**程度。
   • **ショート動画**（YouTubeショート / リール / TikTok）: **約3日〜1週間**程度。

4. 修正対応:
   • 基本**2回の無償修正**に対応（誤字修正、微細なタイミング・音量調整、色調微調整など）。

5. 公式お問い合わせ先:
   • 公式メールアドレス: **contact@staylovey.com**（お見積り相談、月額定期契約のお問い合わせなど受付中）。

【回答スタイル・フォーマット】
• アシスタント名: 常に「**AI相談アシスタント**」と名乗ってください。
• ブランド表記: 常に半角英小文字「**lovey**」で統一してください。
• 読みやすさ: **太字（ボールド）**や箇条書き（•）、番号付きリストを活用して整理してください。
• 公式メールは常に「**contact@staylovey.com**」をご案内してください。
• 必ず日本語で回答してください。`;
  }

  // Korean (default)
  return `당신은 영상 편집자 및 이커머스 상세페이지 디자이너 'lovey'의 공식 1:1 프로젝트 'AI 상담 어시스턴트'입니다.
한국어로 친절하고 정확하게 답변해 주세요.

[lovey 공식 작업 범위 및 안내 기준]

0. 전문 작업 분야 (매우 중요):
   • lovey는 **동영상 편집(유튜브 롱폼, 숏폼/릴스/틱톡) 및 이커머스 상세페이지 디자인만을 전문으로 제작**합니다.
   • **유튜브 썸네일 단독 제작은 일체 진행하지 않습니다.** 썸네일 제작 문의 시 "lovey는 영상 편집과 상세페이지 제작에 집중하고 있어, 썸네일 디자인은 진행하지 않습니다"라고 정중하고 명확하게 안내해 주세요.
   • 모션그래픽 또한 전문 영역이 아닙니다.

1. 결제 방식 및 작업 착수 원칙 (매우 중요):
   • **모든 작업은 입금 확인 후 본격적인 제작에 착수**합니다.
   • 작업 스케줄 및 착수 우선순위는 **입금 순서에 따라 순차적으로 배정**됩니다.

2. 상세페이지 의뢰 시 준비물 및 수정/환불 정책 (매우 중요):
   • 상세페이지 및 영상 의뢰 시 **원하시는 분위기/레퍼런스 링크, 제품 고화질 원본 사진(필수), 필수 기재 문구**를 전달해 주셔야 합니다.
   • **명확한 설명/기획 없이 추상적인 요청만으로 진행된 경우 작업자의 판단에 따라 임의 제작**되며, 이에 따른 **전체 재작업/수정 요청 및 환불은 거절될 수 있습니다.**

3. 표준 제작 소요 기간:
   • **롱폼 영상 편집**: 원본 길이에 따라 상이하나, 완성본 30분 이상 기준 약 **2주** 소요
   • **숏폼 영상** (숏폼/릴스/틱톡): 약 **3일 ~ 1주** 소요

4. 수정 정책:
   • 기본 **2회 무상 수정** 지원 (오타, 싱크 미세 조정, 컬러 밸런스 등)

5. 공식 문의처:
   • 공식 이메일: **contact@staylovey.com**

[답변 스타일 & 가독성 규칙]
• 이름은 항상 '**AI 상담 어시스턴트**'로 칭합니다.
• 브랜드 표기는 항상 영문 소문자 '**lovey**'로 표기합니다.
• 공식 이메일은 항상 '**contact@staylovey.com**'으로 안내합니다.
• 답변 가독성을 위해 핵심 키워드는 **볼드** 처리하며 불릿 포인트(•)와 넘버링을 적극 활용하여 한눈에 읽기 쉽게 정리해 주세요.
• 반드시 한국어로 답변해 주세요.`;
}

// Deterministic context-aware reply generator for all languages
function generateContextualReply(query: string, language: 'ko' | 'en' | 'ja'): string {
  const q = query.toLowerCase();

  // ENGLISH FALLBACK RESPONSES
  if (language === 'en') {
    if (q.includes('thumbnail')) {
      return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\n⚠️ **Notice Regarding Thumbnail Design**\n\n• lovey specializes exclusively in **Video Editing (YouTube Long-form & Shorts/Reels)** and **E-commerce Product Detail Page Design**.\n• **Please note that standalone YouTube thumbnail design is NOT offered.**\n\nFor inquiries about video editing or product page design, feel free to ask here or email us at **contact@staylovey.com**!`;
    }

    if (q.includes('long') || q.includes('turnaround') || q.includes('how long') || q.includes('time') || q.includes('duration') || q.includes('schedule')) {
      return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\n🎬 **Long-form Video Editing Turnaround Time**\n\n• **Turnaround**: Varies depending on raw footage length, taking approx. **2 weeks** for a 30+ minute final cut.\n• **Kickoff Rule**: All projects **commence strictly upon deposit confirmation in sequential order**.\n• **Editing Highlights**: Retention-focused rhythm cuts, customized typography subtitles, and balanced BGM / SFX sound leveling.\n\nTo discuss project dates or request a quote, feel free to email **contact@staylovey.com**!`;
    }

    if (q.includes('short') || q.includes('reel') || q.includes('tiktok')) {
      return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\n📱 **Shorts & Reels Production Turnaround**\n\n• **Turnaround**: Approx. **3 days to 1 week**.\n• **Key Features**: Strong 1–3 second hook, rapid pacing, bold mobile subtitles, and 9:16 vertical ratio optimization.\n• **Project Start**: Scheduled **chronologically upon deposit confirmation**.\n\nPlease share your reference links via **contact@staylovey.com** for an expedited consultation!`;
    }

    if (q.includes('product') || q.includes('detail') || q.includes('material') || q.includes('prepare') || q.includes('brief')) {
      return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\n🛍️ **Required Materials for Product Detail Pages**\n\n1. **Clear Direction & References**: Desired tone, target demographic, and benchmarking reference links.\n2. **High-Res Product Photos**: Clear original product cutouts and lifestyle shots (Essential).\n3. **Key Selling Points & Copy**: Mandatory product features and specifications.\n\n⚠️ **Important Policy**:\nIf only abstract or vague descriptions are provided, the project will be designed based on creator discretion, and **requests for full redesigns or refunds will be declined.**\n\nOfficial Email: **contact@staylovey.com**`;
    }

    if (q.includes('refund') || q.includes('revision') || q.includes('feedback') || q.includes('edit')) {
      return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\n📋 **Revision & Refund Policy**\n\n• **Complimentary Revisions**: **2 rounds of free standard revisions** (typos, timing adjustments, audio/color balance).\n• **Deposit & Scheduling**: Production begins strictly upon payment in sequential order.\n• **Non-Refundable Policy**: Complete structural re-edits or redesigns resulting from vague initial briefs are non-refundable.\n\nFor more information, please contact **contact@staylovey.com**.`;
    }

    if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('payment') || q.includes('deposit') || q.includes('retainer')) {
      return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\n💳 **Payment & Project Kickoff Policy**\n\n• **Deposit-First**: **All projects initiate strictly upon confirmed deposit**.\n• **Queue Priority**: Schedules are assigned in order of payment received.\n• **Quote Standards**: Custom quoted based on footage volume, subtitle density, and product page length.\n• **Monthly Retainers**: Retainer agreements for regular video editing are also available.\n\nFor a customized quote, please send your project specs to **contact@staylovey.com**!`;
    }

    return `Hello! I am the **AI Consultation Assistant** for **lovey**.\n\nRegarding your inquiry: "${query}"\n\n📌 **Key Service Overview**\n• **Specialization**: Video Editing (YouTube Long-form & Shorts/Reels) and E-commerce Product Page Design (*Note: Thumbnails are not offered*).\n• **Kickoff Rule**: Production begins strictly upon deposit confirmation in sequential order.\n• **Turnaround**: Long-form (~2 weeks for 30+ min final cut) | Shorts (3 days ~ 1 week).\n• **Revisions**: 2 complimentary revisions included.\n• **Official Email**: **contact@staylovey.com**\n\nFeel free to ask more or reach out via email!`;
  }

  // JAPANESE FALLBACK RESPONSES
  if (language === 'ja') {
    if (q.includes('サムネイル') || q.includes('thumbnail')) {
      return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\n⚠️ **サムネイル制作に関するご案内**\n\n• loveyは**動画編集（YouTube長編・ショート/リール）およびEC商品ページ（LP）デザインのみ**を専門としております。\n• **YouTubeサムネイルの単体制作は承っておりません**ので、あらかじめご了承ください。\n\n動画編集や商品LPのご相談は公式メール（**contact@staylovey.com**）までお気軽にお問い合わせください。`;
    }

    if (q.includes('長編') || q.includes('納期') || q.includes('期間') || q.includes('日数') || q.includes('スケジュール')) {
      return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\n🎬 **長編動画編集の制作期間について**\n\n• **所要期間**: 元動画の分量により異なりますが、完成尺**30分以上の動画で約2週間**程度となります。\n• **着手基準**: すべての作業は**ご入金確認後にご入金順で順次着手**いたします。\n• **編集の強み**: 視聴維持率を高めるタイトなカット編集、視認性の高いテロップ、BGM・効果音ミックス\n\n具体的な日程やお見積りのご相談は、公式メール（**contact@staylovey.com**）までお気軽にご連絡ください！`;
    }

    if (q.includes('ショート') || q.includes('リール') || q.includes('tiktok') || q.includes('shorts')) {
      return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\n📱 **ショート・リール動画の制作期間について**\n\n• **所要期間**: **約3日〜1週間**程度となります。\n• **ポイント**: 冒頭3秒のフック強化、9:16スマホ最適化、インパクトのあるボールドテロップ\n• **着手**: **ご入金確認順**にスケジュールを確定いたします。\n\n参考動画URLを添えて公式メール（**contact@staylovey.com**）までお問い合わせください。`;
    }

    if (q.includes('商品') || q.includes('lp') || q.includes('詳細') || q.includes('素材') || q.includes('準備')) {
      return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\n🛍️ **商品LP制作ご依頼時の必要素材**\n\n1. **明確な企画・参考イメージ**: ご希望のテイスト、ターゲット、参考事例URL\n2. **高画質な商品写真**: 白抜き・色調補正用の元画像（必須）\n3. **必須掲載テキスト**: 特徴、セールスポイント、スペック情報\n\n⚠️ **重要事項**:\n明確なご指示がなく抽象的なご要望のみの場合、クリエイター裁量での制作となり、それに伴う**全面作り直しや返金はお受けできかねます**。\n\n公式メール: **contact@staylovey.com**`;
    }

    if (q.includes('修正') || q.includes('返金') || q.includes('フィードバック') || q.includes('キャンセル')) {
      return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\n📋 **修正および返金ポリシー**\n\n• **無償修正**: 基本**2回まで無料修正**に対応（誤字修正、細かなタイミング・音量調整等）。\n• **着手**: ご入金確認後に順次着手となります。\n• **作り直し・返金不可の基準**: 抽象的な指示による制作後の全面変更・全修正や返金は承りかねます。\n\nご不明な点は公式メール（**contact@staylovey.com**）までお問い合わせください。`;
    }

    if (q.includes('見積') || q.includes('料金') || q.includes('費用') || q.includes('入金') || q.includes('支払い') || q.includes('月額')) {
      return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\n💳 **お支払いおよび着手基準について**\n\n• **前入金制**: **すべての作業はご入金確認後に本格着手**いたします。\n• **着手順序**: ご入金完了順にスケジュールを確定・制作進行します。\n• **お見積り**: 動画尺、テロップ量、LP構成ボリュームに応じて個別に算出いたします。\n• **定期月額契約**: 月単位での継続的な動画編集契約も可能です。\n\n公式メール（**contact@staylovey.com**）へご相談内容をお送りいただければ、迅速にお見積もりをご案内いたします。`;
    }

    return `こんにちは！**lovey**の**AI相談アシスタント**です。\n\nお問い合わせ内容:「${query}」\n\n📌 **loveyの制作概要**\n• **専門分野**: 動画編集（YouTube長編・ショート）＆EC商品LP制作（※サムネイル単体制作は行っておりません）\n• **作業着手**: すべてご入金確認後の順次制作着手\n• **制作期間**: 長編（約2週間） / ショート（約3日〜1週間）\n• **修正対応**: 基本2回無償修正\n• **公式メール**: **contact@staylovey.com**\n\nその他ご不明な点がございましたら、お気軽にメールにてお問い合わせください！`;
  }

  // KOREAN FALLBACK RESPONSES
  if (q.includes('썸네일') || q.includes('thumbnail')) {
    return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n⚠️ **썸네일 제작 관련 안내**\n\n• lovey는 **동영상 편집(유튜브 롱폼/숏폼)과 이커머스 상세페이지 디자인만을 전문으로 제작**하고 있습니다.\n• **유튜브 썸네일 제작은 일체 진행하지 않으니** 의뢰 시 참고 부탁드립니다.\n\n영상 편집 및 상세페이지 관련 문의는 언제든 편하게 질문해 주시거나 공식 메일(**contact@staylovey.com**)로 남겨주시면 성심껏 답변드리겠습니다.`;
  }

  if (q.includes('롱폼') || (q.includes('영상') && (q.includes('기간') || q.includes('얼마나') || q.includes('소요')))) {
    return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n🎬 **롱폼 영상 편집 소요 기간 안내**\n\n• **소요 기간**: 영상 원본 길이에 따라 상이하며, **30분 이상 완성 결과물 기준 약 2주** 정도 소요됩니다.\n• **작업 착수 원칙**: 모든 작업은 **입금 확인 후 입금 순서대로 제작 착수**됩니다.\n• **편집 강점**: 시청 지속시간을 높이는 타이트한 컷편집, 호흡 조절, 가독성 높은 맞춤 자막 디자인, BGM & 사운드 믹싱\n\n세부 일정 및 견적 조율은 공식 메일(**contact@staylovey.com**)로 편하게 문의해 주세요!`;
  }

  if (q.includes('숏폼') || q.includes('쇼츠') || q.includes('릴스') || q.includes('틱톡')) {
    return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n📱 **숏폼 / 릴스 / 쇼츠 제작 기간 안내**\n\n• **소요 기간**: 약 **3일 ~ 1주일** 내외 소요됩니다.\n• **핵심 포인트**: 초반 3초 훅킹(Hooking) 중심 빠른 전개, 중앙 집중형 볼드 자막 디자인, 9:16 모바일 비율 최적화\n• **작업 착수**: **입금 확인 후 입금 순서대로** 제작 일정이 확정됩니다.\n\n원하시는 레퍼런스 영상 링크와 함께 공식 메일(**contact@staylovey.com**)로 문의해 주시면 빠른 일정 협의가 가능합니다.`;
  }

  if (q.includes('상세페이지') || q.includes('자료') || q.includes('준비') || q.includes('디자인')) {
    return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n🛍️ **상세페이지 디자인 의뢰 시 필수 준비 자료**\n\n1. **명확한 기획 & 분위기 설명**: 원하시는 톤앤매너, 타겟 고객, 벤치마킹할 레퍼런스 링크/이미지\n2. **제품 고화질 원본 사진**: 제품 누끼 및 톤보정에 필요한 고화질 이미지 (필수)\n3. **필수 삽입 문구**: 상세페이지에 꼭 들어가야 하는 특장점, 셀링포인트 및 카피라이팅\n\n⚠️ **중요 유의사항**:\n명확한 설명 없이 추상적인 문구들로만 전달해 주실 경우 작업자의 판단에 따라 임의 제작되며, 이에 따른 **전체 재작업/수정 요청 및 환불은 거절될 수 있습니다.**\n\n공식 문의 메일: **contact@staylovey.com**`;
  }

  if (q.includes('환불') || q.includes('수정') || q.includes('피드백') || q.includes('취소')) {
    return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n📋 **수정 정책 및 환불 규정 안내**\n\n• **무상 수정**: 기본 **2회 무상 수정**을 지원합니다. (텍스트 오타, 싱크 미세 조정, 컬러 밸런스 등)\n• **입금 및 착수**: 모든 작업은 **입금 확인 후 순차 착수**됩니다.\n• **환불 및 전체 수정 거절 기준**: 의뢰 시 명확한 설명/기획 없이 추상적인 요청으로 임의 제작된 후 발생하는 **전체 기획 변경, 전체 재편집/재디자인 요청 및 환불은 거절될 수 있습니다.**\n\n추가 문의는 공식 메일(**contact@staylovey.com**)로 남겨주시면 친절히 안내해 드리겠습니다.`;
  }

  if (q.includes('입금') || q.includes('결제') || q.includes('순서') || q.includes('순차') || q.includes('견적') || q.includes('비용') || q.includes('가격') || q.includes('월')) {
    return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n💳 **결제 방식 및 작업 착수 순서 안내**\n\n• **입금 후 착수**: **모든 작업은 입금 확인 후 본격적인 제작에 착수**합니다.\n• **작업 순서**: 작업 스케줄은 **입금 순서에 따라 순차적으로 배정**됩니다.\n• **견적 산정**: 영상 분량(롱폼/숏폼), 가편집 여부, 자막/효과 수준, 상세페이지 길이 및 구성에 따라 맞춤 산정됩니다.\n• **월 단위 계약**: 정기적인 영상 편집 계약도 가능합니다.\n\n정확한 견적 확인은 공식 메일(**contact@staylovey.com**)로 분량과 레퍼런스를 남겨주시면 확인 후 바로 답변드리겠습니다.`;
  }

  return `안녕하세요! **AI 상담 어시스턴트**입니다.\n\n문의하신 내용: "${query}"\n\n📌 **lovey 작업 핵심 요약 안내**\n• **전문 분야**: 동영상 편집(유튜브 롱폼, 숏폼/릴스) 및 이커머스 상세페이지 디자인 (※ 썸네일은 제작하지 않습니다)\n• **작업 착수**: 모든 작업은 **입금 확인 후 입금 순서대로 제작**에 착수합니다.\n• **롱폼 영상**: 원본 길이에 따라 상이 (30분 이상 완성본 기준 약 **2주** 소요)\n• **숏폼 영상**: 약 **3일 ~ 1주** 소요\n• **상세페이지 필수 준비 자료**: 원하는 분위기/레퍼런스 설명, 제품 사진(필수), 필수 삽입 문구\n• **유의사항**: 추상적인 설명으로만 요청 시 임의 제작되며, 이에 따른 전체 수정 요청 및 환불은 거절될 수 있습니다.\n• **수정 지원**: 기본 2회 무상 수정 지원\n\n공식 문의 이메일: **contact@staylovey.com**`;
}

// API Routes
app.post('/api/ai-suggest', async (req, res) => {
  try {
    const { title, category, client, role, roughNotes, productCategory, targetField } = req.body;

    const ai = getGeminiClient();
    const isProduct = category === 'PRODUCT PAGE';
    const isShorts = category === 'SHORTS / REELS';
    
    // Fallback template generator if Gemini is offline
    const generateFallback = () => {
      if (targetField === 'description') {
        if (isProduct) {
          return `${client || '브랜드'}의 브랜드 아이덴티티와 제품 특장점을 면밀히 분석하여, 직관적인 비주얼 구조와 설득력 있는 카피라이팅으로 구매 전환율을 극대화한 ${productCategory || '이커머스'} 상세페이지 디자인입니다.`;
        }
        if (isShorts) {
          return `초반 3초 시선 집중 훅킹(Hooking)과 빠른 리듬의 점프컷, 모바일에 최적화된 볼드 자막 디자인으로 시청 지속시간과 바이럴 효과를 극대화한 숏폼 콘텐츠입니다.`;
        }
        return `정교한 컷 호흡 조절과 가독성 높은 맞춤형 자막 디자인, 몰입감을 더하는 사운드 믹싱을 통해 시청자 이탈을 최소화하고 완성도를 높인 유튜브 롱폼 영상입니다.`;
      }

      if (targetField === 'fullStory') {
        if (isProduct) {
          return `[기획 의도 및 타깃 분석]\n소비자가 스크롤을 내리는 동안 자연스럽게 공감하고 몰입할 수 있도록 고객의 페인포인트(Pain Point)를 서두에 배치했습니다. 브랜드의 프리미엄 감성을 유지하면서도 핵심 소구점을 직관적으로 전달하는 서사 구조를 설계했습니다.\n\n[비주얼 & 디자인 전략]\n• 제품 본연의 질감과 컬러를 극대화하는 정밀 톤보정 및 깔끔한 누끼 작업\n• 정보 계층 구조(Hierarchy)를 고려한 타이포그래피 및 직관적인 인포그래픽 구성\n• 스크롤의 지루함을 없애는 리듬감 있는 섹션 분할과 시각적 강조 효과\n\n[모바일 최적화 & 전환율(CTA) 설계]\n스마트폰(390px) 환경에서도 폰트가 뭉개지지 않고 한눈에 읽히도록 여백과 폰트 크기를 최적화하여 최종 구매 결정까지 매끄럽게 유도했습니다.`;
        }
        if (isShorts) {
          return `[기획 및 편집 전략]\n초반 1~3초 내에 시청자의 이탈을 방지하기 위해 강렬한 시각적 훅과 사운드 이펙트를 배치했습니다. 9:16 세로형 화면 비율에 맞춰 중앙 집중형 레이아웃을 구성하고, 대화의 호흡을 타이트하게 줄여 빠른 템포를 유지했습니다.\n\n[주요 작업 포인트]\n• 불필요한 숨소리 및 딜레이를 완벽히 제거한 쾌속 컷편집\n• 트렌디하고 가독성 높은 볼드 자막 및 모션 그래픽 적용\n• 알고리즘 유입을 유도하는 리듬감 있는 BGM 선정 및 비트 싱크`;
        }
        return `[기획 및 편집 전략]\n원 영상의 긴 호흡을 정리하고 핵심 스토리라인을 부각시키기 위해 전체 구성안을 재정비했습니다. 정보 전달 구간과 감정적 몰입 구간의 템포를 조절하여 끝까지 시청할 수 있는 리듬을 설계했습니다.\n\n[주요 작업 포인트]\n• 발화 구간 사이의 미세 딜레이를 정리하여 지루함을 배제한 타이트한 컷편집\n• 상황별 톤앤매너에 맞춘 커스텀 자막 폰트 및 그래픽 바 디자인\n• 오디오 정밀 레벨링 및 현장감과 몰입도를 극대화하는 적재적소 SFX 배치`;
      }

      // all fields (bulk recommendation)
      return {
        description: isProduct
          ? `${client || '브랜드'}의 고유한 특장점을 직관적인 비주얼과 매력적인 스토리텔링으로 풀어내어 구매 결정을 촉진하는 ${productCategory || 'e-커머스'} 상세페이지 디자인입니다.`
          : isShorts
          ? `초반 3초 훅킹과 트렌디한 템포의 컷편집, 중앙 볼드 자막으로 모바일 환경에서 폭발적인 반응을 유도한 숏폼 프로젝트입니다.`
          : `타이트한 컷편집과 가독성을 극대화한 맞춤 자막, 정교한 사운드 믹싱으로 시청 지속률을 극대화한 유튜브 롱폼 영상 편집 프로젝트입니다.`,
        fullStory: isProduct
          ? `[기획 의도 및 타깃 분석]\n소비자의 유입부터 구매 전환까지의 흐름을 분석하여, ${productCategory || '제품'}의 매력과 차별화 포인트를 가장 효과적으로 전달할 수 있도록 기획되었습니다.\n\n[비주얼 및 디자인 전략]\n1. 고품질 비주얼: 제품 본연의 질감과 컬러감을 살린 정밀 톤보정\n2. 설득적 카피: 고객의 페인포인트를 해결하는 명확한 카피라이팅 구조화\n3. 직관적 인포그래픽: 복잡한 제품 스펙을 한눈에 이해시키는 비주얼 구성\n\n[모바일 환경 및 전환율 최적화]\n네이버 스마트스토어/쿠팡/와디즈 등 다양한 이커머스 플랫폼의 모바일 가독성을 최우선으로 고려하여 폰트 스케일과 여백을 정밀하게 설계했습니다.`
          : `[프로젝트 개요]\n시청자의 집중력을 끝까지 유지하기 위해 불필요한 오디오/비디오 간격을 정밀하게 제거하고, 시각적 변주를 주어 지루할 틈 없는 전개를 구현했습니다.\n\n[핵심 실행 내용]\n1. 호흡 조절: 완벽한 타이밍의 점프컷과 씬 전환\n2. 맞춤 자막: 영상의 분위기를 살리는 직관적인 폰트와 레이아웃\n3. 오디오 마스터링: 음성 명료도 개선 및 배경음악과의 황금 볼륨 밸런스`,
        highlights: isProduct
          ? [
              '소비자의 시선을 단숨에 사로잡는 상단 인트로 히어로 섹션 및 카피라이팅',
              '제품의 핵심 소구점(USP)과 특장점을 한눈에 각인시키는 직관적인 인포그래픽',
              '모바일(390px) 스크롤 환경에 최적화된 폰트 위계 및 구매 전환(CTA) 유도 설계',
            ]
          : isShorts
          ? [
              '스크롤을 멈추게 만드는 초반 1~3초 강력한 훅킹(Hooking) 연출',
              '모바일 화면에 최적화된 중앙 집중형 볼드 자막 및 강조 효과',
              '비트와 모션에 맞춘 빠른 템포의 타이트한 컷편집 및 트렌디한 SFX',
            ]
          : [
              '말과 말 사이 불필요한 숨소리 및 딜레이 완벽 제거 (타이트한 컷편집)',
              '눈에 띄는 가독성 높은 맞춤 자막 바 및 하이라이트 텍스트 디자인',
              '상황에 맞는 적재적소 효과음(SFX) 및 BGM 볼륨 밸런싱',
            ],
      };
    };

    if (!ai) {
      const fallbackResult = generateFallback();
      return res.json({ result: fallbackResult });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (isProduct) {
      // Specialized E-commerce / Landing Page Copywriter
      systemPrompt = `당신은 이커머스 상세페이지 기획자(MD)이자 전문 랜딩페이지(LP) 비주얼 디렉터입니다.
사용자가 입력한 상품명, 브랜드, 카테고리, 작업 메모(rough notes)를 분석하여 네이버 스마트스토어, 쿠팡, 와디즈/텀블벅 펀딩, 자사몰에 완벽히 부합하는 프로페셔널한 포트폴리오 문구를 작성해주세요.

[상세페이지 작성 원칙]
1. [기획/카피]: 소비자의 페인포인트(Pain Point) 공감 -> 솔루션 제시 -> 제품 특장점(USP) -> 구매 전환(CTA)으로 이어지는 설득력 있는 스토리라인을 강조합니다.
2. [디자인/비주얼]: 고해상도 제품 톤보정, 정보 위계(Hierarchy), 직관적인 인포그래픽, 모바일(390px) 스크롤 가독성을 전문적으로 설명합니다.
3. 성과 지표(숫자)는 허위로 지어내지 말고 디자인/기획의 전문성에 집중합니다.
4. 반드시 요청된 JSON 형식으로만 응답하세요.`;

      userPrompt = `
[상세페이지 프로젝트 정보]
- 상품/프로젝트명: ${title || '이커머스 상세페이지'}
- 카테고리: 상세페이지 LP (${productCategory || '상품 디자인'})
- 브랜드/클라이언트: ${client || '브랜드사'}
- 담당 역할: ${role || '상세페이지 기획 & 비주얼 디자인'}
- 작업자의 기획/디자인 메모: "${roughNotes || title || '전환율 높은 상세페이지 올인원 디자인'}"
- 요청 대상: ${targetField || 'all (description, fullStory, highlights)'}

응답 형식 (JSON):
{
  "description": "이커머스 상세페이지용 1~2문장 요약 설명 (120자 내외, 브랜드/타깃/비주얼 강조)",
  "fullStory": "[기획 의도 및 타깃 분석], [비주얼 및 디자인 전략], [모바일 가독성 및 전환율 최적화]를 포함한 전문적인 작업 상세 스토리 (단락 구분 포함)",
  "highlights": ["상세페이지 핵심 포인트 1 (인트로/히어로/카피)", "상세페이지 핵심 포인트 2 (인포그래픽/USP)", "상세페이지 핵심 포인트 3 (모바일최적화/CTA)"]
}
`;
    } else {
      // Video Editing Copywriter (Longform / Shorts)
      systemPrompt = `당신은 영상 편집 및 유튜브/숏폼 전문 크리에이티브 디렉터입니다.
사용자가 입력한 영상 제목, 채널명, 카테고리(${category}), 대략적인 작업 메모를 바탕으로
포트폴리오에 어울리는 프로페셔널하고 매력적인 소개 문구를 작성해주세요.

[영상 편집 작성 원칙]
1. 컷 호흡 조절, 타이트한 컷편집, 가독성 높은 맞춤 자막 바, 모션 그래픽, 오디오 마스터링 및 SFX 배치를 전문적인 영상 용어로 기술합니다.
2. 숏폼의 경우 초반 3초 훅킹(Hooking)과 9:16 모바일 최적화를 부각합니다.
3. 성과 지표는 임의로 지어내지 않습니다.
4. 반드시 요청된 JSON 형식으로만 응답하세요.`;

      userPrompt = `
[영상 편집 프로젝트 정보]
- 영상 제목: ${title || '영상 편집 프로젝트'}
- 카테고리: ${category}
- 유튜브 채널/클라이언트: ${client || '미입력'}
- 담당 역할: ${role || '영상 컷편집 & 자막/사운드 디자인'}
- 작업자의 편집 메모: "${roughNotes || title || '전문적인 컷편집 및 자막 디자인'}"
- 요청 대상: ${targetField || 'all (description, fullStory, highlights)'}

응답 형식 (JSON):
{
  "description": "카드용 1~2문장 요약 설명 (120자 내외)",
  "fullStory": "상세 모달에 들어갈 작업 배경, 기획 의도 및 편집/사운드 전략 (줄바꿈 포함 3~4단락)",
  "highlights": ["영상 핵심 포인트 1", "영상 핵심 포인트 2", "영상 핵심 포인트 3"]
}
`;
    }

    const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite'];
    let generatedData = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        if (response.text) {
          try {
            generatedData = JSON.parse(response.text);
            break;
          } catch {
            // json parse retry
          }
        }
      } catch (err: any) {
        console.warn(`AI Suggest error with ${model}:`, err?.message || err);
      }
    }

    if (!generatedData) {
      generatedData = generateFallback();
    }

    return res.json({ result: generatedData });
  } catch (error: any) {
    console.error('AI Suggest API Fatal Error:', error);
    return res.status(500).json({ error: 'AI 문구 생성 중 오류가 발생했습니다.' });
  }
});

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language: reqLang } = req.body;
    const language: 'ko' | 'en' | 'ja' = (reqLang === 'en' || reqLang === 'ja') ? reqLang : 'ko';

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMsg = messages[messages.length - 1]?.text || '';
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ reply: generateContextualReply(lastUserMsg, language) });
    }

    // Prepare contents for Gemini
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const candidateModels = [
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
    ];

    let reply = '';
    const systemInstruction = getSystemInstruction(language);

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.5,
          },
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} unavailable (${err?.status || err?.message}), testing fallback...`);
      }
    }

    if (!reply) {
      reply = generateContextualReply(lastUserMsg, language);
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    const lastUserMsg = req.body?.messages?.[req.body?.messages?.length - 1]?.text || '';
    const reqLang = req.body?.language;
    const language: 'ko' | 'en' | 'ja' = (reqLang === 'en' || reqLang === 'ja') ? reqLang : 'ko';
    return res.json({
      reply: generateContextualReply(lastUserMsg, language),
    });
  }
});

// Vite Middleware for Dev, Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
