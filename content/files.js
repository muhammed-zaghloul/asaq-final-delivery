// content/files.js
// =====================================================================
// THE ONLY PLACE FILE LINKS LIVE. Every PDF and video on the site is read from here.
//
// HOW TO UPDATE A FILE
// 1) Same file, new version: in Google Drive, right-click the file > File information > Manage versions
//    > Upload new version. The ID does not change. Then update `version` and `updated` below.
// 2) Different file: paste its share link (or just the ID) into `drive` below.
// Share settings for every file: General access = "Anyone with the link", role = Viewer;
// then gear icon > untick "Viewers and commenters can see the option to download, print, and copy".
//
// FIELDS
//   drive   : the Drive file ID or its full share link ('' = not uploaded yet; the site shows "coming soon")
//   title   : the name shown on the site
//   type    : 'pdf' or 'video'
//   pages   : number of pages (PDFs only)
//   lang    : language of the file
//   version : short version label shown as a chip, e.g. 'v2'
//   updated : date shown as "Updated", format YYYY-MM-DD ('' hides it)
//   sample  : true adds the "Sample · for demonstration purposes only" badge
//   note    : optional one-line note shown under the file in the Deliverables list
// =====================================================================
window.FILES = {
  // Optional overview video on the landing page. Leave drive empty to hide the whole block.
  landingVideo: { drive: '', title: 'Submission overview', type: 'video', version: 'v1', updated: '' },

  // Drive file: MZ_ASAQ_Task1_Part1_Content.pdf  (source: Task 1_ Part 1 (Content).pdf)
  t1_content:   { drive: '1YMkgLn0fPWV9DhGeMAL8fuoWo0I6rx1N', title: 'Content document: Understanding Perfume (Part 1)', type: 'pdf', pages: 116, lang: 'Arabic + English', version: 'v4', updated: '2026-11-03' },
  // Drive file: MZ_ASAQ_Task1_Part2_Design_Task3_Quiz.pdf  (source: Task 1_Part 2 (Storyboard) & Task 3.pdf)
  t1_design:    { drive: '1XFSTYUsLUEhZDv6b4tcMkSWmKboLlx3V', title: 'Instructional design document and storyboards (Part 2), incl. Task 3 quiz', type: 'pdf', pages: 100, lang: 'Arabic', version: 'v2', updated: '2026-11-04' },

  // Drive file: MZ_ASAQ_Task4_Facilitator_Guide_AR.pdf
  t4_guide:     { drive: '1p5EDHrszx4YCt_YoMwh-lWU0KArKpsbr', title: 'Facilitator guide', type: 'pdf', pages: 6, lang: 'Arabic', version: 'v1', updated: '2026-11-04' },
  // Drive file: MZ_ASAQ_Task4_Printable_Kit_SAMPLE.pdf
  t4_kit:       { drive: '1MV_jiLrcgluZNgNsk1VYwRfI6N6Qdh9V', title: 'Printable kit (sample)', type: 'pdf', pages: 2, lang: 'Arabic + English', version: 'v1', updated: '2026-11-04', sample: true },

  // Drive file: MZ_ASAQ_Task5_LMS_Documentation.pdf
  t5_docs:      { drive: '1cMY0bLQEPwMAFsr8rRqsn13pS4eN_Y_2', title: 'LMS documentation', type: 'pdf', pages: 12, lang: 'English', version: 'v2', updated: '2026-11-04' },

  // Drive file: MZ_ASAQ_Task6_Explainer_Fragrance_Pyramid.mp4  (source: Task 2 & Task 6/media/explainer.mp4)
  t6_explainer: { drive: '19PVO_YjRoxwNWXa3qq5EOvQS6DRb2z7g', title: 'Explainer video: The Fragrance Pyramid (87 s)', type: 'video', lang: 'Arabic', version: 'v1', updated: '2026-11-04' },
  // Drive file: MZ_ASAQ_Task6_Intro_Ibrahims_Journey.mp4  (source: Task 2 & Task 6/media/intro.mp4)
  t6_intro:     { drive: '1coJ9BP2YUqXWcYyByM6bAuEr7KX9f6GA', title: 'Intro video: Ibrahim’s Journey (28 s)', type: 'video', lang: 'Arabic', version: 'v1', updated: '2026-11-04' },
  // Optional: the video script as a PDF. Leave drive empty to show "coming soon".
  t6_script:    { drive: '', title: 'Video script (optional PDF)', type: 'pdf', lang: 'Arabic', version: 'v1', updated: '' }
};
