# Update guide

How to keep this website up to date. You only need a text editor (for example VS Code or Notepad++) and, for apps, Node.js.

The two files you will edit most:

- `content/files.js`: every Google Drive file (PDFs and videos), with its version and date.
- `content/site-data.js`: every word on the site.

After any change: save, then commit and push (section 8). The site updates by itself about a minute later.

---

## 1. Which Drive file is which

All files below are already uploaded and linked.

| Drive file name | Key in `files.js` | Shown on |
|---|---|---|
| MZ_ASAQ_Task1_Part1_Content.pdf | `t1_content` | Task 1 |
| MZ_ASAQ_Task1_Part2_Design_Task3_Quiz.pdf | `t1_design` | Task 1 and Task 3 |
| MZ_ASAQ_Task4_Facilitator_Guide_AR.pdf | `t4_guide` | Task 4 (and the game's "guide" button) |
| MZ_ASAQ_Task4_Printable_Kit_SAMPLE.pdf | `t4_kit` | Task 4 (and the game's "kit" button) |
| MZ_ASAQ_Task5_LMS_Documentation.pdf | `t5_docs` | Task 5 |
| MZ_ASAQ_Task6_Explainer_Fragrance_Pyramid.mp4 | `t6_explainer` | Task 6 |
| MZ_ASAQ_Task6_Intro_Ibrahims_Journey.mp4 | `t6_intro` | Task 6 |

Share settings to keep on every file:

1. Right-click the file in Drive > **Share**.
2. General access: **Anyone with the link**, role **Viewer**.
3. Click the gear icon and **untick** "Viewers and commenters can see the option to download, print, and copy".

**Add the optional script PDF later:** upload it to Drive with the settings above, copy its link, and paste it between the quotes of `drive: ''` in the `t6_script` line. A "Read the script as a document" viewer then appears on Task 6, and the "coming soon" chip turns into a View button.

**Add the optional landing video later:** same steps, in the `landingVideo` line. The video block appears on the home page. While `drive` is empty, the block is hidden.

## 2. Update a PDF or video

**Option A, same link (recommended)**

1. In Drive, right-click the file > **File information** > **Manage versions** > **Upload new version**.
2. The link and ID stay the same, so the site shows the new file automatically.
3. In `content/files.js`, change `version` (for example `'v2'` to `'v3'`) and `updated` (format `'2026-11-20'`).
4. Push.

**Option B, a new file**

1. Upload the new file and set the share settings (section 1).
2. Copy its link (right-click > Share > Copy link).
3. In `content/files.js`, paste the link (or just the ID) between the quotes of `drive: '...'`. Both forms work. A folder link does not work; use the file's own link.
4. Update `title`, `pages`, `version` and `updated` if they changed. Push.

## 3. Change any text

Open `content/site-data.js`. Each task has its own block, marked like this:

```
// ===== TASK 4 =====
```

Inside each block:

- `title`, `summary`, `cardSummary`: page title, one-line summary, home-page card text.
- `facts`: the four small boxes under the title.
- `requirements`: the rows of the "Required vs Covered" table. Each row has `req`, `delivered`, `where`, `status` and, for anything not fully covered, `why`.
- `did`: the "What we did" bullets.
- `demo`: the hint above the live demo and its settings.
- `files`: which Drive files the task lists (keys from `files.js`).
- `notes`: the "Notes and assumptions" bullets.

Small formatting you can use in any text: `**bold**`, and links written as `[label](task-2/#demo)` (no leading `/`, so links also work when the site is opened as local files). Arabic text is detected automatically and shown right-to-left.

Keep the quotes and commas as they are. If a page goes blank after an edit, a quote or comma is usually missing: undo the last change.

## 4. Mark something as a sample, or remove the badge

- For a whole task: in its block, set `isSample: true` and write the reason in `sampleReason: '...'`. Set `isSample: false` to remove the badge and the "Includes sample" chip.
- For one row of the table: set `status: 'sample'` and add `why: '...'`. Use `'covered'` to remove it.
- For one file: in `files.js`, add or remove `sample: true`.

## 5. Replace an app

1. Delete the old folder in `apps/` (`task2-module`, `task4-game` or `task5-lms`).
2. Copy the new version in with the same folder name. Leave out any `README.md` and `setup/` folder.
3. In a terminal, inside this website folder, run:
   ```
   node scripts/patch-apps.mjs
   ```
   It adds the protection script, fixes the meta tags, turns PDF links into the site's protected viewer, deletes PDFs from the app and prints a summary. Running it twice is safe.
4. Commit and push.

If the new app links to a new PDF, upload that PDF to Drive, add it to `files.js`, and add its file name to `PDF_MAP` at the top of `scripts/patch-apps.mjs`, then run the script again.

## 6. Turn the developer-tools guard off or on

Open `assets/js/shield.js`. At the top:

```
var DEVTOOLS_GUARD = true;   // set to false to switch the developer-tools overlay off
```

`GAP_WIDTH` and `GAP_HEIGHT` below it are the sensitivity (in pixels). Raise them if a visitor ever sees the overlay without developer tools open.

## 7. What the protection does and does not do

- It discourages copying: right-click, selection, copy, drag, print, save and the developer-tools shortcuts are blocked, and the Drive viewer cannot be popped out to Drive.
- It is deterrence, not security: anyone can still take a screenshot, turn JavaScript off, or read the page's network traffic.
- The real protections are the private GitHub repository, Drive's "no download, print or copy" setting, the watermarks, and delivering samples where noted.

## 8. Deploy and redeploy

**First time**

1. On GitHub: **New repository** > **Private** (for example `asaq-final-delivery`).
2. In a terminal, inside this website folder:
   ```
   git remote add origin <the repository URL>
   git branch -M main
   git push -u origin main
   ```
3. On Netlify: **Add new site** > **Import from Git** > **GitHub**, and allow access to that private repository.
   - Build command: leave **empty**.
   - Publish directory: `.` (the repository root).
   - Click **Deploy**.
   - Site settings > change the site name, for example `mz-asaq-delivery` (the address becomes `https://mz-asaq-delivery.netlify.app`).
4. Cloudflare Pages works too: **Workers & Pages** > **Create** > **Pages** > **Connect to Git** > choose the repository. Framework preset: **None**. Build command: empty. Output directory: `/`.
5. Open the live address in a private window and walk through every page once before sending the link.

**Every later change**

```
git add -A
git commit -m "Describe the change"
git push
```

The site redeploys automatically within about a minute.

## 9. Troubleshooting

- **A Drive file shows "no access" or asks to sign in:** the share setting is wrong. Set it to "Anyone with the link", Viewer (section 1).
- **A video says "still processing":** wait. Drive needs some time after an upload, especially for videos.
- **The site did not change:** wait one minute after pushing, then hard refresh (Ctrl+F5, or Cmd+Shift+R on a Mac).
- **An app looks broken after an update:** run `node scripts/patch-apps.mjs` again, then push.
- **The developer-tools message appears by mistake:** raise `GAP_WIDTH` / `GAP_HEIGHT` in `assets/js/shield.js`, or set `DEVTOOLS_GUARD = false`.
