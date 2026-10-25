# MCARTHY OJEFO OJEAGBASE — Multidisciplinary Portfolio

A responsive static portfolio for a multidisciplinary digital professional offering graphic design, branding, web design, IT solutions, printing services, and IT trainings. It includes a Decap CMS dashboard so projects and screenshots can be added without editing HTML.

## Project files

- `index.html` — public portfolio website
- `css/style.css` — site styling
- `js/script.js` — navigation and project-card rendering
- `data/projects.json` — project entries managed through the CMS
- `admin/index.html` — CMS dashboard interface
- `admin/config.yml` — CMS settings and project fields
- `images/uploads/` — location for uploaded project images

## How project management works

After completing the setup below, open `https://YOUR-SITE.netlify.app/admin/`, sign in, and open **Portfolio → Projects**. You can add a project, upload a screenshot, enter its title and description, choose a category, list technologies/tools, add optional demo/repository links, and publish or unpublish it. CMS changes are committed to GitHub and Netlify redeploys the site.

The featured Ohio Multi-Solution section is still part of the main HTML. The other project cards are read from `data/projects.json` and are CMS-managed.

## Setup and publishing

### 1. Put these files in a GitHub repository

1. Extract this ZIP on your computer.
2. Create a dedicated GitHub repository for your portfolio (for example, `mcarthy-portfolio`).
3. Upload the extracted files and folders into the repository root, preserving the folder structure.
4. Ensure your default branch is `main`.

### 2. Deploy the repository on Netlify

1. Sign in at https://app.netlify.com/.
2. Choose **Add new project → Import an existing project** and connect GitHub.
3. Select your portfolio repository.
4. Because this is plain HTML/CSS/JavaScript, leave the build command blank and set the publish directory to `.` (repository root), if Netlify asks.
5. Deploy the site and copy its public `https://...netlify.app` URL.
6. In `admin/config.yml`, replace `https://YOUR-NETLIFY-SITE.netlify.app` in `site_url` and `display_url` with the actual Netlify URL.

Official Netlify guide: https://docs.netlify.com/start/quickstarts/deploy-from-repository/

### 3. Set up secure CMS sign-in with Decap Turbo

Netlify's older Identity/Git Gateway route is deprecated for new configurations. This starter uses Decap Turbo's `turbo-github` backend instead.

1. Open https://decapcms.org/turbo/ and create an account.
2. In Decap Turbo, connect GitHub and grant its GitHub App access to the portfolio repository.
3. Create a site in Decap Turbo using the exact GitHub repository, branch `main`, and the admin interface URL `https://YOUR-SITE.netlify.app/admin/`.
4. Copy the Site ID shown in the Decap Turbo dashboard.
5. Open `admin/config.yml` and replace `REPLACE_WITH_DECAP_TURBO_SITE_ID` with that Site ID.
6. Commit and push the change to GitHub. Netlify should redeploy automatically.
7. Open `https://YOUR-SITE.netlify.app/admin/` and sign in through Decap Turbo.

Official setup guide: https://decapcms.org/docs/turbo-getting-started/

**Important:** The dashboard cannot authenticate until you complete the Decap Turbo account/repository setup and add the real Site ID. Do not leave the placeholder Site ID in a deployed production setup.

## Adding images to the page

Every picture slot adjusts to the image you give it, and a slot with no image simply stays hidden, so the page never shows a broken-image icon.

- **Profile photo:** `index.html` points to `ojb.png`. Put your photo in the same folder as `index.html` with that name, or change the `src` in the portrait frame. Any shape works: the frame follows the photo's proportions.
- **Service images:** save one image per service in `images/services/` using these exact names: `graphic-design.jpg`, `branding.jpg`, `web-mockup.jpg`, `it-solutions.jpg`, `printing.jpg`, `training.jpg`. Use landscape images about 1200 x 750 px, under 300 KB. Add all six for an even look.
- **Any other place:** copy this block where you want a picture: `<figure class="slot"><img class="slot-img" src="images/your-file.jpg" alt="Describe the picture"></figure>`. Add the class `wide` next to `slot` for a wide banner shape. To keep a face in view, add `style="--pos:center top"` to the figure.
- Always write real alt text, which helps visitors using screen readers and helps search engines.

## Your profile photo

Save your photo as `images/profile.jpg` (portrait orientation, about 800 x 1000 px, under 300 KB). It appears automatically in the About section. Until the file exists, the site shows your initials. To change the photo later, replace the file with another named `profile.jpg`.

## Design gallery: upload flyers, branding and logos

**Easiest way (dashboard):** open `/admin/`, choose **Portfolio, Design Gallery**, and add an item. Fill in the title, client, category and description, upload a cover image, then add as many gallery images as you need, each with a caption. Save, and Netlify redeploys in about a minute.

**Directly on GitHub:** sign in at github.com, open your portfolio repository, go to `images/uploads`, choose **Add file, Upload files**, and commit. Then add the file name to `data/designs.json`, for example `"cover": "images/uploads/kka-logo.jpg"`.

**Image tips:** export as JPG or WebP, about 1600 px on the longest side, under 500 KB each. Show the real work first (the full flyer or logo), then mockups of it in use. Only upload client work you have permission to show.

## Project categories

Choose one category per project in the dashboard: Web Design, Graphic Design, Mockup Design, Application, Computer Training or Other. Visitors see filter tabs for the categories that have projects. A tab appears once its first project is published. Set `SHOW_EMPTY_TABS = true` in `js/script.js` to show every tab all the time.

## Add a project

From the CMS dashboard:
1. Open **Portfolio → Projects**.
2. Add a new item to the Projects list.
3. Fill in the title, category, and accurate description.
4. Upload a genuine screenshot or design image.
5. Add technologies/tools only if you actually used them.
6. Add a demo or repository URL only if it is correct.
7. Save/publish. Wait for Netlify's deployment to finish, then refresh the public website.

Use the **Publish this project** toggle to hide an item without deleting it.

## If projects show "temporarily unavailable"

Project cards load from `data/projects.json`. Browsers block this when a page is opened by double-clicking `index.html`, so the page falls back to a copy embedded at the bottom of `index.html` (`projects-fallback`). That copy is only for offline previews. On your live Netlify site, the CMS-managed `data/projects.json` is always used, so you never need to edit the embedded copy.

## Local preview

You can open `index.html` directly to inspect most of the design, but browsers may block `fetch()` when loading `data/projects.json` from a `file://` URL. For a correct local preview, run a local server from this folder, for example with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. CMS saves always target the connected online repository; local preview is for viewing, not local CMS editing.

## Accuracy and privacy

- Replace placeholder or generic project descriptions with facts from the actual work.
- Do not upload confidential client materials without permission.
- Keep your Decap Turbo account private and invite only people you trust.
- Do not place passwords, API keys, or access tokens in this repository.
