/* Sales Academy LMS prototype · seed data (DUMMY DATA for demo purposes only)
   Author: Muhammed Zaghloul */
window.SEED = function () {
  const now = Date.now(), DAY = 864e5;
  const iso = d => new Date(d).toISOString();
  const L = (en, ar) => ({ en, ar });
  let seedN = 7;
  const rnd = () => { seedN = (seedN * 9301 + 49297) % 233280; return seedN / 233280; };

  const categories = [
    { id: 'cat1', name: L('Product knowledge', 'معرفة المنتجات') },
    { id: 'cat2', name: L('Sales skills', 'مهارات البيع') },
    { id: 'cat3', name: L('Customer service', 'خدمة العملاء') },
    { id: 'cat4', name: L('Compliance', 'الامتثال') },
    { id: 'cat5', name: L('Leadership', 'القيادة') },
    { id: 'cat6', name: L('Onboarding', 'التهيئة') }
  ];

  const q = (type, text, opts, correct, fb) => ({ type, text, opts, correct, fb });
  const quizC1 = [
    q('mc', L('A customer has just sprayed a fragrance. Which layer do they smell first?', 'رشّ العميل العطر للتو. أي طبقة يشمها أولاً؟'),
      [L('Base notes', 'القاعدة'), L('Heart notes', 'القلب'), L('Top notes', 'الافتتاحية'), L('Dry-down', 'الأثر الأخير')], [2],
      L('Top notes are light molecules that evaporate fast, so they reach the nose first and fade in 5–15 minutes.', 'الافتتاحية من جزيئات خفيفة سريعة التبخر، فتصل للأنف أولاً وتختفي خلال 5–15 دقيقة.')),
    q('tf', L('Base notes only appear after the top notes have completely disappeared.', 'نوتات القاعدة لا تظهر إلا بعد أن تختفي الافتتاحية تماماً.'),
      [L('True', 'صح'), L('False', 'خطأ')], [1],
      L('The layers overlap. The base is there from the start, but the louder top notes cover it.', 'الطبقات متداخلة؛ القاعدة موجودة منذ البداية لكن تغطيها الافتتاحية.')),
    q('mc', L('A customer says: “It’s too strong!” right after spraying. What is the best reply?', 'قال العميل فور الرش: «قوي مرة!» ما أفضل رد؟'),
      [L('“Let’s try a lighter one instead.”', '«خلنا نجرّب عطر أخف.»'), L('“The first minutes are always the strongest. Let’s smell it again in 15 minutes.”', '«أول دقائق دايماً أقوى شي، خلنا نشمه بعد ربع ساعة.»'), L('“No, it isn’t strong.”', '«لا، هو مو قوي.»'), L('“It’s our best seller.”', '«هذا الأكثر مبيعاً.»')], [1],
      L('The customer judged the opening only. Explaining and waiting respects their view and gives the fragrance a chance.', 'العميل حكم على الافتتاحية فقط؛ الشرح والانتظار يحترم رأيه ويعطي العطر فرصة.')),
    q('multi', L('Which two tips help a fragrance last longer? (Choose two)', 'أي نصيحتين تساعدان العطر على الثبات أطول؟ (اختر اثنتين)'),
      [L('Moisturise the skin first', 'ترطيب البشرة أولاً'), L('Rub the wrists after spraying', 'فرك المعصمين بعد الرش'), L('Choose a higher concentration', 'اختيار تركيز أعلى'), L('Keep the bottle in the car', 'حفظ الزجاجة في السيارة')], [0, 2],
      L('Moisturised skin holds fragrance, and a higher concentration means more base notes. Rubbing and heat damage it.', 'البشرة المرطبة تمسك العطر، والتركيز الأعلى يعني قاعدة أكثر. الفرك والحرارة يضرّانه.')),
    q('mc', L('A customer walks in and says: “I want a perfume.” What is the best first question?', 'دخل عميل وقال: «أبي عطر.» ما أفضل سؤال تبدأ به؟'),
      [L('“What’s your budget?”', '«كم ميزانيتك؟»'), L('“This is our best seller, want to try it?”', '«هذا الأكثر مبيعاً، تبي تجربه؟»'), L('“Which fragrance do you wear now and like?”', '«وش العطر اللي تستخدمه الحين وتحبه؟»'), L('“Do you like oud?”', '«تحب العود؟»')], [2],
      L('Asking about their current fragrance is an open question that quickly reveals the preferred family and strength.', 'السؤال عن العطر الحالي سؤال مفتوح يكشف العائلة والشدة المفضلتين بسرعة.'))
  ];
  const quizShort = (topic) => [
    q('tf', L(`This course covers ${topic.en}.`, `يغطي هذا المقرر ${topic.ar}.`), [L('True', 'صح'), L('False', 'خطأ')], [0], L('Correct: this is the course topic.', 'صحيح: هذا موضوع المقرر.')),
    q('mc', L('What should you do first when a customer looks unsure?', 'ماذا تفعل أولاً عندما يبدو العميل متردداً؟'), [L('Ask an open question', 'أطرح سؤالاً مفتوحاً'), L('Offer a discount', 'أعرض خصماً'), L('Leave them alone', 'أتركه وحده')], [0], L('Open questions help you understand the need.', 'الأسئلة المفتوحة تساعدك على فهم الاحتياج.')),
    q('mc', L('Who can see your training records?', 'من يطّلع على سجل تدريبك؟'), [L('You, your manager and L&D', 'أنت ومديرك وفريق التعلّم والتطوير'), L('Anyone in the company', 'أي شخص في الشركة'), L('Customers', 'العملاء')], [0], L('Access is role-based.', 'الوصول حسب الدور.'))
  ];

  const A = (id, type, title, min, extra) => Object.assign({ id, type, title, min, completion: { video: 'view90', audio: 'view90', image: 'view', html: 'view', scorm: 'scorm', xapi: 'xapi', quiz: 'pass', feedback: 'submit' }[type] }, extra || {});
  const html1 = L(
    '<h3>How this course works</h3><p>This course has four sections. Each activity is marked complete automatically when you meet its condition (watching, passing, submitting).</p><ul><li><b>Duration:</b> about 45 minutes</li><li><b>Pass mark:</b> 80% in the final quiz</li><li><b>Certificate:</b> issued when all activities are complete</li></ul><p>You can pause at any time; the platform remembers where you left off.</p>',
    '<h3>كيف يعمل المقرر</h3><p>يتكون المقرر من أربعة أقسام. يكتمل كل نشاط تلقائياً عند تحقق شرطه (المشاهدة، أو النجاح، أو الإرسال).</p><ul><li><b>المدة:</b> نحو 45 دقيقة</li><li><b>درجة النجاح:</b> 80% في الاختبار النهائي</li><li><b>الشهادة:</b> تصدر عند إكمال كل الأنشطة</li></ul><p>يمكنك التوقف في أي وقت؛ تتذكر المنصة أين توقفت.</p>');

  const courses = [
    { id: 'c1', cat: 'cat1', status: 'published', selfEnrol: false, hours: 0.75, color: '#2B2E4A', title: L('Fragrance Fundamentals: From Notes to Recommendation', 'أساسيات العطور: من النوتات إلى التوصية'),
      summary: L('Understand fragrance layers and recommend the right product with confidence.', 'افهم طبقات العطر وأوصِ بالمنتج المناسب بثقة.'),
      sections: [
        { id: 'c1s1', title: L('Getting started', 'البداية'), acts: [A('c1a1', 'video', L('Welcome video', 'فيديو الترحيب'), 3), A('c1a2', 'html', L('Course guide', 'دليل المقرر'), 2, { html: html1 })] },
        { id: 'c1s2', title: L('Understanding fragrance', 'فهم العطور'), acts: [A('c1a3', 'image', L('Infographic: the fragrance pyramid', 'إنفوجرافيك: الهرم العطري'), 3), A('c1a4', 'audio', L('Podcast: how notes evolve', 'بودكاست: كيف تتطور النوتات'), 4), A('c1a5', 'scorm', L('Interactive lesson: build the pyramid', 'درس تفاعلي: ابنِ الهرم'), 10)] },
        { id: 'c1s3', title: L('Consultative selling', 'البيع الاستشاري'), acts: [A('c1a6', 'xapi', L('Customer scenario (xAPI)', 'سيناريو عميل (xAPI)'), 8), A('c1a7', 'quiz', L('Final quiz', 'الاختبار النهائي'), 8, { pass: 80, questions: quizC1 })] },
        { id: 'c1s4', title: L('Wrap-up', 'الختام'), acts: [A('c1a8', 'feedback', L('Satisfaction survey', 'استبيان الرضا'), 2)] }
      ] },
    { id: 'c2', cat: 'cat3', status: 'published', selfEnrol: false, hours: 0.5, color: '#7A5A12', title: L('Customer Service Excellence', 'التميّز في خدمة العملاء'),
      summary: L('Greet, listen and resolve: the service standards for every branch.', 'الاستقبال والإنصات والحل: معايير الخدمة في كل فرع.'),
      sections: [{ id: 'c2s1', title: L('Service standards', 'معايير الخدمة'), acts: [A('c2a1', 'video', L('Service in action', 'الخدمة عملياً'), 5), A('c2a2', 'html', L('The 6 service steps', 'خطوات الخدمة الست'), 6, { html: L('<h3>The 6 service steps</h3><ol><li>Welcome</li><li>Discover the need</li><li>Sensory experience</li><li>Explain the notes</li><li>Build value</li><li>Close and loyalty</li></ol>', '<h3>خطوات الخدمة الست</h3><ol><li>الاستقبال</li><li>اكتشاف الاحتياج</li><li>التجربة الحسية</li><li>شرح النوتات</li><li>بناء القيمة</li><li>الإتمام والولاء</li></ol>') }), A('c2a3', 'quiz', L('Knowledge check', 'اختبار قصير'), 5, { pass: 70, questions: quizShort(L('customer service standards', 'معايير خدمة العملاء')) }), A('c2a4', 'feedback', L('Satisfaction survey', 'استبيان الرضا'), 2)] }] },
    { id: 'c3', cat: 'cat4', status: 'published', selfEnrol: false, hours: 0.4, color: '#421A00', title: L('Data Privacy Essentials', 'أساسيات حماية البيانات'),
      summary: L('Handle customer and employee data correctly.', 'تعامل مع بيانات العملاء والموظفين بشكل صحيح.'),
      sections: [{ id: 'c3s1', title: L('Essentials', 'الأساسيات'), acts: [A('c3a1', 'scorm', L('Privacy e-learning (SCORM)', 'وحدة الخصوصية (SCORM)'), 15), A('c3a2', 'quiz', L('Compliance check', 'اختبار الامتثال'), 5, { pass: 70, questions: quizShort(L('data privacy', 'حماية البيانات')) }), A('c3a3', 'feedback', L('Satisfaction survey', 'استبيان الرضا'), 2)] }] },
    { id: 'c4', cat: 'cat1', status: 'published', selfEnrol: true, hours: 0.6, color: '#9B731B', title: L('Oud & Oriental Perfumes', 'العود والعطور الشرقية'),
      summary: L('Oud, Taif rose, musk and amber: origins, grades and how to present them.', 'العود وورد الطائف والمسك والعنبر: الأصل والدرجات وطريقة العرض.'),
      sections: [{ id: 'c4s1', title: L('Oriental notes', 'النوتات الشرقية'), acts: [A('c4a1', 'video', L('The story of oud', 'قصة العود'), 6), A('c4a2', 'audio', L('Podcast: Taif rose', 'بودكاست: ورد الطائف'), 5), A('c4a3', 'image', L('Infographic: grades of oud', 'إنفوجرافيك: درجات العود'), 3), A('c4a4', 'quiz', L('Knowledge check', 'اختبار قصير'), 5, { pass: 70, questions: quizShort(L('oriental perfumes', 'العطور الشرقية')) })] }] },
    { id: 'c5', cat: 'cat2', status: 'published', selfEnrol: true, hours: 0.5, color: '#363A5C', title: L('Visual Merchandising Basics', 'أساسيات العرض المرئي'),
      summary: L('Arrange shelves and testers so customers find what they need.', 'رتّب الرفوف والعينات ليجد العميل ما يحتاجه.'),
      sections: [{ id: 'c5s1', title: L('Display', 'العرض'), acts: [A('c5a1', 'html', L('Display principles', 'مبادئ العرض'), 6, { html: L('<h3>Display principles</h3><p>Group by fragrance family, keep testers clean and labelled, and refresh the window display every two weeks.</p>', '<h3>مبادئ العرض</h3><p>جمّع المنتجات حسب العائلة العطرية، وحافظ على نظافة العينات وتسميتها، وجدّد الواجهة كل أسبوعين.</p>') }), A('c5a2', 'image', L('Planogram example', 'مثال مخطط الرفوف'), 4), A('c5a3', 'quiz', L('Knowledge check', 'اختبار قصير'), 5, { pass: 70, questions: quizShort(L('visual merchandising', 'العرض المرئي')) })] }] },
    { id: 'c7', cat: 'cat6', status: 'published', selfEnrol: false, hours: 2, color: '#1F4E5A', title: L('Welcome to the Company', 'مرحباً بك في الشركة'),
      summary: L('Our story, values, policies and your first week.', 'قصتنا وقيمنا وسياساتنا وأسبوعك الأول.'),
      sections: [{ id: 'c7s1', title: L('Your first week', 'أسبوعك الأول'), acts: [A('c7a1', 'video', L('Our story', 'قصتنا'), 30), A('c7a2', 'html', L('Policies you need to know', 'سياسات يجب معرفتها'), 20, { html: L('<h3>Policies</h3><p>Attendance, uniform, customer data and safety.</p>', '<h3>السياسات</h3><p>الحضور والزي وبيانات العملاء والسلامة.</p>') }), A('c7a3', 'scorm', L('Store tour (SCORM)', 'جولة في المعرض (SCORM)'), 45), A('c7a4', 'quiz', L('Onboarding check', 'اختبار التهيئة'), 15, { pass: 70, questions: quizShort(L('onboarding', 'التهيئة')) }), A('c7a5', 'feedback', L('Satisfaction survey', 'استبيان الرضا'), 5)] }] },
    { id: 'c6', cat: 'cat5', status: 'draft', selfEnrol: false, hours: 1, color: '#5E6178', title: L('Team Leadership for Supervisors', 'قيادة الفريق للمشرفين'),
      summary: L('Coaching, feedback and daily huddles for branch supervisors.', 'التوجيه والتغذية الراجعة والاجتماعات اليومية لمشرفي الفروع.'),
      sections: [{ id: 'c6s1', title: L('Coaching', 'التوجيه'), acts: [A('c6a1', 'video', L('Coaching conversations', 'محادثات التوجيه'), 8)] }] }
  ];

  const branches = [L('Jeddah · Tahlia', 'جدة · التحلية'), L('Riyadh · Olaya', 'الرياض · العليا'), L('Makkah · Aziziyah', 'مكة · العزيزية'), L('Dammam · Corniche', 'الدمام · الكورنيش')];
  const P = (id, en, ar, role, branch, managerId, extra) => Object.assign({ id, username: en.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.$/, ''), name: L(en, ar), email: en.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.$/, '') + '@example.com', phone: '+966 5' + String(10000000 + Math.floor(rnd() * 89999999)).slice(0, 8), title: role === 'manager' ? L('Branch Manager', 'مدير فرع') : role === 'admin' ? L('L&D Administrator', 'مسؤول التعلّم والتطوير') : L('Sales Consultant', 'مستشار مبيعات'), branch, role, managerId: managerId || null, status: 'active', lang: 'en', created: iso(now - (60 + rnd() * 200) * DAY), lastAccess: iso(now - rnd() * 9 * DAY) }, extra || {});
  const users = [
    P('u1', 'Reem Al-Harbi', 'ريم الحربي', 'admin', 0),
    P('u2', 'Khalid Al-Subaie', 'خالد السبيعي', 'manager', 0),
    P('u3', 'Noura Al-Ghamdi', 'نورة الغامدي', 'manager', 1),
    P('u10', 'Faisal Al-Harthi', 'فيصل الحارثي', 'learner', 0, 'u2', { lastAccess: iso(now - 1 * DAY) })
  ];
  const team = [['Fahad Al-Otaibi', 'فهد العتيبي'], ['Saud Al-Qahtani', 'سعود القحطاني'], ['Lama Al-Mutairi', 'لمى المطيري'], ['Turki Al-Dosari', 'تركي الدوسري'], ['Haifa Al-Anazi', 'هيفاء العنزي'], ['Majed Al-Shehri', 'ماجد الشهري'], ['Sara Al-Bugami', 'سارة البقمي'],
    ['Yousef Al-Malki', 'يوسف المالكي'], ['Amal Al-Shammari', 'أمل الشمري'], ['Bandar Al-Juhani', 'بندر الجهني'], ['Munira Al-Omari', 'منيرة العمري'], ['Rakan Al-Yami', 'راكان اليامي'], ['Abdullah Al-Zahrani', 'عبدالله الزهراني'], ['Dana Al-Saud', 'دانة السعود']];
  team.forEach((n, i) => users.push(P('u' + (20 + i), n[0], n[1], 'learner', i < 7 ? 0 : (i < 11 ? 1 : 2), i < 7 ? 'u2' : 'u3')));
  users.find(u => u.id === 'u29').status = 'suspended';

  const enrolments = [], progress = {}, lastAcc = {}, feedback = [], logs = [], xapi = [], courseDone = {}, awarded = {}, notifications = [];
  const due = d => iso(now + d * DAY);
  const enrol = (userId, courseId, assigned, dueIn, at) => enrolments.push({ userId, courseId, assigned, main: courseId === 'c1' && assigned, due: dueIn == null ? null : due(dueIn), at: iso(at || now - 30 * DAY) });
  const acts = c => c.sections.flatMap(s => s.acts);
  const log = (at, userId, event, courseId, detail) => logs.push({ at: iso(at), userId, event, courseId: courseId || null, detail: detail || '' });

  function complete(uid, c, ratio, baseDaysAgo) {
    const list = acts(c), n = Math.round(list.length * ratio);
    progress[uid] = progress[uid] || {};
    list.slice(0, n).forEach((a, k) => {
      const at = now - (baseDaysAgo - k * 1.3 - rnd()) * DAY;
      const rec = { done: iso(at), timeSec: Math.round(a.min * 60 * (1 + rnd() * 0.8)) };
      if (a.type === 'quiz') { rec.score = 70 + Math.round(rnd() * 30); rec.passed = rec.score >= (a.pass || 70); if (!rec.passed) { delete rec.done; } }
      if (a.type === 'scorm') rec.score = 75 + Math.round(rnd() * 25);
      progress[uid][a.id] = rec;
      if (rec.done) log(at, uid, 'course_module_completion_updated', c.id, a.title.en);
      if (a.type === 'feedback') feedback.push({ userId: uid, courseId: c.id, rating: 3 + Math.round(rnd() * 2), relevance: 3 + Math.round(rnd() * 2), confidence: 3 + Math.round(rnd() * 2), comment: '', at: iso(at) });
    });
    if (n === list.length && list.every(a => progress[uid][a.id] && progress[uid][a.id].done)) {
      const at = now - (baseDaysAgo - n * 1.3) * DAY; courseDone[uid] = courseDone[uid] || {}; courseDone[uid][c.id] = iso(at);
      awarded[uid] = awarded[uid] || []; awarded[uid].push({ badgeId: 'b_' + c.id, at: iso(at) });
      log(at, uid, 'course_completed', c.id, ''); log(at, uid, 'badge_awarded', c.id, '');
    }
    if (n) lastAcc[uid] = { courseId: c.id, actId: (list[n] || list[n - 1]).id, at: iso(now - rnd() * 5 * DAY) };
  }

  // demo learner
  enrol('u10', 'c7', true, -45, now - 60 * DAY); complete('u10', courses.find(c => c.id === 'c7'), 1, 52);
  enrol('u10', 'c1', true, 5, now - 12 * DAY); enrol('u10', 'c2', true, -3, now - 25 * DAY); enrol('u10', 'c3', true, -20, now - 50 * DAY); enrol('u10', 'c4', false, null, now - 8 * DAY);
  complete('u10', courses[2], 1, 45); complete('u10', courses[3], 0.25, 7); complete('u10', courses[1], 0.5, 20); complete('u10', courses[0], 0.25, 9);
  lastAcc['u10'] = { courseId: 'c1', actId: 'c1a3', at: iso(now - 1 * DAY) };
  // other learners
  users.filter(u => u.role === 'learner' && u.id !== 'u10').forEach((u, i) => {
    enrol(u.id, 'c7', true, -45, now - 60 * DAY); complete(u.id, courses.find(c => c.id === 'c7'), 1, 50 + rnd() * 8);
    enrol(u.id, 'c1', true, 5 + (i % 3), now - 12 * DAY); enrol(u.id, 'c2', true, -3 + (i % 5) * 3, now - 25 * DAY); enrol(u.id, 'c3', true, -20, now - 50 * DAY);
    complete(u.id, courses[2], rnd() < 0.8 ? 1 : 0.5, 40 + rnd() * 10);
    complete(u.id, courses[1], rnd(), 22);
    complete(u.id, courses[0], rnd() * 0.9, 10);
    if (rnd() < 0.3) { enrol(u.id, 'c4', false, null, now - 6 * DAY); complete(u.id, courses[3], rnd(), 6); }
    log(now - rnd() * 4 * DAY, u.id, 'user_loggedin', null, '');
  });
  // managers & admin enrolled in leadership-free courses
  ['u2', 'u3'].forEach(m => { enrol(m, 'c3', true, -20, now - 50 * DAY); complete(m, courses[2], 1, 44); enrol(m, 'c1', false, null, now - 10 * DAY); complete(m, courses[0], 0.5, 9); });

  const comments = [L('The “too strong” example happens to me every day.', 'مثال «قوي مرة» يتكرر معي كل يوم.'), L('Please add a video about oil versus spray.', 'أتمنى إضافة فيديو عن الفرق بين الدهن والبخاخ.'), L('Short lessons fit between shifts.', 'الدروس القصيرة تناسب ما بين الورديات.'), L('The quiz feedback was clear.', 'التغذية الراجعة في الاختبار واضحة.')];
  feedback.slice(0, 4).forEach((f, i) => { f.comment = comments[i]; });

  ['u20', 'u21', 'u22'].forEach((u, i) => xapi.push({ id: 'st' + i, timestamp: iso(now - (i + 1) * DAY), actor: { objectType: 'Agent', account: { homePage: 'https://lms.example.com', name: u } }, verb: { id: 'http://adlnet.gov/expapi/verbs/completed', display: { 'en-US': 'completed' } }, object: { objectType: 'Activity', id: 'https://lms.example.com/xapi/activities/c1a6', definition: { name: { 'en-US': 'Customer scenario' } } }, result: { score: { scaled: 0.67 + i * 0.1 }, success: true, completion: true } }));

  notifications.push({ id: 'n1', userId: 'u10', at: iso(now - 3 * DAY), text: L('“Customer Service Excellence” is overdue.', 'مقرر «التميّز في خدمة العملاء» متأخر.'), link: '#/course/c2', read: false });
  notifications.push({ id: 'n2', userId: 'u10', at: iso(now - 12 * DAY), text: L('You were assigned “Fragrance Fundamentals”. Due in 5 days.', 'تم تعيين «أساسيات العطور» لك. موعد الإكمال بعد 5 أيام.'), link: '#/course/c1', read: false });

  const badges = courses.map(c => ({ id: 'b_' + c.id, courseId: c.id, name: c.title }));
  return { version: 4, categories, courses, users, enrolments, progress, lastAcc, feedback, logs, xapi, courseDone, awarded, badges, notifications, prefs: {} };
};
