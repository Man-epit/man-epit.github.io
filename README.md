# Portfolio

Personal portfolio of manny, a 3rd-year student in Epitech's Programme Grande École. It's a static site in
English and French, built with [Astro](https://astro.build) and hosted on GitHub Pages.

All the content (projects, hackathons, experience, skills, profile) lives in YAML files under
`src/content/`. **Adding an entry means adding or editing a YAML file. You don't need to touch the code.**

## Quick start

```sh
npm install
npm run dev          # http://localhost:4321 (also reachable from other devices on the network), shows the site as it will be published
npm run dev:draft    # same, with every empty field highlighted
npm run build        # production build in dist/, draft mode OFF
npm run build:draft  # production build with draft mode ON
npm run preview      # serve dist/
npm run check        # type-check
npm run media        # compress the raw photos/videos in each entry's originals/ folder, render the CV previews
```

You need Node 24 (`nvm use` reads `.nvmrc`). The CI uses the same version.

## Where things are

Each project, event and the profile has its own folder that holds everything about it:

```
src/content/
  projects/<slug>/       one folder per project → /en/projects/<slug>/
    index.yaml             the project's data (text, links, list of media)
    media/                 compressed photos and clips used by the page (committed)
    originals/             raw photos and videos before compression (git-ignored)
  events/<slug>/         one folder per hackathon or award → /en/events/<slug>/ (same layout)
  profile/               index.yaml (name, pitch, email, links, CV) + media/ + originals/
  experience.yaml        timeline (work + education)
  skills.yaml            skill groups
  leadership.yaml        "Beyond code" panel
  press.yaml             "In the press" list
public/cv/             CV PDFs
src/config.ts          project categories (filter chips) + draft flag
src/i18n/ui.ts         interface text (buttons, headings) in EN and FR
src/content.config.ts  schemas: what each YAML file may contain
prototype/             the approved single-file prototype (reference for the design)
```

## Text in two languages

Any text field takes either a plain string, which is the same in both languages, or an `{ en, fr }` object:

```yaml
title: Corewar                 # same in EN and FR
summary:
  en: Core War virtual machine…
  fr: Machine virtuelle Core War…
```

Lists work the same way (`contributions: { en: [...], fr: [...] }`).

## Add a project

1. Copy an existing folder in `src/content/projects/`, for example `startrek/`, name the copy after the new slug,
   and delete its `media/` and `originals/` contents. The slug is used in the URL.
2. Fill in the fields of `index.yaml`. Only `slug`, `title` and `category` are required; everything else is optional.

```yaml
slug: my-project              # same as the file name
title: My project
category: emb                 # emb | ai | sys | low | algo | gfx | web | work | other
year: "2026"
status: done                  # done | progress | delivered
featured: false               # true → shown in "Selected work" on the home page
order: 500                    # lower comes first (featured projects always come first)
summary: { en: …, fr: … }     # one sentence, shown on the detail page only
team: { en: 2 people, fr: 2 personnes }   # spec row: Team / Context / Status
context: { en: Epitech project, fr: Projet Epitech }
contextText: { en: …, fr: … } # "Context" section
contributions:                # "What was built" section: what the team built, not personal tasks
  en: [ …, … ]
  fr: [ …, … ]
results:                      # "Results" section: big number + label
  - v: "≈240"
    l: { en: average return, fr: retour moyen }
tags: [C, Criterion]          # stack: shown on cards and in the sidebar
media:                        # first item = card image; all items = the page's media carousel
  - type: image
    src: screenshot.webp      # file in src/content/projects/my-project/media/
    caption: { en: …, fr: … }
links:
  - label: { en: Source code, fr: Code source }
    url: https://github.com/…
related: [corewar]            # slugs of other projects; a typo fails the build
collaborators: [Lucien Rivière, Quentin Taranne-Payet]   # names from collaborators.yaml
hide: [results]               # hide sections even when they are filled
learned: { en: …, fr: … }     # "What I learned"
```

The section keys for `hide` are `specs, context, did, results, gallery, learned, links, stack, related`.

## Add a hackathon or award

Copy a folder in `src/content/events/`. Events use the same fields as projects, except:

- `name` replaces `title`.
- `result` is required (e.g. `{ en: 1st place, fr: 1re place }`). It is the ★ badge.
- `when` and `format` (e.g. `{ en: 48h · team of 6, fr: 48h · équipe de 6 }`) take the place of `year`, `team`, `context` and `status`.
- There is no `category` or `featured`.

The home page card shows the badge, date, name and format, with the first `image` of `media` as its thumbnail.

## Edit experience, skills, leadership, press

These are lists in a single file each. Every item needs a unique `id`. Skills, leadership and press appear in the
order of the file. The experience timeline is sorted automatically, newest first, from the start date in `when`.

```yaml
# experience.yaml
- id: work-acme-2027
  type: work                  # work → "Experience" tag, edu → "Education" tag
  when: 04/2027 – 07/2027
  org: Acme
  role: { en: Embedded intern, fr: Stagiaire embarqué }
  note: { en: "Shipped <b>X</b>", fr: "Livré <b>X</b>" }   # optional, may contain <b>
```

## Collaborators

People you worked with are listed once, in `src/content/collaborators.yaml`, as a name and a profile link:

```yaml
Lucien Rivière:
  url: https://github.com/Say-Goodbi   # GitHub, LinkedIn, portfolio… leave "" for no link
```

A project or event lists them by name (`collaborators: [Lucien Rivière]`). The page shows a "Collaborators" panel with
each name, linked to its profile. To change someone's link, edit `collaborators.yaml` only. If you remove someone from
`collaborators.yaml` but a project still lists them, the project still shows the name, without a link, and the build
prints a warning naming the project.

## Change profile details

Edit `src/content/profile/index.yaml`: name, pitch, email, LinkedIn, GitHub URL, CV links, portrait and press photo.

- **CV:** put the PDFs in `public/cv/`, set `cv: { en: /cv/cv-manny-en.pdf, fr: /cv/cv-manny-fr.pdf }`, then run
  `npm run media`. The hero's "View CV" button opens `/en/cv/` (or `/fr/cv/`), which shows the CV as images and
  has a download button. `npm run media` renders those images from the PDFs (needs `pdftoppm`, from poppler-utils)
  into `src/content/profile/media/<pdf name>-<page>.webp`; run it again whenever a PDF changes.
- **Portrait and press photo:** files go in `src/content/profile/media/` (raw ones in `profile/originals/`).

When the CV or GitHub link is empty, its button is hidden in production.

## Photos and videos

There are three media types:

| type      | `src`                                   | rendered as |
|-----------|-----------------------------------------|-------------|
| `image`   | file name in the entry's `media/` folder | responsive AVIF/WebP, lazy loaded |
| `clip`    | `.mp4` in the entry's `media/` folder    | muted looping video that plays only when on screen |
| `youtube` | the video id (`dQw4w9WgXcQ`)            | thumbnail + play button; the player loads on click |

On a project or event page, all the media of the entry are shown in one carousel, one item at a time.
Visitors swipe or use the arrows and dots, and the carousel loops around. Clicking an image or a clip opens it full screen;
a second click or `Esc` closes it. `hide: [gallery]` keeps only the first item.

While `src` is empty (`src: ""`), the item is left out of the published page. Cards still show a dashed placeholder
so the grid stays even, and `npm run dev:draft` shows the placeholders in the carousel too.

**Never commit raw photos or videos.** Run them through the compressor first:

```sh
mkdir -p src/content/projects/RoboCar/originals
cp ~/Downloads/IMG_1234.jpg ~/Downloads/lap.mov src/content/projects/RoboCar/originals/
npm run media
```

`npm run media` does the following:

- **Photos** become `<name>.webp`, at most 2000 px wide and quality 82.
- **Videos** become `<name>.mp4`: the first 12 s, at most 1280 px on the longest side (never upscaled), H.264 with CRF 28, no audio, faststart. The script also writes `<name>.poster.webp`, which is used as the clip's poster automatically.

The results go in the same entry's `media/` folder. The originals stay in `originals/`, which is git-ignored. Only files that are new or changed since the last run are compressed, and the script prints the `media:` line to paste.

Use `youtube` for anything long. Don't use Git LFS.

## Draft mode

| command | draft | empty fields |
|---|---|---|
| `npm run dev:draft`, `npm run build:draft` | on | orange "to fill" note, plus a template note at the bottom of each detail page |
| `npm run dev`, `npm run build` (and CI) | off | hidden, together with any section that would be empty |

Draft mode is set by the `DRAFT=true` environment variable, which is read in `src/config.ts`.

## Categories and interface text

- **Categories:** the project categories and the order of the filter chips are in `src/config.ts`. A new key there becomes a valid `category`.
- **Interface text:** headings, buttons and the contact pitch are in `src/i18n/ui.ts`.

## Deploy

1. Create the GitHub repo `<username>.github.io` and push `main`.
2. In the repo, go to **Settings → Pages → Source** and pick **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

To use a custom domain, add `public/CNAME` containing the domain, then set it in Settings → Pages.

## Still to fill in

- **Profile:** a press photo.
- **Event dates:** Free and Crealise.
- **Roles:** the featured projects and the events.
- **RoboCar:** best lap time (add it to `results`) and the source link.
- **Zappy:** which parts you owned (add a bullet to `contributions`).
- **Media still missing:** Zappy, Cyclone crew dispatch, octopus, and the events Corewar (campus), Zappy (campus),
  Crealise, Free × Epitech and Global Game Jam. Every other entry has photos, screenshots or clips in its `media/` folder.
  Meanwhile these entries show a generated `placeholder.webp` (first item of `media:`, marked with a comment).
  When real media arrive, delete that item and the file `media/placeholder.webp`.

To see every gap highlighted, run `npm run dev:draft`.

---
Author: manny
