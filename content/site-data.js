// content/site-data.js
// =====================================================================
// ALL PAGE TEXT lives here. Edit the words between the quotes and save.
//
// Small formatting you can use inside any text:
//   **bold words**                 -> bold
//   [label](task-2/#demo)         -> a link (site pages and #anchors only; no leading "/")
//   Arabic text is detected automatically and shown right-to-left in Almarai.
//
// Status values for the "Required vs Covered" rows:
//   'covered'  -> Covered            (solid pill)
//   'sample'   -> Covered · sample   (striped pill)
//   'partial'  -> Partial            (outlined pill)
//   'not'      -> Not included       (dashed pill)
//   Any row that is not 'covered' should have a `why` line.
//
// Sample badge for a whole task: set isSample: true and write sampleReason.
// File keys (t1_content, t4_guide, ...) refer to entries in content/files.js.
// =====================================================================
window.SITE = {

  // ===== META (every page) =====
  meta: {
    owner: 'Muhammed Zaghloul',
    year: '2026',
    notice: 'Assessment submission · Not for commercial use · © 2026 Muhammed Zaghloul. All rights reserved.',
    footer: [
      '© 2026 Muhammed Zaghloul. All rights reserved.',
      'Prepared solely as an assignment submission for the ASAQ L&D Specialist assessment. Not for commercial use, redistribution or reuse without written permission.',
      'ASAQ and its product names are referenced only as assessment context. No affiliation or endorsement is implied. No ASAQ logo or brand assets are used.'
    ],
    sampleBadge: 'Sample · for demonstration purposes only',
    brandLine: 'ASAQ final delivery'
  },

  // ===== LANDING PAGE =====
  landing: {
    eyebrow: 'Final practical assessment · L&D Specialist · Abdul Samad Al Qurashi (ASAQ)',
    title: 'From Notes to the Right Recommendation',
    sub: 'A fragrance product-knowledge and consultative-selling programme for sales associates, in six connected tasks.',
    author: 'Prepared by Muhammed Zaghloul',
    purposeTitle: 'Purpose',
    purpose: [
      'One place to review all six deliverables, live or in a viewer.',
      'Each task page shows what the brief required and what was delivered.',
      'All tasks share one story: Ibrahim, a new associate at a fictional remote branch, with the learner as his mentor.'
    ],
    videoCaption: 'A short overview of the submission.',
    reviewTitle: 'How to review',
    review: ['Open a task', 'Try the demo and open the files', 'Check “Required vs Covered”', 'Read what I did'],
    reviewNote: 'About 45–60 minutes. Each task stands alone.',
    tasksTitle: 'The six tasks',
    connectTitle: 'How the tasks connect',
    connectText: 'Task 1 designs the programme. Task 2 builds its first lessons, with the Task 6 videos and Task 3 questions 1–5. Task 5 is the LMS that would host it; each Task 4 game turn is recorded there as an xAPI statement.',
    assumptionsTitle: 'Assumptions'
  },

  // ===== GLOBAL ASSUMPTIONS (landing page, collapsible) =====
  assumptions: [
    'Ibrahim, the Sharurah branch and all customers are fictional.',
    'Product names and notes come from ASAQ’s online store (November 2026); check them against internal training before rollout.',
    'Game prices, footfall and targets are illustrative.',
    'LMS names, scores and dates are dummy data.',
    'Associates already know store procedures and the POS.',
    'Deliverables are in Arabic; this review website is in English.'
  ],

  // ===== TASKS =====
  tasks: [

    // ===== TASK 1 =====
    {
      n: 1,
      title: 'Instructional design',
      cardSummary: 'Needs analysis, 3 objectives, course design, storyboards and the full content.',
      summary: 'The design of the whole programme: audience, objectives, lesson design and content.',
      output: '2 PDF documents · 216 pages',
      types: ['pdf'],
      isSample: false,
      sampleReason: '',
      requirements: [
        { req: 'A 20–30 min fragrance microlearning module',
          delivered: 'Whole programme designed (~100 min); ~20 min built in Task 2.',
          where: 'Part 2 PDF, pp. 16–18', status: 'covered' },
        { req: 'Learner and performance-needs analysis',
          delivered: 'Audience analysis; current vs required behaviour; causes.',
          where: 'Part 2 PDF, pp. 5–9', status: 'covered' },
        { req: '3 measurable learning objectives',
          delivered: 'LO1–LO3, Bloom-aligned, each with a criterion.',
          where: 'Part 2 PDF, p. 10', status: 'covered' },
        { req: 'Storyboard or ID document',
          delivered: 'Storyboards for videos, lessons, activities and quiz.',
          where: 'Part 2 PDF, pp. 20–87', status: 'covered' },
        { req: 'Actual content with a realistic customer scenario',
          delivered: 'Full content in Arabic and English; «قوي مرة!» scenario.',
          where: 'Part 1 PDF; Part 2 PDF, pp. 62–70', status: 'covered' },
        { req: 'How activities support the objectives',
          delivered: 'Alignment table: objective, content, activity, assessment.',
          where: 'Part 2 PDF, pp. 19, 99', status: 'covered' }
      ],
      did: [
        'One story carries everything: Ibrahim, a new associate at a fictional branch in Sharurah (شرورة), with the learner as his mentor.',
        'Interactions follow Allen’s **CCAF** model, with branching decisions and feedback that depends on the choice.',
        'Evaluation follows Kirkpatrick’s four levels, from a reaction survey to branch KPIs 8 weeks before vs after.'
      ],
      highlights: [
        { title: 'Objectives', items: [
          '**LO1 · Remember:** identify the three layers, common notes, main families and product forms. Criterion: at least 8 of 10 classified correctly.',
          '**LO2 · Understand:** explain how a perfume develops on the skin, and how concentration and ingredients shape character, longevity and value. Criterion: at least 4 of 5 customer questions.',
          '**LO3 · Apply:** use discovery questions to recommend, then one linked cross-sell or upgrade. Criterion: best recommendation in an interactive scenario.' ] },
        { title: 'CCAF strategy', items: [
          '**Context:** the remote Sharurah branch and real customer questions.',
          '**Challenge:** every activity opens with a request from Ibrahim.',
          '**Activity:** hotspots, flip cards, drag & drop, branching dialogue.',
          '**Feedback:** the customer’s reaction first, then the reason.' ] },
        { title: 'Course map', items: [
          'Lesson 0 · Welcome: meet Ibrahim.',
          'Unit 1 · Understanding perfume (Lessons 1.1–1.5).',
          'Unit 2 · Arabian perfumery (2.1–2.5).',
          'Unit 3 · Consultative selling (3.1–3.4), then a 10-question final quiz.',
          'About 100 min in total; about 20 min built in Task 2.' ] },
        { title: 'Alignment', items: [
          '**LO1:** hotspots, flip cards, pyramid drag & drop, fragrance wheel → Q1, Q2, Q6.',
          '**LO2:** explainer video, “solve the complaint”, layering → Q3, Q4, Q7, Q8.',
          '**LO3:** customer interaction, discovery questions, branching wedding scenario → Q5, Q9, Q10 and supervisor observation.' ] }
      ],
      demo: { kind: 'pdfs', hint: 'Both documents open below. Scroll inside a viewer to turn pages.' },
      files: ['t1_content', 't1_design'],
      inlineFirst: false,
      notes: [
        'Part 2 §3.9 plans a central data sheet by employee number. The built module (Task 2) logs to a Google Sheet by name instead.'
      ]
    },

    // ===== TASK 2 =====
    {
      n: 2,
      title: 'Interactive prototype',
      titleAr: 'رحلة إبراهيم: الهرم العطري',
      titleGloss: 'Ibrahim’s Journey: The Fragrance Pyramid',
      cardSummary: 'A working HTML5 module packaged as SCORM 1.2: hotspots, flip cards, drag & drop, a branching scenario and a graded quiz.',
      summary: 'The first lessons of the programme, built as a working module.',
      output: 'Live HTML5 module · SCORM 1.2 · ~20 min',
      types: ['live', 'video'],
      isSample: true,
      sampleReason: 'Production sample: Lesson 0, Lessons 1.1–1.2 and quiz Q1–5 (about 20 minutes). The rest is designed in Task 1.',
      requirements: [
        { req: 'A functional prototype',
          delivered: 'Working module below; SCORM 1.2 package included.',
          where: 'Demonstration', status: 'sample',
          why: 'Covers Lessons 0, 1.1–1.2 and Q1–5; the rest is designed in Task 1.' },
        { req: 'At least 3 interaction types',
          delivered: 'Hotspots, flip cards, drag & drop, branching scenario, quiz.',
          where: 'Lessons 1.1–1.2', status: 'covered' },
        { req: 'Immediate feedback',
          delivered: 'Reaction and reason after every action or decision.',
          where: 'Every activity', status: 'covered' },
        { req: 'A completion and progress mechanism',
          delivered: 'Progress bar, resume, scores, SCORM status; quiz pass at 4/5.',
          where: 'Demo and tracking panel', status: 'covered' },
        { req: 'The tool used',
          delivered: 'HTML5 web module, SCORM 1.2, Google Sheets tracking.',
          where: 'Demonstration', status: 'covered' }
      ],
      did: [
        'The learner is Ibrahim’s mentor; each activity opens with a message from him.',
        'Drag & drop maps to LO1, the timing activity and customer interaction to LO2, and its decisions to LO3.',
        'Mobile-first and right-to-left. Every interaction is logged as a row in a Google Sheet.'
      ],
      demo: {
        kind: 'module',
        hint: 'Use “Try as guest” («تجربة كضيف») on the sign-in screen. Lesson 1.2 has the video, drag & drop and customer interaction.',
        src: 'apps/task2-module/index.html',
        title: 'Interactive module',
        trackingTitle: 'Session tracking',
        trackingNote: 'Live from the module. Events also go to a Google Sheet.'
      },
      files: [],
      notes: [
        'Progress is saved in this browser.',
        'Sessions are logged to the owner’s Google Sheet (name, screens, scores). “Try as guest” records no name.'
      ]
    },

    // ===== TASK 3 =====
    {
      n: 3,
      title: 'Assessment (10 questions)',
      cardSummary: '10 mixed questions with 3 scenarios, answer key, pass mark and gap analysis.',
      summary: 'Ten graded questions with an answer key, a pass mark and a gap analysis.',
      output: 'Question bank · 10 questions (Part 2 PDF)',
      types: ['pdf', 'live'],
      isSample: false,
      sampleReason: '',
      requirements: [
        { req: '10 questions of mixed types',
          delivered: 'Choice, matching, true/false, ordering, multiple response, scenarios.',
          where: 'Gallery below; Part 2 PDF, pp. 91–97', status: 'covered' },
        { req: 'An answer key and explanation for each',
          delivered: 'All 10 marked and explained.',
          where: 'Part 2 PDF, pp. 91–97', status: 'covered' },
        { req: 'At least 2 scenario-based questions',
          delivered: '3 scenarios: Q5, Q9, Q10.',
          where: 'Gallery below', status: 'covered' },
        { req: 'A passing score with its rationale',
          delivered: '80% plus one scenario correct; rationale given.',
          where: 'Part 2 PDF, p. 98', status: 'covered' },
        { req: 'How results identify learning gaps',
          delivered: 'Each question maps to an objective and a lesson.',
          where: 'Part 2 PDF, p. 98', status: 'covered' },
        { req: 'A fictional product line or stated assumptions',
          delivered: 'Assumptions stated; branch and customers fictional.',
          where: 'Part 2 PDF, p. 4', status: 'covered' }
      ],
      did: [
        'Q1–5 follow the explainer and run in the Task 2 module; Q6–10 cover the rest.',
        'Each question is tagged with its objective and content section, so results read as gaps.',
        'Scenarios use real customer words («قوي مرة»، «أبي عطر»، «غالي»); wrong options are real associate mistakes.'
      ],
      demo: {
        kind: 'gallery',
        hint: 'Read-only view of the 10 questions. Answer key: see the document below.',
        liveTitle: 'Try them live',
        live: [
          { label: 'Q1–5 in the Task 2 module', href: 'task-2/#demo', text: 'End of Lesson 1.2.' },
          { label: '5-question quiz in the Task 5 LMS', href: 'task-5/#demo', text: 'Final quiz of “Fragrance Fundamentals” (Q1, 3, 5, 7, 9).' }
        ]
      },
      questions: [
        { n: 1, type: 'Multiple choice', lo: 'LO1', section: '1.3', inModule: true,
          stem: 'رشّ العميل العطر للتو. أي طبقة يشمها أولاً؟',
          options: ['القاعدة', 'القلب', 'الافتتاحية', 'الأثر الأخير'],
          gloss: 'A customer has just sprayed the perfume. Which layer do they smell first?' },
        { n: 2, type: 'Matching', lo: 'LO1', section: '1.4', inModule: true,
          stem: 'طابق كل نوتة من دهن عود ميان بطبقتها.',
          options: ['الهيل', 'الصندل', 'العنبر', 'التونكا', '→ الافتتاحية · القلب · القاعدة'],
          gloss: 'Match each note of Dehn Oud Miyan to its layer (cardamom, sandalwood, amber, tonka → top, heart, base).' },
        { n: 3, type: 'True / false', lo: 'LO2', section: '1.3', inModule: true,
          stem: '«نوتات القاعدة لا تظهر إلا بعد أن تختفي الافتتاحية تماماً.»',
          options: ['صح', 'خطأ'],
          gloss: '“Base notes only appear once the opening has completely gone.” True or false?' },
        { n: 4, type: 'Ordering', lo: 'LO2', section: '1.4', inModule: true,
          stem: 'رتّب ما سيشمه العميل خلال يومه مع دهن عود ميان.',
          options: ['العنبر والتونكا', 'خشب العود والهيل', 'الصندل والفانيليا'],
          gloss: 'Put in order what the customer will smell during the day with Dehn Oud Miyan (shown here in random order).' },
        { n: 5, type: 'Scenario', lo: 'LO2, LO3', section: '1.3, 3.7', inModule: true,
          stem: 'عميل رشّ دهن عود ميان وقال فوراً: «قوي مرة، ما يناسبني.» ما أفضل رد؟',
          options: ['«طيب، جرّب هذا الحمضي الخفيف بدلاً منه.»', '«أول دقائق دايماً أقوى شي، خلنا نشمه بعد ربع ساعة لما يطلع القلب.»', '«لا، هو مو قوي.»', '«هذا الأكثر مبيعاً عندنا.»'],
          gloss: 'A customer sprays Dehn Oud Miyan and says at once: “Too strong, not for me.” What is the best reply?' },
        { n: 6, type: 'Multiple choice', lo: 'LO1', section: '1.5–1.6', inModule: false,
          stem: 'قال العميل: «أحب الريحة المنعشة النظيفة للدوام.» إلى أي عائلة تشير كلماته غالباً؟',
          options: ['العنبرية (الشرقية)', 'الحمضية / المنعشة', 'الجلدية', 'الحلوة (الغورماند)'],
          gloss: 'The customer says: “I like a fresh, clean scent for work.” Which fragrance family do the words most likely point to?' },
        { n: 7, type: 'Multiple response', lo: 'LO2', section: '1.9–1.10', inModule: false,
          stem: 'أي نصيحتين تساعدان العطر على الثبات أطول؟',
          options: ['ترطيب البشرة قبل وضع العطر', 'فرك المعصمين بعد الرش', 'اختيار تركيز أعلى أو قاعدة أغنى', 'حفظ الزجاجة في السيارة'],
          gloss: 'Which two tips help a perfume last longer on the skin?' },
        { n: 8, type: 'Multiple choice', lo: 'LO2', section: '2.6', inModule: false,
          stem: 'ما الفرق بين «العنبر» في العطور و«العنبر الحوتي»؟',
          options: ['هما المادة نفسها بأسماء مختلفة', 'العنبر أكورد دافئ من اللادن والجاوي والفانيليا، والعنبر الحوتي مادة نادرة من حوت العنبر', 'العنبر مادة حيوانية، والعنبر الحوتي نباتي', 'العنبر الحوتي هو الكهرمان الأحفوري'],
          gloss: 'What is the difference between “amber” in perfumery and ambergris?' },
        { n: 9, type: 'Scenario', lo: 'LO3', section: '3.2', inModule: false,
          stem: 'دخل عميل وقال: «أبي عطر.» ما أفضل سؤال تبدأ به؟',
          options: ['«كم ميزانيتك؟»', '«هذا الأكثر مبيعاً، تبي تجربه؟»', '«وش العطر اللي تستخدمه الحين وتحبه؟»', '«تحب العود؟»'],
          gloss: 'A customer walks in and says: “I want a perfume.” What is the best question to start with?' },
        { n: 10, type: 'Scenario', lo: 'LO3', section: '3.7', inModule: false,
          stem: 'أعجب العميل دهن عود ميان، ثم قال: «غالي.» ما أفضل رد؟',
          options: ['«ما عندنا خصومات.»', '«أفهمك. قاعدته العنبر والتونكا تثبت لآخر السهرة، فرشة أو رشتين تكفي. وإذا تحب أوريك خياراً بحجم أصغر.»', '«كل عطورنا غالية.»', '«هذا سعر ممتاز مقارنة بغيرنا.»'],
          gloss: 'The customer likes Dehn Oud Miyan, then says: “Expensive.” What is the best reply?' }
      ],
      files: ['t1_design'],
      fileNotes: { t1_design: 'Quiz = Part 4, pp. 88–100: Q1–5 pp. 91–93, Q6–10 pp. 94–97, pass mark and gaps p. 98.' },
      inlineFirst: true,
      notes: [
        'Q1–5 are interactive in Task 2. The full bank with key and rationale is in the Task 1 Part 2 PDF.',
        'The Task 5 LMS runs Q1, Q3, Q5, Q7 and Q9 as its final quiz (pass 80%, 3 attempts).',
        'The Task 4 guide reuses Q1, Q3, Q6, Q9 and Q10 as a pre/post check.'
      ]
    },

    // ===== TASK 4 =====
    {
      n: 4,
      title: 'Learning game',
      titleAr: 'حصة السوق: تحدي المنطقة',
      titleGloss: 'Market Share: Region Challenge',
      cardSummary: 'A team strategy game, «Market Share: Region Challenge»: every selling decision changes the basket.',
      summary: 'A team strategy game for the showroom.',
      output: 'Live facilitator game + 2 PDFs',
      types: ['live', 'pdf'],
      isSample: true,
      sampleReason: 'The printable kit is a 2-page sample with one example of each element. The full kit is available on request.',
      requirements: [
        { req: 'Objective and learning outcomes',
          delivered: 'Practise the selling cycle; mapped to LO1–LO3.',
          where: 'Guide §1, p. 2', status: 'covered' },
        { req: 'Rules, setup, materials, duration',
          delivered: '5-min setup; 6 rounds in 35–45 min, then a 10-min debrief.',
          where: 'Guide §2–5, pp. 2–4', status: 'covered' },
        { req: 'A playable sample (board/cards)',
          delivered: 'Full digital game; printable kit as sample.',
          where: 'Demonstration', status: 'sample',
          why: 'The digital game is complete; the printable kit is a 2-page sample.' },
        { req: 'Scoring and progression',
          delivered: 'Sale = basket × footfall; market share plus KPI bonuses.',
          where: 'Guide §6, p. 5', status: 'covered' },
        { req: 'A facilitator guide',
          delivered: '6-page guide in Arabic.',
          where: 'Deliverables', status: 'covered' },
        { req: 'How to measure improved learning',
          delivered: 'Pre/post check, in-game accuracy, xAPI, supervisor checklist, KPIs.',
          where: 'Guide §10, p. 6', status: 'covered' },
        { req: 'A real learning mechanic, not only points',
          delivered: 'Each decision changes the basket; weak ones lose sales.',
          where: 'Guide §1, §5; demo', status: 'covered' }
      ],
      did: [
        'Teams compete for market share across 9 Jeddah districts over 6 rounds.',
        'Each turn has 5 decisions: discover, recommend, upsell, add-on, handle the objection. Sale = basket × footfall.',
        'Results show accuracy per skill and the weakest one, to start the debrief.'
      ],
      demo: {
        kind: 'game',
        hint: 'Set up 2–4 teams and play a round.',
        extra: 'Each turn played here is also written to the Task 5 LMS as an xAPI statement (open the LMS once, then Admin › Reports).',
        src: 'apps/task4-game/index.html',
        title: 'Market Share: Region Challenge (game)',
        langButton: 'Switch to Arabic',
        langButtonBack: 'Switch to English'
      },
      files: ['t4_guide', 't4_kit'],
      inlineFirst: true,
      notes: [
        'Prices and footfall are illustrative; district names are only a board.',
        'The full printable kit is available on request.'
      ]
    },

    // ===== TASK 5 =====
    {
      n: 5,
      title: 'Training website (LMS prototype)',
      cardSummary: 'The “Sales Academy” learning platform: three roles, eight content types, tracking, reports and an Arabic interface.',
      summary: 'The “Sales Academy” learning platform: a working prototype with wireframe and documentation.',
      output: 'Live LMS prototype + wireframe + PDF',
      types: ['live', 'pdf'],
      isSample: true,
      sampleReason: 'Working prototype with dummy data and basic features only. Data is kept in the browser.',
      requirements: [
        { req: 'A learner journey or wireframe',
          delivered: 'Wireframe plus live learner journey.',
          where: 'Under the demo', status: 'covered' },
        { req: 'Content structure and completion tracking',
          delivered: '8 content types; completion drives badges and certificates.',
          where: 'Demo; docs §3, p. 3', status: 'covered' },
        { req: 'One small working code prototype',
          delivered: 'Full LMS: three roles, Arabic RTL, dark mode.',
          where: 'Demonstration', status: 'covered' },
        { req: 'How scores, completion and feedback are captured',
          delivered: 'Browser storage, reports with export, SCORM and xAPI.',
          where: 'Admin › Reports; docs §7, p. 10', status: 'covered' },
        { req: 'Accessibility, mobile and privacy',
          delivered: 'WCAG 2.2 AA target, mobile-first, privacy controls.',
          where: 'Docs §9, p. 10', status: 'covered' },
        { req: 'Implemented / Simulated / Recommended labels',
          delivered: 'Shown on every feature in the LMS and docs.',
          where: 'Legend below; docs §10', status: 'covered' }
      ],
      did: [
        'Reuses Moodle Cloud’s features and terms; every feature maps to a Moodle reference.',
        'Three roles: learners complete training, managers assign and follow, admins build and report.',
        'The main course, “Fragrance Fundamentals”, uses this programme’s content and a 5-question quiz from Task 3.'
      ],
      legend: [
        { status: 'impl', label: 'Implemented', text: 'Works now in the prototype.', items: ['Dashboard, timeline, catalogue and self-enrolment', 'Activity and course completion', 'Video, audio, image, HTML page and SCORM 1.2 runtime', 'Quizzes, surveys, badges and certificates', 'Learning history, profile, privacy (data export and deletion request)', 'Manager team view; admin courses, users and reports', 'English and Arabic (RTL); light and dark modes'] },
        { status: 'sim', label: 'Simulated', text: 'Behaves realistically but has no real back end.', items: ['xAPI statements to an in-browser LRS', 'File storage for uploads (kept in the browser session)', 'Email notifications'] },
        { status: 'rec', label: 'Recommended', text: 'Proposed for production.', items: ['SCORM / xAPI to the company LMS or an external LRS', 'Single sign-on with company accounts (OAuth 2 / SAML)', 'Manager dashboards that link learning to sales data; HR sync', 'Mobile app for offline learning and push notifications', 'A full screen-reader audit before launch'] }
      ],
      demo: {
        kind: 'lms',
        hint: 'Use a demo button on the login page, or one of these usernames (any password).',
        src: 'apps/task5-lms/index.html',
        title: 'Sales Academy LMS',
        accounts: [
          { role: 'Learner', user: 'faisal.al.harthi' },
          { role: 'Manager', user: 'khalid.al.subaie' },
          { role: 'Admin', user: 'reem.al.harbi' }
        ],
        wireTitle: 'Wireframe and learner journey',
        wireSrc: 'apps/task5-lms/wireframe.html'
      },
      files: ['t5_docs'],
      inlineFirst: true,
      notes: [
        'Defaults to English (the brief allows it); switches to Arabic with RTL.',
        'All users, scores and dates are dummy data.',
        'Printing is disabled on this website.'
      ]
    },

    // ===== TASK 6 =====
    {
      n: 6,
      title: 'Video',
      titleAr: 'الهرم العطري',
      titleGloss: 'The Fragrance Pyramid',
      cardSummary: 'An 87-second explainer, «الهرم العطري» (The Fragrance Pyramid), with a timed script and Arabic voice-over, plus a 28-second intro.',
      summary: 'An 87-second explainer on the fragrance pyramid, plus the intro that opens the module.',
      output: '2 MP4 videos · 87 s explainer + 28 s intro',
      types: ['video'],
      isSample: false,
      sampleReason: '',
      requirements: [
        { req: 'A 60–90 s video',
          delivered: '87-second explainer, measured from the final file.',
          where: 'Demonstration', status: 'covered' },
        { req: 'A script',
          delivered: 'Full timed script and storyboard.',
          where: 'Part 2 PDF, pp. 50–51', status: 'covered' },
        { req: 'A recorded voice-over',
          delivered: 'Calm male voice, Saudi-leaning Arabic.',
          where: 'Demonstration', status: 'covered' },
        { req: 'Visuals and captions',
          delivered: '2D object-only motion graphics; Arabic captions in Task 2.',
          where: 'Demo; Task 2', status: 'covered' }
      ],
      did: [
        'Structure: hook, problem, key terms, framework, worked example, result, close.',
        'Every fact the quiz tests is said on screen, including “smell it again in 15 minutes”.',
        'Object-only visuals, no actors. The close leads into the Task 2 drag & drop; the 28-second intro «رحلة إبراهيم» opens the module.'
      ],
      demo: {
        kind: 'videos',
        hint: 'Press play. Use the player’s button for full screen.',
        captionsNote: 'Arabic captions are in the module version (Task 2).',
        videos: [
          { key: 't6_explainer', poster: 'assets/img/posters/explainer-poster.jpg' },
          { key: 't6_intro', poster: 'assets/img/posters/intro-poster.jpg' }
        ]
      },
      // Script tables. Time and voice-over come from the final caption files (media/*.ar.vtt).
      script: [
        { title: 'Explainer · «الهرم العطري» (The Fragrance Pyramid) · 87 s', rows: [
          { seg: '2a hook', t: '0:00.8–0:03.6', vo: 'أول عميل لإبراهيم رش العطر…', en: 'Ibrahim’s first customer sprayed the perfume…', ost: 'رسالة: «العميل رش العطر وقال: ثقيل مرة! وراح»' },
          { seg: '2a hook', t: '0:03.6–0:07.1', vo: 'وقال: ثقيل مرة! ومشى.', en: '…said “Way too heavy!” and walked off.', ost: '«ثقيل مرة!»' },
          { seg: '2b problem', t: '0:08.9–0:13.1', vo: 'المشكلة مو في العطر. العميل حكم على أول دقيقة بس…', en: 'The problem isn’t the perfume. The customer judged only the first minute…', ost: 'دهن عود ميان' },
          { seg: '2b problem', t: '0:13.1–0:15.9', vo: 'لكن العطر يتغير على البشرة مع الوقت.', en: '…but a perfume changes on the skin over time.', ost: 'العطر يتغير مع الوقت' },
          { seg: '2c layers', t: '0:17.7–0:21.7', vo: 'كل عطر له ثلاث طبقات، تتبخر بسرعات مختلفة:', en: 'Every perfume has three layers that evaporate at different speeds:', ost: '' },
          { seg: '2c layers', t: '0:22.3–0:26.1', vo: 'الافتتاحية… والقلب… والقاعدة.', en: 'the opening… the heart… and the base.', ost: 'الافتتاحية Top · القلب Heart · القاعدة Base' },
          { seg: '2d overlap', t: '0:28.1–0:30.1', vo: 'والثلاث موجودة من البداية…', en: 'All three are there from the start…', ost: 'الثلاث موجودة من البداية' },
          { seg: '2d overlap', t: '0:30.1–0:33.2', vo: 'بس الافتتاحية أعلى صوت، وتغطي الباقي.', en: '…but the opening is the loudest and covers the rest.', ost: 'الافتتاحية أعلى صوت' },
          { seg: '2e–2f timing', t: '0:35.1–0:38.8', vo: 'الافتتاحية انطباع أول، وتختفي خلال دقايق.', en: 'The opening is the first impression and fades within minutes.', ost: '5–15 د' },
          { seg: '2e–2f timing', t: '0:39.5–0:42.4', vo: 'القلب هو شخصية العطر لساعات.', en: 'The heart is the perfume’s character, for hours.', ost: '15 د – 4 س' },
          { seg: '2e–2f timing', t: '0:43.2–0:46.5', vo: 'والقاعدة هي اللي تبقى معك لساعات طويلة…', en: 'And the base is what stays with you for many hours…', ost: 'ساعات' },
          { seg: '2e–2f timing', t: '0:46.5–0:48.3', vo: 'أحياناً لليوم الثاني.', en: '…sometimes until the next day.', ost: 'حتى اليوم التالي' },
          { seg: '2g Miyan', t: '0:50.4–0:52.6', vo: 'ومثلاً، خذ دهن عود ميان:', en: 'For example, take Dehn Oud Miyan:', ost: 'دهن عود ميان' },
          { seg: '2g Miyan', t: '0:53.1–0:58.8', vo: 'يفتتح بخشب العود والهيل… ثم يصير ناعم بالصندل والفانيليا…', en: 'it opens with oud wood and cardamom… then turns smooth with sandalwood and vanilla…', ost: 'عود · هيل · صندل · فانيليا' },
          { seg: '2g Miyan', t: '0:59.8–1:02.4', vo: 'ويستقر على عنبر وتونكا دافيين.', en: '…and settles on warm amber and tonka.', ost: 'عنبر · تونكا · عود وهيل ← صندل وفانيليا ← عنبر وتونكا' },
          { seg: '2h behaviour', t: '1:05.2–1:07.9', vo: 'لو قال العميل: ثقيل مرة…', en: 'If a customer says “Way too heavy”…', ost: '«ثقيل مرة!»' },
          { seg: '2h behaviour', t: '1:07.9–1:11.3', vo: 'قل له: أول دقايق دايماً أقوى شي…', en: '…tell them: the first minutes are always the strongest…', ost: 'لا تحكم من أول رشّة' },
          { seg: '2h behaviour', t: '1:11.3–1:13.0', vo: 'خلنا نشمه بعد ربع ساعة.', en: '…let’s smell it again in a quarter of an hour.', ost: '+15 د' },
          { seg: '2i close', t: '1:15.4–1:20.1', vo: 'الافتتاحية تجذب… والقلب يقنع… والقاعدة تبقى.', en: 'The opening attracts… the heart convinces… the base stays.', ost: 'الافتتاحية تجذب · القلب يقنع · القاعدة تبقى' },
          { seg: '2i close', t: '1:20.8–1:24.0', vo: 'الحين… ساعد إبراهيم يبني الهرم بنفسه.', en: 'Now… help Ibrahim build the pyramid himself.', ost: 'رحلة إبراهيم · ساعد إبراهيم الآن' }
        ] },
        { title: 'Intro · «رحلة إبراهيم» (Ibrahim’s Journey) · 28 s', rows: [
          { seg: '1a', t: '0:00.8–0:03.7', vo: 'في شرورة، على أطراف الربع الخالي…', en: 'In Sharurah, on the edge of the Empty Quarter…', ost: 'شرورة · فرع افتراضي' },
          { seg: '1b', t: '0:06.0–0:09.9', vo: 'بدأ إبراهيم أول أسبوع له في عبدالصمد القرشي.', en: 'Ibrahim began his first week at Abdul Samad Al Qurashi.', ost: 'إبراهيم · مستشار مبيعات جديد · الأسبوع الأول' },
          { seg: '1b', t: '0:09.9–0:15.5', vo: 'يحب العود من بيته، لكن الزبائن هنا يسألون أكثر من حبّه للعود.', en: 'He grew up loving oud at home, but customers here ask more than his love of oud can answer.', ost: '' },
          { seg: '1c', t: '0:16.8–0:19.5', vo: 'ما فيه مدرب قريب… بس فيه أنت.', en: 'There’s no trainer nearby… but there is you.', ost: 'رسائل: «وش الفرق بين الدهن والبخاخ؟» · «ليش ريحته تغيرت؟» · إبراهيم يحتاج مساعدتك' },
          { seg: '1d', t: '0:20.8–0:22.6', vo: 'أنت مرشده في هذي الرحلة.', en: 'You are his mentor on this journey.', ost: 'أنت · المرشد' },
          { seg: '1d', t: '0:22.6–0:25.6', vo: 'ساعده يفهم العطر… ويكسب عملاءه.', en: 'Help him understand perfume… and win his customers.', ost: 'اعرف ← افهم ← طبّق · ابدأ الرحلة' }
        ] }
      ],
      scriptTitle: 'Script',
      scriptLead: 'Time and voice-over come from the final caption files. The English gloss is a short translation.',
      scriptFileKey: 't6_script',
      scriptFileTitle: 'Read the script as a document',
      files: ['t6_explainer', 't6_intro'],
      inlineFirst: false,
      notes: [
        'Arabic captions are a separate track in the module (Task 2); the Drive player does not show them.',
        'The final cut says «ثقيل مرة!»; the module uses the related complaint «قوي مرة!».'
      ]
    }
  ]
};
