/* Market Share: Region Challenge · game content (bilingual)
   Author: Muhammed Zaghloul. Prices are illustrative for the game, not real store prices. */
window.GD = (function () {
  const L = (en, ar) => ({ en, ar });
  const O = (en, ar, ok, why_en, why_ar) => ({ t: L(en, ar), ok: !!ok, why: L(why_en, why_ar) });

  const region = { name: L('Jeddah region', 'منطقة جدة'), target: 300000 };

  // footfall = customers per day who behave like the card; sale in district = basket × footfall
  const districts = [
    { id: 'd1', name: L('Tahlia', 'التحلية'), stars: 3, x: 1, y: 0 },
    { id: 'd2', name: L('Rawdah', 'الروضة'), stars: 2, x: 0, y: 0 },
    { id: 'd3', name: L('Corniche', 'الكورنيش'), stars: 3, x: 2, y: 0 },
    { id: 'd4', name: L('Andalus', 'الأندلس'), stars: 1, x: 0, y: 1 },
    { id: 'd5', name: L('Al-Balad', 'البلد'), stars: 2, x: 1, y: 1 },
    { id: 'd6', name: L('Obhur', 'أبحر'), stars: 2, x: 2, y: 1 },
    { id: 'd7', name: L('Safa', 'الصفا'), stars: 1, x: 0, y: 2 },
    { id: 'd8', name: L('Al-Hamra', 'الحمراء'), stars: 1, x: 1, y: 2 },
    { id: 'd9', name: L('Salamah', 'السلامة'), stars: 2, x: 2, y: 2 }
  ];
  const footfall = { 1: 8, 2: 12, 3: 18 };

  const products = {
    p1: { name: L('Dehn Oud Miyan spray 80 ml', 'دهن عود ميان بخاخ 80 مل'), price: 450, fam: L('Oud, sweet and soft', 'عود حلو وناعم') },
    p2: { name: L('Dehn Oud Mumtaz oil', 'دهن عود ممتاز'), price: 1200, fam: L('Pure oud oil for experts', 'دهن عود خالص للخبراء') },
    p3: { name: L('Taif rose oil', 'دهن ورد طائفي'), price: 650, fam: L('Rose, classic', 'ورد كلاسيكي') },
    p4: { name: L('Fresh citrus eau de parfum', 'عطر حمضي منعش'), price: 380, fam: L('Citrus, fresh', 'حمضي منعش') },
    p5: { name: L('Tibr Al Oud incense', 'تبر العود'), price: 300, fam: L('Incense for home', 'بخور للمنزل') },
    p6: { name: L('Royal Mamoul set', 'مجموعة المعمول الملكي'), price: 250, fam: L('Mamoul, gift set', 'معمول، مجموعة هدايا') }
  };
  const addons = {
    a1: { name: L('White body musk', 'مسك الجسم الأبيض'), price: 120 },
    a2: { name: L('Amber incense sticks', 'عود بخور معطر بالعنبر'), price: 180 },
    a3: { name: L('Travel-size spray', 'بخاخ بحجم السفر'), price: 90 },
    a4: { name: L('Gift wrapping and card', 'تغليف هدية وبطاقة'), price: 35 },
    a5: { name: L('Electric incense burner', 'مبخرة كهربائية'), price: 150 },
    a6: { name: L('Scented body lotion', 'لوشن معطر للجسم'), price: 140 }
  };

  const objections = {
    o1: { q: L('“It’s too strong!”', '«قوي مرة!»'), opts: [
      O('“The first minutes are always the strongest. Let’s smell it again in 15 minutes.”', '«أول دقائق دايماً أقوى شي، خلنا نشمه بعد ربع ساعة.»', 1, 'The customer judged the top notes only. Explain and wait.', 'العميل حكم على الافتتاحية فقط. اشرح وانتظر.'),
      O('“Then try this light citrus one instead.”', '«طيب جرّب هذا الحمضي الخفيف بدلاً منه.»', 0, 'Switching at once loses a fragrance that may suit them.', 'التبديل فوراً يضيّع عطراً قد يناسبه.'),
      O('“No, it isn’t strong.”', '«لا، هو مو قوي.»', 0, 'Denying the customer’s view breaks trust.', 'إنكار رأي العميل يكسر الثقة.')] },
    o2: { q: L('“It’s expensive.”', '«غالي.»'), opts: [
      O('“I understand. One or two sprays last all evening, and there is a smaller size if you prefer.”', '«أفهمك. رشة أو رشتين تكفي للسهرة، وفيه حجم أصغر إذا تحب.»', 1, 'Empathise, link price to value, offer an option within budget.', 'تفهّم، واربط السعر بالقيمة، وقدّم بديلاً ضمن الميزانية.'),
      O('“We don’t do discounts.”', '«ما عندنا خصومات.»', 0, 'Closes the conversation without value.', 'يغلق الحوار دون إبراز القيمة.'),
      O('“All our perfumes are expensive.”', '«كل عطورنا غالية.»', 0, 'Confirms the objection instead of answering it.', 'يؤكد الاعتراض بدل الرد عليه.')] },
    o3: { q: L('“How long does it last?”', '«كم يثبت؟»'), opts: [
      O('“The base notes stay for hours. Moisturised skin and not rubbing your wrists help it last.”', '«القاعدة تبقى لساعات، والبشرة المرطبة وعدم فرك المعصمين يساعدان على الثبات.»', 1, 'Honest answer plus practical longevity tips.', 'إجابة صادقة مع نصائح عملية للثبات.'),
      O('“All day, guaranteed.”', '«طول اليوم، مضمون.»', 0, 'Over-promising creates complaints later.', 'المبالغة تسبب شكاوى لاحقاً.'),
      O('“It depends.” (and stop there)', '«يعتمد.» (ثم التوقف)', 0, 'Too vague; the customer needs guidance.', 'غامض؛ العميل يحتاج توجيهاً.')] },
    o4: { q: L('“I saw it cheaper online.”', '«شفته أرخص أونلاين.»'), opts: [
      O('“Here you can test it on your skin, and you get the original with our after-sales service.”', '«هنا تقدر تجربه على بشرتك، وتاخذه أصلي مع خدمة ما بعد البيع.»', 1, 'Focus on the value of testing, authenticity and service, without criticising others.', 'ركّز على قيمة التجربة والأصالة والخدمة دون انتقاد الآخرين.'),
      O('“Online sellers are all fake.”', '«كل اللي أونلاين مقلّد.»', 0, 'Criticising others sounds defensive and may be untrue.', 'انتقاد الآخرين يبدو دفاعياً وقد يكون غير صحيح.'),
      O('“Then buy it online.”', '«خلاص اشتريه أونلاين.»', 0, 'You lose the customer.', 'تخسر العميل.')] }
  };

  // customer cards: stars = difficulty. steps: discover, recommend, upsell, addon, objection
  const C = (id, stars, need, disc, rec, ups, add, obj) => ({ id, stars, need, disc, rec, ups, add, obj });
  const DISC_WEAK = [O('“What is your budget?”', '«كم ميزانيتك؟»', 0, 'Budget first is too early and narrows the conversation.', 'السؤال عن الميزانية أولاً مبكر ويضيّق الحوار.'), O('“This is our best seller, want it?”', '«هذا الأكثر مبيعاً، تبيه؟»', 0, 'Recommending before discovering is guessing.', 'التوصية قبل الاكتشاف تخمين.')];
  const customers = [
    C('k1', 1, L('“I want something fresh and clean for work.”', '«أبي شي منعش ونظيف للدوام.»'),
      [O('“Which fragrance do you wear now and like?”', '«وش العطر اللي تستخدمه الحين وتحبه؟»', 1, 'Open question that reveals family and strength.', 'سؤال مفتوح يكشف العائلة والشدة.'), ...DISC_WEAK],
      { opts: ['p4', 'p2', 'p6'], ok: 'p4', why: L('“Fresh, clean, for work” points to the citrus/fresh family.', '«منعش، نظيف، للدوام» تشير إلى العائلة الحمضية المنعشة.') },
      { opts: [O('Suggest the 100 ml size for daily use', 'اقترح حجم 100 مل للاستخدام اليومي', 1, 'Daily use justifies the larger size.', 'الاستخدام اليومي يبرر الحجم الأكبر.'), O('Suggest the most expensive oud', 'اقترح أغلى عود', 0, 'Not linked to the need.', 'غير مرتبط بالاحتياج.')], plus: 160 },
      { opts: ['a3', 'a5', 'a2'], ok: 'a3', why: L('A travel size for the office drawer fits “for work”.', 'حجم السفر لدرج المكتب يناسب «للدوام».') }, 'o3'),
    C('k2', 2, L('“It’s for my brother’s wedding. It must last all night.”', '«لعرس أخوي، لازم يثبت طول الليل.»'),
      [O('“Do you prefer warm and rich, or light scents? What do you usually wear?”', '«تحب الروائح الدافئة الفخمة أو الخفيفة؟ وش تستخدم عادة؟»', 1, 'Discovers preference and current fragrance.', 'يكتشف التفضيل والعطر الحالي.'), ...DISC_WEAK],
      { opts: ['p1', 'p4', 'p5'], ok: 'p1', why: L('Oud with an amber and tonka base lasts through the evening.', 'العود بقاعدة العنبر والتونكا يثبت طوال السهرة.') },
      { opts: [O('Suggest layering with Taif rose oil for the wedding', 'اقترح الطبقات مع دهن الورد الطائفي للعرس', 1, 'Rose oil + oud spray is the classic wedding layering.', 'دهن الورد مع بخاخ العود تركيبة العرس الكلاسيكية.'), O('Suggest a cheaper size', 'اقترح حجماً أرخص', 0, 'The customer did not ask to save; it lowers value.', 'العميل لم يطلب التوفير؛ يخفّض القيمة.')], plus: 650 },
      { opts: ['a1', 'a4', 'a3'], ok: 'a1', why: L('White body musk helps the scent last all night.', 'مسك الجسم الأبيض يساعد الرائحة على الثبات طوال الليل.') }, 'o1'),
    C('k3', 1, L('“I’m new to oud. I don’t want anything heavy.”', '«أنا جديد على العود، ما أبي شي ثقيل.»'),
      [O('“What did you like or dislike in perfumes you tried before?”', '«وش عجبك أو ما عجبك في العطور اللي جربتها قبل؟»', 1, 'Learns their limits before recommending.', 'يعرف حدوده قبل التوصية.'), ...DISC_WEAK],
      { opts: ['p1', 'p2', 'p5'], ok: 'p1', why: L('Miyan is a sweet, soft oud: a good first oud.', 'ميان عود حلو وناعم: مناسب كأول عود.') },
      { opts: [O('Keep the recommendation and let them try it first', 'ثبّت التوصية ودعه يجرّب أولاً', 1, 'A beginner needs confidence, not a bigger bill.', 'المبتدئ يحتاج ثقة لا فاتورة أكبر.'), O('Push pure oud oil', 'ادفع نحو دهن العود الخالص', 0, 'Too heavy for a beginner.', 'ثقيل على المبتدئ.')], plus: 0 },
      { opts: ['a2', 'a5', 'a4'], ok: 'a2', why: L('Amber incense sticks let them enjoy oud gently at home.', 'عود البخور بالعنبر يتيح له الاستمتاع بالعود بلطف في المنزل.') }, 'o1'),
    C('k4', 3, L('“I’m an oud collector. Show me something serious.”', '«أنا أجمع العود، وريني شي ثقيل.»'),
      [O('“Which ouds are in your collection, and which origins do you prefer?”', '«وش أنواع العود اللي عندك، وأي منشأ تفضّل؟»', 1, 'An expert expects you to discover their taste.', 'الخبير يتوقع أن تكتشف ذوقه.'), ...DISC_WEAK],
      { opts: ['p2', 'p1', 'p4'], ok: 'p2', why: L('Pure oud oil is for oud experts.', 'دهن العود الخالص للخبراء.') },
      { opts: [O('Suggest the larger tola for the collection', 'اقترح التولة الأكبر للمجموعة', 1, 'Collectors buy in larger quantities.', 'الجامع يشتري بكميات أكبر.'), O('Suggest a beginner oud', 'اقترح عوداً للمبتدئين', 0, 'Undervalues the expert.', 'يستخف بالخبير.')], plus: 1200 },
      { opts: ['a5', 'a3', 'a6'], ok: 'a5', why: L('An incense burner fits a collector who uses oud at home.', 'المبخرة تناسب جامعاً يستخدم العود في المنزل.') }, 'o2'),
    C('k5', 2, L('“A gift for my mother. I don’t want to spend too much.”', '«هدية لأمي، وما أبي أصرف كثير.»'),
      [O('“What does she usually wear: rose, oud or musk?”', '«وش تستخدم عادة: ورد أو عود أو مسك؟»', 1, 'Finds the recipient’s taste.', 'يكشف ذوق صاحبة الهدية.'), ...DISC_WEAK],
      { opts: ['p3', 'p2', 'p4'], ok: 'p3', why: L('Taif rose oil is a classic, well-received gift.', 'دهن الورد الطائفي هدية كلاسيكية محبوبة.') },
      { opts: [O('Keep the smaller size within budget', 'ثبّت الحجم الأصغر ضمن الميزانية', 1, 'Respects the stated budget and keeps trust.', 'يحترم الميزانية المعلنة ويحافظ على الثقة.'), O('Suggest the largest size', 'اقترح الحجم الأكبر', 0, 'Ignores the budget the customer gave.', 'يتجاهل الميزانية التي ذكرها.')], plus: 0 },
      { opts: ['a4', 'a5', 'a1'], ok: 'a4', why: L('Gift wrapping and a card complete the gift.', 'التغليف والبطاقة يكملان الهدية.') }, 'o2'),
    C('k6', 1, L('“We have guests every weekend. I want the house to smell nice.”', '«عندنا ضيوف كل نهاية أسبوع، أبي البيت ريحته حلوة.»'),
      [O('“Do you use incense now? Do you prefer oud or sweet scents?”', '«تستخدم بخور الحين؟ تحب العود أو الروائح الحلوة؟»', 1, 'Discovers home habits and preference.', 'يكتشف عادات المنزل والتفضيل.'), ...DISC_WEAK],
      { opts: ['p5', 'p4', 'p2'], ok: 'p5', why: L('Tibr Al Oud is made for home and guests.', 'تبر العود مخصص للمنزل والضيوف.') },
      { opts: [O('Suggest the larger box for weekly use', 'اقترح العلبة الأكبر للاستخدام الأسبوعي', 1, 'Weekly guests means regular use.', 'ضيوف أسبوعياً يعني استخداماً منتظماً.'), O('Suggest a personal perfume instead', 'اقترح عطراً شخصياً بدلاً منه', 0, 'Off the stated need.', 'خارج الاحتياج المعلن.')], plus: 300 },
      { opts: ['a5', 'a1', 'a3'], ok: 'a5', why: L('A burner is what they need to use the incense.', 'المبخرة لازمة لاستخدام البخور.') }, 'o3'),
    C('k7', 2, L('“I’m visiting Saudi Arabia. I want a souvenir that is truly local.”', '«أنا زائر للسعودية، أبي تذكار محلي أصيل.»'),
      [O('“Is it for you or a gift? Do you like floral or woody scents?”', '«لك أو هدية؟ تحب الروائح الزهرية أو الخشبية؟»', 1, 'Two quick open questions shape the choice.', 'سؤالان مفتوحان سريعان يحددان الاختيار.'), ...DISC_WEAK],
      { opts: ['p3', 'p4', 'p6'], ok: 'p3', why: L('Taif rose is a famous Saudi origin story.', 'ورد الطائف قصة منشأ سعودية مشهورة.') },
      { opts: [O('Offer a second bottle as a gift for family', 'اعرض زجاجة ثانية هدية للأهل', 1, 'Souvenir buyers often buy for others.', 'مشترو التذكارات يشترون للآخرين غالباً.'), O('Offer the most expensive oud', 'اعرض أغلى عود', 0, 'Not linked to a floral, local souvenir.', 'غير مرتبط بتذكار زهري محلي.')], plus: 650 },
      { opts: ['a3', 'a5', 'a6'], ok: 'a3', why: L('A travel size is easy to carry home.', 'حجم السفر سهل الحمل.') }, 'o4'),
    C('k8', 3, L('“I need Ramadan gifts for 10 colleagues.”', '«أبي هدايا رمضان لعشرة زملاء.»'),
      [O('“What budget per person, and are they men, women or both?”', '«كم الميزانية للشخص، ورجال أو نساء أو الاثنين؟»', 1, 'For corporate gifts, budget per person IS a needs question.', 'في هدايا الشركات، ميزانية الشخص سؤال احتياج فعلي.'), O('“This is our best seller, want it?”', '«هذا الأكثر مبيعاً، تبيه؟»', 0, 'Recommending before discovering is guessing.', 'التوصية قبل الاكتشاف تخمين.'), O('“Do you like oud?”', '«تحب العود؟»', 0, 'Closed and about the buyer, not the recipients.', 'سؤال مغلق وعن المشتري لا المستلمين.')],
      { opts: ['p6', 'p2', 'p4'], ok: 'p6', why: L('The Mamoul set suits group gifting for Ramadan.', 'مجموعة المعمول مناسبة لهدايا رمضان الجماعية.') },
      { opts: [O('Quote for 10 sets plus 2 spare', 'اعرض سعر 10 مجموعات واثنتين احتياط', 1, 'Anticipates the real need and raises the order.', 'يتوقع الاحتياج الفعلي ويرفع الطلب.'), O('Sell one set only', 'بِع مجموعة واحدة فقط', 0, 'Misses the stated quantity.', 'يفوّت الكمية المعلنة.')], plus: 2500 },
      { opts: ['a4', 'a1', 'a3'], ok: 'a4', why: L('Gift wrapping and cards for each colleague.', 'تغليف وبطاقة لكل زميل.') }, 'o2'),
    C('k9', 1, L('“I like sweet scents, like vanilla.”', '«أحب الروائح الحلوة، مثل الفانيلا.»'),
      [O('“Do you want it for daytime or evenings? What do you wear now?”', '«تبيه للنهار أو للمساء؟ وش تستخدم الحين؟»', 1, 'Occasion + current fragrance guide the choice.', 'المناسبة والعطر الحالي يوجهان الاختيار.'), ...DISC_WEAK],
      { opts: ['p1', 'p4', 'p5'], ok: 'p1', why: L('Miyan has a sandalwood and vanilla heart.', 'قلب ميان من الصندل والفانيليا.') },
      { opts: [O('Suggest the matching body lotion layering', 'اقترح اللوشن المعطر للطبقات', 1, 'Layering a lotion extends the sweet scent.', 'اللوشن كطبقة يطيل الرائحة الحلوة.'), O('Suggest pure oud oil', 'اقترح دهن العود الخالص', 0, 'Not sweet; off the need.', 'ليس حلواً؛ خارج الاحتياج.')], plus: 140 },
      { opts: ['a3', 'a5', 'a2'], ok: 'a3', why: L('A travel size to reapply in the evening.', 'حجم سفر لإعادة الرش مساءً.') }, 'o1'),
    C('k10', 2, L('“My perfume fades after an hour. Why?”', '«عطري يروح بعد ساعة، ليش؟»'),
      [O('“Where do you keep the bottle, and do you rub your wrists after spraying?”', '«وين تحفظ الزجاجة، وتفرك معصميك بعد الرش؟»', 1, 'Diagnoses the real cause before selling.', 'يشخّص السبب الحقيقي قبل البيع.'), ...DISC_WEAK],
      { opts: ['p1', 'p4', 'p6'], ok: 'p1', why: L('A richer base (amber, tonka) lasts longer than a fresh citrus.', 'القاعدة الأغنى (عنبر، تونكا) أثبت من الحمضي المنعش.') },
      { opts: [O('Suggest a higher concentration', 'اقترح تركيزاً أعلى', 1, 'Higher concentration means more base notes.', 'التركيز الأعلى يعني نوتات قاعدة أكثر.'), O('Suggest spraying more often', 'اقترح الرش أكثر', 0, 'Doesn’t solve the cause.', 'لا يعالج السبب.')], plus: 200 },
      { opts: ['a6', 'a5', 'a4'], ok: 'a6', why: L('Moisturised skin holds fragrance longer.', 'البشرة المرطبة تمسك العطر أطول.') }, 'o3'),
    C('k11', 2, L('“Eid is coming. I want something special, maybe a combination.”', '«العيد قريب، أبي شي مميز، يمكن تركيبة.»'),
      [O('“What do you usually wear for occasions? Rose, oud or both?”', '«وش تلبس عادة في المناسبات؟ ورد أو عود أو الاثنين؟»', 1, 'Opens the door to layering.', 'يفتح الباب للطبقات.'), ...DISC_WEAK],
      { opts: ['p3', 'p6', 'p4'], ok: 'p3', why: L('Taif rose oil is the base of the classic Eid layering.', 'دهن الورد الطائفي أساس تركيبة العيد الكلاسيكية.') },
      { opts: [O('Add the oud spray to layer over the rose oil', 'أضف بخاخ العود فوق دهن الورد', 1, 'Rose oil + oud spray: the classic combination.', 'دهن الورد مع بخاخ العود: التركيبة الكلاسيكية.'), O('Suggest only a smaller size', 'اقترح حجماً أصغر فقط', 0, 'Misses the “combination” they asked for.', 'يفوّت «التركيبة» التي طلبها.')], plus: 450 },
      { opts: ['a1', 'a3', 'a5'], ok: 'a1', why: L('White musk is a soft final layer for Eid.', 'المسك الأبيض طبقة أخيرة ناعمة للعيد.') }, 'o4'),
    C('k12', 3, L('“I’m in a hurry. Just give me your best seller.”', '«أنا مستعجل، أعطني الأكثر مبيعاً.»'),
      [O('“Sure. One quick question: which perfume do you wear now?”', '«أكيد. سؤال سريع: وش العطر اللي تستخدمه الحين؟»', 1, 'One quick question still beats a guess.', 'سؤال واحد سريع أفضل من التخمين.'), O('“Here, take the best seller.” (no question)', '«تفضل الأكثر مبيعاً.» (بدون سؤال)', 0, 'High risk of a return or an unhappy customer.', 'خطر إرجاع أو عميل غير راضٍ.'), O('“What is your budget?”', '«كم ميزانيتك؟»', 0, 'Budget first is too early.', 'الميزانية أولاً مبكر.')],
      { opts: ['p1', 'p2', 'p6'], ok: 'p1', why: L('They wear a warm oud now: Miyan is a safe, popular match.', 'يستخدم عوداً دافئاً: ميان خيار آمن ومحبوب.') },
      { opts: [O('Keep it quick: one product, no upsell', 'اختصر: منتج واحد بدون ترقية', 1, 'Respect the time; trust brings them back.', 'احترم وقته؛ الثقة تعيده.'), O('Explain the whole range', 'اشرح التشكيلة كاملة', 0, 'Ignores that they are in a hurry.', 'يتجاهل أنه مستعجل.')], plus: 0 },
      { opts: ['a3', 'a5', 'a4'], ok: 'a3', why: L('A travel size is a quick, relevant add-on.', 'حجم السفر إضافة سريعة ومناسبة.') }, 'o2')
  ];

  const events = [
    { id: 'e1', name: L('Wedding season', 'موسم الأعراس'), text: L('Baskets with a long-lasting add-on (white musk) earn +25%.', 'السلال التي فيها إضافة للثبات (مسك أبيض) تحصل على +25%.'), fx: { addon: 'a1', bonus: 0.25 } },
    { id: 'e2', name: L('Ramadan rush', 'زحمة رمضان'), text: L('Footfall +30% in every district this round.', 'عدد العملاء +30% في كل حي هذه الجولة.'), fx: { foot: 0.3 } },
    { id: 'e3', name: L('Eid', 'العيد'), text: L('Every successful basket +15%.', 'كل سلة ناجحة +15%.'), fx: { all: 0.15 } },
    { id: 'e4', name: L('Competitor opens nearby', 'منافس يفتح قريباً'), text: L('Challenging a rival district needs only +0% (equal sales take it).', 'انتزاع حي من فريق آخر يكفيه مساواة مبيعاته.'), fx: { challenge: 1 } },
    { id: 'e5', name: L('Price-sensitive week', 'أسبوع حساس للسعر'), text: L('Every customer raises “It’s expensive.” this round.', 'كل عميل يعترض بـ«غالي» هذه الجولة.'), fx: { obj: 'o2' } },
    { id: 'e6', name: L('Tourist season', 'موسم السياحة'), text: L('Corniche and Al-Balad sales +30%.', 'مبيعات الكورنيش والبلد +30%.'), fx: { districts: ['d3', 'd5'], bonus: 0.3 } }
  ];

  const powerups = [
    { id: 'train', name: L('Training', 'تدريب'), cost: 2000, text: L('Retry one wrong step this turn.', 'أعد محاولة خطوة خاطئة واحدة في هذا الدور.') },
    { id: 'tester', name: L('Tester stock', 'عينات تجربة'), cost: 1500, text: L('Draw a different customer card.', 'اسحب بطاقة عميل أخرى.') },
    { id: 'promo', name: L('Promotion', 'حملة ترويجية'), cost: 3000, text: L('+20% on this turn’s district sales.', '+20% على مبيعات الحي في هذا الدور.') }
  ];

  return { region, districts, footfall, products, addons, objections, customers, events, powerups, budgetRate: 0.1 };
})();
