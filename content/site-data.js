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
      'This website and its contents were prepared solely as an assignment submission for the ASAQ L&D Specialist assessment. Not for commercial use, redistribution or reuse without written permission.',
      'ASAQ and its product names are referenced only as the context of the assessment. No affiliation or endorsement is implied. No ASAQ logo or brand assets are used.'
    ],
    sampleBadge: 'Sample · for demonstration purposes only',
    brandLine: 'ASAQ final delivery'
  },

  // ===== LANDING PAGE =====
  landing: {
    eyebrow: 'Final practical assessment · L&D Specialist · Abdul Samad Al Qurashi (ASAQ)',
    title: 'From Notes to the Right Recommendation',
    sub: 'A fragrance product-knowledge and consultative-selling programme for sales associates, delivered as six connected tasks.',
    author: 'Prepared by Muhammed Zaghloul',
    purposeTitle: 'Purpose of this website',
    purpose: [
      'It is the single place to review all six deliverables. Each one is shown live or in a viewer, beside the requirement it answers.',
      'Every task page lists what the brief required, what was delivered, and the reason for anything delivered as a sample.',
      'All six tasks are built on one module, «برنامج تهيئة مستشار المبيعات» (sales-associate onboarding programme), and one story: Ibrahim, a new associate at a fictional remote branch, with the learner acting as his mentor.'
    ],
    videoCaption: 'A short overview of the submission.',
    reviewTitle: 'How to review',
    review: ['Open a task card', 'Read “Required vs Covered”', 'Try the live demo', 'Open the files'],
    reviewNote: 'About 45–60 minutes for a full review. Each task stands alone.',
    tasksTitle: 'The six tasks',
    connectTitle: 'How the tasks connect',
    connectText: 'Task 1 designs the programme. Task 2 builds its first lessons as a working module, which plays the Task 6 video and asks quiz questions 1–5 from Task 3. Task 5 is the platform that would host it. The Task 4 game runs on the same website as the LMS, so each game turn is recorded as an xAPI statement in the LMS reports.',
    assumptionsTitle: 'Assumptions and notes'
  },

  // ===== GLOBAL ASSUMPTIONS (landing page, collapsible) =====
  assumptions: [
    'Ibrahim, the Sharurah branch («فرع افتراضي», a fictional branch) and all customers are fictional, for training purposes.',
    'Product names and notes are taken from ASAQ’s online store (November 2026) and must be checked against internal training before rollout.',
    'Game prices, footfall and targets are illustrative.',
    'LMS names, scores and dates are dummy data.',
    'Associates already know store procedures and the POS. Testers and blotters are available in store.',
    'The deliverables are in Arabic. This review website is in English for the assessors’ convenience.'
  ],

  // ===== TASKS =====
  tasks: [

    // ===== TASK 1 =====
    {
      n: 1,
      title: 'Instructional design',
      cardSummary: 'Needs analysis, three measurable objectives, the full course design and storyboards, and the complete learning content.',
      summary: 'The design of the whole programme: who it is for, what associates must be able to do, how each lesson works, and the learning content itself.',
      types: ['pdf'],
      isSample: false,
      sampleReason: '',
      facts: [
        { label: 'Format', value: '2 PDF documents (216 pp)' },
        { label: 'Language', value: 'Arabic; content also in English' },
        { label: 'Scope', value: '3 units · about 100 min designed' },
        { label: 'Linked tasks', value: 'Tasks 2, 3 and 6' }
      ],
      requirements: [
        { req: 'A 20–30 min microlearning module on fragrance product knowledge and consultative selling',
          delivered: 'The whole programme is designed: a welcome lesson and 3 units of short lessons, about 100 minutes in total, covering the full content document. The lessons marked for development (welcome, Lessons 1.1 and 1.2, quiz Q1–5; about 20 minutes) are built as the working module in Task 2.',
          where: 'Part 2 PDF §2.3 course map (pp. 16–18); [Task 2 demo](task-2/#demo)', status: 'covered' },
        { req: 'Learner and performance-needs analysis',
          delivered: 'Target audience and audience analysis (what we know → impact on the design); performance-needs analysis: current vs required behaviour, task by task, then causes and solution.',
          where: 'Part 1 PDF sections 2–3 (pp. 4–6); Part 2 PDF §1.2–1.5 (pp. 5–9)', status: 'covered' },
        { req: '3 measurable learning objectives',
          delivered: 'LO1–LO3, aligned to Bloom’s levels (Remember → Understand → Apply), each with a measurable criterion.',
          where: 'Part 2 PDF §1.6 (p. 10); Part 1 PDF section 1 (p. 3)', status: 'covered' },
        { req: 'Storyboard or ID document',
          delivered: 'ID document with storyboards for the intro video, the explainer video, Lesson 1.1, the drag & drop, the customer interaction and quiz Q1–5, plus the completion rules and the data recorded for every event.',
          where: 'Part 2 PDF, Part 3 (pp. 20–87)', status: 'covered' },
        { req: 'Actual content with at least 1 realistic customer scenario',
          delivered: 'The full content document in Arabic and English: perfume basics, Arabian perfumery and consultative selling. Scenarios: «قوي مرة!» ("too strong!") and the wedding-guest worked example, which becomes the branching scenario.',
          where: 'Part 1 PDF (worked example §3.8: pp. 60–62 Arabic, 110–112 English); Part 2 PDF §3.6 (pp. 62–70)', status: 'covered' },
        { req: 'How the activities support the objectives',
          delivered: 'An LO → content → activity → assessment alignment table, and a table that explains why each activity supports its objective.',
          where: 'Part 2 PDF §2.4 (p. 19) and §4.5 (p. 99)', status: 'covered' }
      ],
      did: [
        'One story and one tracked product carry the whole programme, so every task reinforces the same knowledge. Ibrahim (إبراهيم) is a new associate at a fictional branch in Sharurah (شرورة), on the edge of the Empty Quarter, far from any trainer. The learner is his mentor. No people appear in any visual.',
        'Interactions follow Michael Allen’s **CCAF** model (Context, Challenge, Activity, Feedback) and aim for the third level of interactivity: branching decisions, drag & drop and feedback that depends on the learner’s choice, because the goal is behaviour in front of a customer, not memorised facts.',
        'The content is written in Arabic for associates in Saudi showrooms, with English product terms. Part 1 also carries the full content in English.',
        'Bloom’s levels stay consistent from the objectives through the activities to the assessment: Part 1 of the content builds knowledge, Parts 1–2 deepen understanding, and Part 3 applies it with customers.',
        'Evaluation follows Kirkpatrick’s four levels: a 3-question reaction survey; quiz and interaction scores; a supervisor observation checklist at 2 and 6 weeks; and UPT, ATV, add-on rate and time-to-competence, 8 weeks before vs after.',
        'The tracked product is «دهن عود ميان» (Dehn Oud Miyan, 80 ml spray). Its notes are as listed on ASAQ’s online store (November 2026): top oud wood, Brazilian rosewood and cardamom; heart sandalwood, vanilla and vetiver; base amber and tonka. They must be checked against internal training before launch.'
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
      demo: { kind: 'pdfs', hint: 'Both documents open below. Scroll inside a viewer to turn the pages; use the viewer’s own zoom for detail.' },
      files: ['t1_content', 't1_design'],
      inlineFirst: false,
      notes: [
        'Ibrahim, the Sharurah branch and every customer are fictional, for training purposes.',
        'Part 2 §3.9 plans the data sheet as a central spreadsheet keyed by employee number. The built module (Task 2) sends its events to a Google Sheet and, for this demonstration, asks for a name instead.'
      ]
    },

    // ===== TASK 2 =====
    {
      n: 2,
      title: 'Interactive prototype',
      titleAr: 'رحلة إبراهيم: الهرم العطري',
      titleGloss: 'Ibrahim’s Journey: The Fragrance Pyramid',
      cardSummary: 'A working HTML5 module packaged as SCORM 1.2: hotspots, flip cards, drag & drop, a branching customer interaction and a graded quiz, all tracked.',
      summary: 'The first lessons of the programme, built as a working module: «رحلة إبراهيم: الهرم العطري» (Ibrahim’s Journey: The Fragrance Pyramid).',
      types: ['live', 'video'],
      isSample: true,
      sampleReason: 'This is the production sample of the designed course. It covers Lesson 0 (welcome) and Lessons 1.1–1.2, plus quiz questions 1–5. The remaining lessons are fully designed in the Task 1 document and would be built the same way.',
      facts: [
        { label: 'Format', value: 'HTML5 web module · SCORM 1.2' },
        { label: 'Language', value: 'Arabic (right-to-left)' },
        { label: 'Duration', value: 'About 20 minutes' },
        { label: 'Linked tasks', value: 'Tasks 1, 3 and 6' }
      ],
      requirements: [
        { req: 'A functional prototype',
          delivered: 'A working module, embedded below, which also runs in any SCORM 1.2 LMS (manifest included, mastery score 80).',
          where: '[Demonstration](#demo)', status: 'sample',
          why: 'Production sample of the designed course: Lesson 0, Lessons 1.1–1.2 and quiz Q1–5. The remaining lessons are fully designed in Task 1 and would be built the same way.' },
        { req: 'At least 3 interaction types',
          delivered: 'Hotspots on the bottle; two sets of flip cards (oil or spray, natural or synthetic); process steps (from essence to bottle); choose-the-reply message; drag & drop of notes to layers; drag & drop of layer timing; a branching customer interaction with 3 decisions and 3 endings; and a graded 5-question quiz (multiple choice, matching, true/false, ordering, scenario).',
          where: 'Lessons 1.1 and 1.2 in the [demo](#demo)', status: 'covered' },
        { req: 'Immediate feedback',
          delivered: 'Per action and per decision, with explanations: the customer’s reaction first, then the reason. Wrong drops bounce back with a short hint.',
          where: 'Every activity in the [demo](#demo)', status: 'covered' },
        { req: 'A completion and progress mechanism',
          delivered: 'Progress bar, resume from the last screen, scores and a results screen. Completion needs the Lesson 1.1 screens, the explainer watched, the drag & drop done, 24 of 30 in the customer interaction and 4 of 5 (80%) in the quiz. SCORM status, score and suspend data; events sent to a Google Sheet.',
          where: '[Demo](#demo) and the session tracking panel', status: 'covered' },
        { req: 'The tool used',
          delivered: 'An HTML5 web module packaged as SCORM 1.2, with Google Sheets tracking.',
          where: '[Demonstration](#demo)', status: 'covered' }
      ],
      did: [
        'The learner acts as Ibrahim’s mentor in real showroom questions: each activity opens with a message from Ibrahim.',
        'Each activity maps to an objective: the pyramid drag & drop to LO1, the timing activity and the customer interaction to LO2, and the interaction’s decisions to LO3.',
        'The explainer video (Task 6) opens Lesson 1.2, and the intro video opens the module. Both have Arabic captions and a transcript inside the module.',
        'Feedback shows the result before the judgement: the customer stays or heads for the door, then a short reason explains why.',
        'Built mobile-first and right-to-left. The drag & drop also works by tap or keyboard, and motion respects the reduced-motion setting.',
        'Every interaction is sent as one row to a Google Sheet (learner, session, screen, event, score, objective). If the connection drops, events wait on the device and are sent later.'
      ],
      demo: {
        kind: 'module',
        hint: 'Use “Try as guest” («تجربة كضيف») on the sign-in screen. Lesson 1.2 contains the video, the drag & drop and the customer interaction.',
        src: 'apps/task2-module/index.html',
        title: 'Interactive module',
        trackingTitle: 'Session tracking',
        trackingNote: 'Live from the module on this page. Events are also sent to a Google Sheet.'
      },
      files: [],
      notes: [
        'The module saves progress in this browser, so you can leave and resume.',
        'Sessions on this website are recorded in the owner’s Google Sheet (the name you enter, screens, answers and scores). “Try as guest” records no name.'
      ]
    },

    // ===== TASK 3 =====
    {
      n: 3,
      title: 'Assessment (10 questions)',
      cardSummary: 'A 10-question bank with mixed types, three scenario questions, an answer key, a pass mark with its rationale and a gap analysis.',
      summary: 'Ten graded questions that cover the whole content, with an answer key, a pass mark and a way to read the results as learning gaps.',
      types: ['pdf', 'live'],
      isSample: false,
      sampleReason: '',
      facts: [
        { label: 'Format', value: 'Question bank (Part 2 PDF)' },
        { label: 'Questions', value: '10, including 3 scenarios' },
        { label: 'Pass mark', value: '80% + 1 scenario correct' },
        { label: 'Linked tasks', value: 'Tasks 1, 2, 4 and 5' }
      ],
      requirements: [
        { req: '10 questions of mixed types',
          delivered: 'Multiple choice (Q1, Q6, Q8), matching (Q2), true/false (Q3), ordering (Q4), multiple response (Q7), scenario-based (Q5, Q9, Q10).',
          where: 'Question gallery below; Part 2 PDF §4.2–4.3 (pp. 91–97)', status: 'covered' },
        { req: 'An answer key and an explanation for each',
          delivered: 'Included for all 10: the correct option is marked and explained.',
          where: 'Part 2 PDF §4.2–4.3 (pp. 91–97)', status: 'covered' },
        { req: 'At least 2 scenario-based questions',
          delivered: '3 (Q5, Q9, Q10), each built on the customer’s own words.',
          where: 'Question gallery below', status: 'covered' },
        { req: 'A passing score with its rationale',
          delivered: '80% (8 of 10), plus at least one of the scenario questions (5, 9, 10) correct. Rationale: it matches the pass level of the interactive customer scenario and suits a customer-facing role, allowing two mistakes without giving up the essentials.',
          where: 'Part 2 PDF §4.4 (p. 98)', status: 'covered' },
        { req: 'How the results identify learning gaps',
          delivered: 'Each question is mapped to an objective and a lesson, so a wrong answer points to the lesson to revisit. For a learner, two wrong answers on the same objective reopen the linked lesson. For a showroom, any question missed by 30% or more is re-taught with a game round or a short video.',
          where: 'Part 2 PDF §4.4 (p. 98)', status: 'covered' },
        { req: 'A fictional product line or stated assumptions',
          delivered: 'Real product details labelled “as listed on the online store”, to be checked against internal training; the branch, the associate and the customers are fictional.',
          where: 'Part 2 PDF §1.1 (p. 4) and §4.3', status: 'covered' }
      ],
      did: [
        'The bank covers the whole content document. Q1–5 follow the explainer video and are built into the Task 2 module; Q6–10 cover the rest of the content.',
        'Every question is tagged with its objective and the content section it tests, so the results read as gaps, not only as a score.',
        'Scenario questions use real customer words («قوي مرة»، «أبي عطر»، «غالي») and ask for the best reply, not a definition.',
        'Wrong options are the real mistakes associates make: switching product at once, asking about budget first, or defending the price.',
        'Gap actions: LO1 (Q1, Q2, Q6) → Lessons 1.2–1.3 and the drag & drop again; LO2 (Q3, Q4, Q7, Q8) → the explainer and Lessons 1.4 and 2.3; LO3 (Q5, Q9, Q10) → the customer interaction, Unit 3 and supervisor follow-up in the showroom.'
      ],
      demo: {
        kind: 'gallery',
        hint: 'A read-only view of the 10 questions. Answer key and explanations: see the document below.',
        liveTitle: 'Try the questions live',
        live: [
          { label: 'Q1–5 in the Task 2 module', href: 'task-2/#demo', text: 'The last part of Lesson 1.2, after the customer interaction.' },
          { label: '5-question quiz in the Task 5 LMS', href: 'task-5/#demo', text: 'Course “Fragrance Fundamentals” › Final quiz (Q1, Q3, Q5, Q7, Q9; bilingual).' }
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
      fileNotes: { t1_design: 'The quiz is Part 4 of this document, pp. 88–100: test plan pp. 89–90, Q1–5 pp. 91–93, Q6–10 pp. 94–97, pass mark and gap analysis p. 98.' },
      inlineFirst: true,
      notes: [
        'Questions 1–5 are interactive inside the Task 2 module. The full bank of 10, with the key, explanations and rationale, is in the Task 1 Part 2 document.',
        'The Task 5 LMS also runs a 5-question version of the bank (Q1, Q3, Q5, Q7 and Q9; English and Arabic) as the final quiz of the course “Fragrance Fundamentals”, with a pass grade of 80% and 3 attempts.',
        'The Task 4 facilitator guide reuses Q1, Q3, Q6, Q9 and Q10 as a pre/post check around the game.'
      ]
    },

    // ===== TASK 4 =====
    {
      n: 4,
      title: 'Learning game',
      titleAr: 'حصة السوق: تحدي المنطقة',
      titleGloss: 'Market Share: Region Challenge',
      cardSummary: 'A team strategy game, «Market Share: Region Challenge»: every selling decision changes the basket, and the basket decides who owns each district.',
      summary: 'A team strategy game for the showroom: «Market Share: Region Challenge» / «حصة السوق: تحدي المنطقة».',
      types: ['live', 'pdf'],
      isSample: true,
      sampleReason: 'The printable kit is a 2-page sample with one example of each element (board extract, one card per type, a price-list extract, a score sheet, part of the rubric). The full kit is available on request.',
      facts: [
        { label: 'Format', value: 'Live facilitator game + 2 PDFs' },
        { label: 'Players', value: '2–4 teams of 2–4' },
        { label: 'Duration', value: '35–45 min + 10 min debrief' },
        { label: 'Linked tasks', value: 'Tasks 1, 3 and 5' }
      ],
      requirements: [
        { req: 'Objective and learning outcomes',
          delivered: 'Goal: practise the full consultative-selling cycle under time pressure and competition. Outcomes are mapped to LO1–LO3 by game step: recommend (LO1), handle the objection (LO2), discover, upsell and add-on (LO3).',
          where: 'Facilitator guide §1 (p. 2)', status: 'covered' },
        { req: 'Rules, setup, materials, duration',
          delivered: 'A 5-minute setup; the order of each round (event → district → power-ups → customer card → 5 decisions → sale → claim); digital and paper materials; 35–45 min for 6 rounds with 3 teams, then a 10-minute debrief. The game itself shows the rules.',
          where: 'Facilitator guide §2–5 (pp. 2–4); the game’s rules screen', status: 'covered' },
        { req: 'A playable sample (board/cards)',
          delivered: 'A full digital facilitator game (9 districts, 12 customer cards, 6 products, 6 add-ons, 4 objections, 6 events, 3 power-ups) plus a printable sample.',
          where: '[Demonstration](#demo); printable kit', status: 'sample',
          why: 'The digital game is complete. The printable kit is a 2-page sample with one example of each element; the full kit is available on request.' },
        { req: 'Scoring and progression',
          delivered: 'Sale = basket × footfall. Claim a free district, or beat a rival’s best sale to take it. 10% of every sale becomes budget. Final score = market share % plus KPI bonuses.',
          where: 'Facilitator guide §6 (p. 5); the game’s results screen', status: 'covered' },
        { req: 'A facilitator guide',
          delivered: '6 pages, Arabic: objectives, setup, rules, scoring, facilitator tips, debrief, other formats, measurement and assumptions.',
          where: 'Facilitator guide (Deliverables)', status: 'covered' },
        { req: 'How to measure whether it improves learning',
          delivered: 'Pre/post check (5 questions from the bank), in-game skill accuracy across sessions, xAPI records in the LMS, a supervisor checklist at 2 and 6 weeks, and branch KPIs (UPT, ATV, add-on rate) vs control branches.',
          where: 'Facilitator guide §10 (p. 6)', status: 'covered' },
        { req: 'A real learning mechanic, not only points',
          delivered: 'Each selling decision changes the basket. A weak first question loses the customer (no sale), a wrong product earns only 40% of its price, a wrong upsell or a forced add-on lowers the basket, and a poor objection reply costs 30%.',
          where: 'Facilitator guide §1 and §5; play one turn in the [demo](#demo)', status: 'covered' }
      ],
      did: [
        'One room is one region: Jeddah, with 9 districts rated ★ to ★★★ and footfall of 8, 12 or 18 customers a day. The sales target is SAR 50,000 per team over 6 rounds.',
        'Teams compete for the largest market share through consultative selling. Each turn has 5 decisions: discover → recommend → upsell → one add-on → handle the objection. Each decision changes the basket.',
        'Sale = basket × footfall. The team claims a free district, or beats a rival’s best sale to take theirs.',
        'Strategy: 10% of every sale becomes budget for power-ups (Training = retry, Tester = redraw, Promotion = +20%). A market event changes each round: wedding, Ramadan, Eid, competitor, price-sensitive, tourist.',
        'KPI bonuses: +5 each for best add-on rate, best UPT and most districts. The winner has the highest market share % plus bonuses, so one lucky sale is not enough.',
        'The results show accuracy per skill and the weakest skill, with the lesson to review. The facilitator’s debrief starts from there.'
      ],
      demo: {
        kind: 'game',
        hint: 'Set up 2–4 teams and play a round; the facilitator projects this screen.',
        extra: 'The same game feeds the Task 5 LMS. Both run on this website, so each turn played here is also written to the LMS as an xAPI statement (open the LMS once, then sign in as admin › Reports › xAPI statements).',
        src: 'apps/task4-game/index.html',
        title: 'Market Share: Region Challenge (game)',
        langButton: 'Switch to Arabic',
        langButtonBack: 'Switch to English'
      },
      files: ['t4_guide', 't4_kit'],
      inlineFirst: true,
      notes: [
        'Prices and footfall figures are illustrative for the game, not real store data.',
        'District names come from Jeddah and are used only as a board; any city can replace them.',
        'The full printable kit (9-district board, 12 customer cards, 4 objections, 6 events, 3 power-ups, full answer key) is available on request.'
      ]
    },

    // ===== TASK 5 =====
    {
      n: 5,
      title: 'Training website (LMS prototype)',
      cardSummary: 'The “Sales Academy” learning platform: learner, manager and admin roles, eight content types, completion tracking, reports and an Arabic interface.',
      summary: 'The “Sales Academy” learning platform, inspired by Moodle Cloud: a working prototype with a wireframe and documentation.',
      types: ['live', 'pdf'],
      isSample: true,
      sampleReason: 'A working prototype with dummy data and placeholder media. Data is stored in the browser (a simulated back end). It implements only the basic features; extra features depend on business needs and the LMS budget.',
      facts: [
        { label: 'Format', value: 'Web prototype + wireframe + PDF' },
        { label: 'Language', value: 'English default; Arabic (RTL)' },
        { label: 'Roles', value: 'Learner, manager, admin' },
        { label: 'Linked tasks', value: 'Tasks 2, 3 and 4' }
      ],
      requirements: [
        { req: 'A learner journey or wireframe',
          delivered: 'Wireframe: sitemap by role, annotated screens for every role, and mobile, Arabic (RTL) and dark-mode notes. Plus the live journey: sign in → dashboard → course → player → quiz → certificate → history.',
          where: 'Wireframe (under the demo); [demo](#demo)', status: 'covered' },
        { req: 'Content structure and completion tracking',
          delivered: 'Courses, sections and activities across 8 content types (video with captions, SCORM 1.2, HTML page, audio, image, xAPI scenario, quiz, survey); completion per activity and per course, which triggers a badge, a certificate and a notification.',
          where: '[Demo](#demo): course “Fragrance Fundamentals”; documentation §3 (p. 3)', status: 'covered' },
        { req: '1 small working code prototype',
          delivered: 'The whole LMS (learner, manager and admin roles), English by default with an Arabic interface and RTL, in light and dark modes.',
          where: '[Demonstration](#demo)', status: 'covered' },
        { req: 'How quiz scores, completion and feedback are captured',
          delivered: 'In the browser (localStorage) and in reports, with CSV/JSON export; a SCORM 1.2 runtime; an in-browser xAPI LRS. The Task 2 module also sends events to a Google Sheet.',
          where: 'Admin › Reports in the [demo](#demo); documentation §7 (p. 10)', status: 'covered' },
        { req: 'Accessibility, mobile and privacy',
          delivered: 'In the documentation: WCAG 2.2 AA target, mobile-first, privacy controls (download my data, request deletion); alignment with Saudi Arabia’s PDPL recommended before launch.',
          where: 'Documentation §9 (p. 10)', status: 'covered' },
        { req: 'Labels: Implemented / Simulated / Recommended',
          delivered: 'Shown on every feature in the LMS (“Moodle references” page) and in the documentation.',
          where: 'LMS › Moodle references; documentation §10 (pp. 11–12); legend below', status: 'covered' }
      ],
      did: [
        'Most LMSs share the same structure, so the prototype reuses Moodle Cloud’s features and terms instead of inventing new ones. Every feature is mapped to its Moodle reference.',
        'Three roles: learners find and complete training; managers follow their team, assign courses with due dates and send reminders; administrators build courses, manage users and read reports.',
        'The main course, “Fragrance Fundamentals”, uses this programme’s content: the pyramid infographic, a SCORM lesson, an xAPI customer scenario and a 5-question final quiz from the Task 3 bank.',
        'A completion rule per type (watched 90%, viewed, SCORM passed, xAPI completed, quiz pass grade, survey submitted) drives badges, certificates and reports.',
        'Data is saved in the browser for the demo, and “Reset demo” restores the dummy data. In production each store moves to the LMS’s own tables, gradebook and an external LRS.'
      ],
      legend: [
        { status: 'impl', label: 'Implemented', text: 'Works now in the prototype.', items: ['Dashboard, timeline, catalogue and self-enrolment', 'Activity and course completion', 'Video, audio, image, HTML page and SCORM 1.2 runtime', 'Quizzes, surveys, badges and certificates', 'Learning history, profile, privacy (data export and deletion request)', 'Manager team view; admin courses, users and reports', 'English and Arabic (RTL); light and dark modes'] },
        { status: 'sim', label: 'Simulated', text: 'Behaves realistically but has no real back end.', items: ['xAPI statements to an in-browser LRS', 'File storage for uploads (kept in the browser session)', 'Email notifications'] },
        { status: 'rec', label: 'Recommended', text: 'Proposed for production.', items: ['SCORM / xAPI to the company LMS or an external LRS', 'Single sign-on with company accounts (OAuth 2 / SAML)', 'Manager dashboards that link learning to sales data; HR sync', 'Mobile app for offline learning and push notifications', 'A full screen-reader audit before launch'] }
      ],
      demo: {
        kind: 'lms',
        hint: 'Sign in with a demo button on the login page, or type one of these usernames (any password).',
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
        'The platform and its documentation default to English (the brief allows the tool UI to stay in English). The interface switches to Arabic with RTL.',
        'All users, scores, dates and reports are dummy data for demo purposes only.',
        'Printing is disabled on this website, so the certificate’s print button shows the print notice instead.',
        'The “Moodle references” links open the official Moodle documentation in a new tab.'
      ]
    },

    // ===== TASK 6 =====
    {
      n: 6,
      title: 'Video',
      titleAr: 'الهرم العطري',
      titleGloss: 'The Fragrance Pyramid',
      cardSummary: 'An 87-second explainer, «الهرم العطري» (The Fragrance Pyramid), with a timed script, Arabic voice-over and 2D motion graphics, plus a 28-second intro.',
      summary: 'A short explainer that teaches the fragrance pyramid with one real product, plus the intro that opens the module.',
      types: ['video'],
      isSample: false,
      sampleReason: '',
      facts: [
        { label: 'Format', value: '2 MP4 videos · 1920 × 1080' },
        { label: 'Duration', value: '87 s explainer + 28 s intro' },
        { label: 'Language', value: 'Arabic voice-over' },
        { label: 'Linked tasks', value: 'Tasks 1 and 2' }
      ],
      requirements: [
        { req: 'A 60–90 s video',
          delivered: 'Explainer «الهرم العطري» (The Fragrance Pyramid): 87 seconds, measured from the final file.',
          where: '[Demonstration](#demo)', status: 'covered' },
        { req: 'A script',
          delivered: 'The full script with timings, shown on this page and built from the final caption file. The storyboard is in the Task 1 Part 2 document.',
          where: '[Script](#script); Part 2 PDF §3.4 (pp. 50–51)', status: 'covered' },
        { req: 'A recorded voice-over',
          delivered: 'A calm male voice in neutral, Saudi-leaning Arabic.',
          where: '[Demonstration](#demo)', status: 'covered' },
        { req: 'Visuals and captions',
          delivered: '2D object-only motion graphics (no people) with on-screen key terms. Arabic captions are a separate WebVTT track in the module version (Task 2), with a transcript.',
          where: '[Demonstration](#demo); [Task 2 module](task-2/#demo)', status: 'covered' }
      ],
      did: [
        'The script follows a hook → problem → key terms → framework → worked example → result → close structure.',
        'Every fact the quiz tests is said on screen: the three layers overlap; the timings (opening 5–15 min, heart 15 min to 4 h, base hours, up to the next day); cardamom → opening, sandalwood → heart, amber and tonka → base; and the behaviour “don’t judge from the first spray: smell it again in 15 minutes”.',
        'Object-only visuals (a phone message, the bottle, a layered pyramid, a clock, a blotter) keep the focus on the product and need no actors.',
        'The close hands over to practice: “Now help Ibrahim build the pyramid himself” opens the drag & drop in Task 2.',
        'Bonus: the 28-second intro «رحلة إبراهيم» (Ibrahim’s Journey) opens the module: Sharurah, Ibrahim’s first week, no trainer nearby, and the learner as his mentor.'
      ],
      demo: {
        kind: 'videos',
        hint: 'Press play on a video. Use the player’s own button for full screen.',
        captionsNote: 'Arabic captions are included as a separate track in the module version (Task 2).',
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
      scriptLead: 'Time and voice-over are taken from the final caption files, so the script matches the final cut. The English gloss is a short, faithful translation. Segment codes follow the storyboard in the Task 1 Part 2 document.',
      scriptFileKey: 't6_script',
      scriptFileTitle: 'Read the script as a document',
      files: ['t6_explainer', 't6_intro', 't6_script'],
      inlineFirst: false,
      notes: [
        'Arabic captions are included as a separate track in the module version (Task 2). The Drive player on this page does not show external caption files.',
        'In the final cut the customer says «ثقيل مرة!» ("way too heavy!"); the module’s customer interaction and quiz use the related complaint «قوي مرة!» ("too strong!").'
      ]
    }
  ]
};
