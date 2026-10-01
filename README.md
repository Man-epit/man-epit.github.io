# Portfolio

Personal portfolio of manny, a 3rd-year student in Epitech's Programme Grande École. It's a static site in
English and French, built with [Astro](https://astro.build) and hosted on GitHub Pages.

All the content (projects, hackathons, experience, skills, profile) lives in YAML files under
`src/content/`. **Adding an entry means adding or editing a YAML file. You don't need to touch the code.**

## Quick start

```sh
npm install
npm run dev          # http://localhost:4321, draft mode ON
npm run build        # production build in dist/, draft mode OFF
npm run build:draft  # production build with draft mode ON
npm run preview      # serve dist/
npm run check        # type-check
npm run media        # compress photos/videos dropped in inbox/
```

You need Node 24 (`nvm use` reads `.nvmrc`). The CI uses the same version.

## Where things are

```
src/content/
  profile.yaml         name, pitch, email, LinkedIn, GitHub, CV links, portrait
  projects/<slug>.yaml one file per project  → /en/projects/<slug>/
  events/<slug>.yaml   one file per hackathon or award → /en/events/<slug>/
  experience.yaml      timeline (work + education)
  skills.yaml          skill groups
  leadership.yaml      "Beyond code" panel
  press.yaml           "In the press" list
src/assets/media/<slug>/  photos and clips of each entry (profile/ for the profile)
public/cv/            CV PDFs
src/config.ts         project categories (filter chips) + draft flag
src/i18n/ui.ts        interface text (buttons, headings) in EN and FR
src/content.config.ts schemas: what each YAML file may contain
prototype/            the approved single-file prototype (reference for the design)
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

1. Copy an existing file in `src/content/projects/`, for example `startrek.yaml`. Name the copy `<slug>.yaml`.
   The slug is used in the URL.
2. Fill in the fields. Only `slug`, `title` and `category` are required; everything else is optional.

```yaml
slug: my-project              # same as the file name
title: My project
category: emb                 # emb | ai | sys | low | algo | gfx | web | work | other
year: "2026"
status: done                  # done | progress | delivered
featured: false               # true → shown in "Selected work" on the home page
order: 500                    # lower comes first (featured projects always come first)
summary: { en: …, fr: … }     # one sentence, shown on the detail page only
role: { en: …, fr: … }        # spec row: Role / Team / Context / Status
team: { en: 2 people, fr: 2 personnes }
context: { en: Epitech project, fr: Projet Epitech }
contextText: { en: …, fr: … } # "Context" section
contributions:                # "What I did" section
  en: [ …, … ]
  fr: [ …, … ]
results:                      # "Results" section: big number + label
  - v: "≈240"
    l: { en: average return, fr: retour moyen }
tags: [C, Criterion]          # stack: shown on cards and in the sidebar
media:                        # first item = card + hero, the rest = gallery
  - type: image
    src: screenshot.webp      # file in src/assets/media/my-project/
    caption: { en: …, fr: … }
links:
  - label: { en: Source code, fr: Code source }
    url: https://github.com/…
related: [corewar]            # slugs of other projects; a typo fails the build
hide: [results]               # hide sections even when they are filled
learned: { en: …, fr: … }     # "What I learned"
```

The section keys for `hide` are `specs, context, did, results, gallery, learned, links, stack, related`.

## Add a hackathon or award

Copy a file in `src/content/events/`. Events use the same fields as projects, except:

- `name` replaces `title`.
- `result` is required (e.g. `{ en: 1st place, fr: 1re place }`). It is the ★ badge.
- `when` and `format` (e.g. `{ en: 48h · team of 6, fr: 48h · équipe de 6 }`) take the place of `year`, `team`, `context` and `status`.
- There is no `category` or `featured`.

The home page card shows the badge, date, name and format, with the first `image` of `media` as its thumbnail.

## Edit experience, skills, leadership, press

These are lists in a single file each. The order in the file is the order on the page. Every item needs a unique `id`.

```yaml
# experience.yaml
- id: work-acme-2027
  type: work                  # work → "Experience" tag, edu → "Education" tag
  when: 04/2027 – 07/2027
  org: Acme
  role: { en: Embedded intern, fr: Stagiaire embarqué }
  note: { en: "Shipped <b>X</b>", fr: "Livré <b>X</b>" }   # optional, may contain <b>
```

## Change profile details

Edit `src/content/profile.yaml`: name, pitch, email, LinkedIn, GitHub URL, CV links, portrait and press photo.

- **CV:** put the PDFs in `public/cv/`, then set `cv: { en: /cv/cv-manny-en.pdf, fr: /cv/cv-manny-fr.pdf }`.
- **Portrait and press photo:** files go in `src/assets/media/profile/`.

When the CV or GitHub link is empty, its button is hidden in production.

## Photos and videos

There are three media types:

| type      | `src`                                   | rendered as |
|-----------|-----------------------------------------|-------------|
| `image`   | file name in `src/assets/media/<slug>/` | responsive AVIF/WebP, lazy loaded |
| `clip`    | `.mp4` in `src/assets/media/<slug>/`    | muted looping video that plays only when on screen |
| `youtube` | the video id (`dQw4w9WgXcQ`)            | thumbnail + play button; the player loads on click |

While `src` is empty (`src: ""`), a dashed placeholder with the caption is shown instead.

**Never commit raw photos or videos.** Run them through the compressor first:

```sh
mkdir -p inbox/RoboCar
cp ~/Downloads/IMG_1234.jpg ~/Downloads/lap.mov inbox/RoboCar/
npm run media
```

`npm run media` does the following:

- **Photos** become `<name>.webp`, at most 2000 px wide and quality 82.
- **Videos** become `<name>.mp4`: the first 12 s, 1280 px wide, H.264 with CRF 28, no audio, faststart. The script also writes `<name>.poster.webp`, which is used as the clip's poster automatically.

The results go in `src/assets/media/<slug>/`. The originals are moved to `originals/<slug>/`. Both `inbox/` and `originals/` are git-ignored, and the script prints the `media:` line to paste.

Use `youtube` for anything long. Don't use Git LFS.

## Draft mode

| command | draft | empty fields |
|---|---|---|
| `npm run dev`, `npm run build:draft` | on | orange "to fill" note, plus a template note at the bottom of each detail page |
| `npm run build` (and CI) | off | hidden, together with any section that would be empty |

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

- **Profile:** the CV PDFs (EN/FR), a portrait and a press photo.
- **Event dates:** Mace, Free and Crealise.
- **Roles:** the featured projects and the events.
- **RoboCar:** best lap time (add it to `results`) and the source link.
- **Zappy:** which parts you owned (add a bullet to `contributions`).
- **Media still missing:** RoboCar, Zappy, Lego × IA, Cyclone crew dispatch, Robocar-Racing_Simulator, wesc,
  octopus, chocolatine, and all events. Every other project has real screenshots or clips in `src/assets/media/`.

To see every gap highlighted, run `npm run dev`.

---
Author: manny
