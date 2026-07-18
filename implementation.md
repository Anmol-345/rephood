# Implementation Plan — Cinematic Sunset Hero Landing Page

> Spec written for an autonomous coding agent (opencode). Follow the steps in order. Do not skip the design-token section — every color/type/spacing decision downstream should trace back to it.

## 1. Objective

Build a single hero section (top-of-page, above the fold) for a checkout/product SaaS landing page, using the supplied desert-sunset background artwork as the emotional anchor. Reference layout/typography direction: a dark top navbar, an "eyebrow" pill badge, a large two-line headline with a partial color accent on the last word, a short supporting paragraph, two CTA buttons, and a bottom "trusted by" logo strip — all sitting on top of the background image with a floating object composition in the frame.

The background art (falling figure / dunes / gradient sky) is provided as-is. **Do not regenerate or redraw it** — treat it as a fixed asset (`hero-bg.png`) and build the UI as a layered composition on top of it. If the product isn't literally about a person falling through the sky, replace the falling figure with an object relevant to the product (a shopping cart, a package, a card — whatever the product's core object is), floating in the same pose/position, so the metaphor ("free-fall / weightless motion") still reads as intentional rather than a stock image.

## 2. Visual Reference Summary

Pulled directly from the reference screenshot:

- **Structure:** fixed dark navbar → full-bleed hero image background → bottom-left status badge + headline + subcopy → bottom CTA → bottom-edge logo strip, all inside one full-viewport-height hero.
- **Mood:** cinematic, warm/cool contrast (cool navy top, hot amber/orange horizon band, near-black dune silhouette at the bottom edges). The UI chrome stays neutral (white/black/gray) so the artwork supplies all the color.
- **Motion cue:** a falling/floating subject with 3–4 small objects scattered around it in the sky, implying motion and weightlessness — this is the "signature element."

## 3. Design Tokens

### 3.1 Color

| Token | Hex | Usage |
|---|---|---|
| `--bg-navbar` | `#0A0D12` | Top navigation bar, near-black |
| `--bg-canvas` | `#04070C` | Page background outside the hero image (fallback/letterbox) |
| `--sky-deep` | `#0B2447` | Sampled from top of background image, used for gradient-matching overlays only |
| `--horizon-amber` | `#FF8A3D` | Sampled from the bright band in the image; used sparingly for the one accent word/underline in the headline |
| `--horizon-ember` | `#E8541F` | Secondary accent, hover states on the accent word |
| `--text-primary` | `#FFFFFF` | Headline, primary UI text over the image |
| `--text-secondary` | `rgba(255,255,255,0.68)` | Subcopy, nav links |
| `--text-muted` | `rgba(255,255,255,0.42)` | Logo strip, fine print |
| `--surface-badge` | `rgba(10,13,18,0.55)` | Eyebrow pill background (glass effect over image) |
| `--border-hairline` | `rgba(255,255,255,0.14)` | Pill border, button ghost border, logo-strip divider |
| `--btn-primary-bg` | `#FFFFFF` | Primary CTA fill |
| `--btn-primary-text` | `#0A0D12` | Primary CTA label |

Do not introduce a second bright accent color. `--horizon-amber` is the single accent and should appear in at most: the headline's last word/phrase, the "NEW" badge dot, and link-hover underlines.

### 3.2 Typography

- **Display / Headline face:** a tight, geometric grotesk — `Inter Tight`, `Neue Montreal`, or `General Sans` (pick one, self-host via `@font-face` or `next/font`, weight 500–600). Large size, tight tracking (`letter-spacing: -0.02em`), tight leading (`line-height: 1.05`).
- **Body / UI face:** the same family at weight 400–450 for nav links, subcopy, buttons — don't mix in a second family. Keep the page to one typeface with 2–3 weights.
- **Eyebrow/badge/logo-strip face:** same family, weight 500, `letter-spacing: 0.04em`, uppercase, small size (12–13px) — this is what gives the nav and badge their "utility label" feel in the reference.

Type scale (desktop):

| Role | Size | Weight | Notes |
|---|---|---|---|
| Headline | 56–64px | 600 | 2 lines max, hard `<br/>` at the natural phrase break |
| Subcopy | 17–18px | 400 | max-width ~34ch so it doesn't stretch full-bleed |
| Nav links | 13px | 500 | uppercase, tracked |
| Badge/eyebrow | 12px | 500 | uppercase, tracked, sits in a pill |
| Button label | 14px | 500 | uppercase or sentence case — match nav casing |
| Logo strip label | 11px | 500 | uppercase, muted |

### 3.3 Spacing & Radius

- Base spacing unit: 8px grid.
- Container side padding: 64px desktop / 20px mobile.
- Navbar height: 72px.
- Pill/button radius: 6px (small, not fully rounded — matches the squared-off feel of the reference).
- Logo strip sits flush to the bottom edge of the viewport, 24px vertical padding, subtle top hairline divider over the image.

## 4. Background Image Handling

- File: `hero-bg.png` (provided asset — copy it into the project unmodified).
- Placement: `object-fit: cover; object-position: center;` on a container set to `100vh` (min 720px) so the falling subject stays roughly centered regardless of viewport width.
- Add a **subtle bottom vignette** (`linear-gradient(to top, rgba(0,0,0,0.55), transparent 40%)`) behind the logo strip only, so those logos stay legible over the dune silhouette without dimming the rest of the artwork.
- Do NOT add a full-image dark overlay — the reference relies on the image's own dark navy top and dark dune edges for contrast; adding a global scrim will flatten the color work.
- Preload the hero image (`<link rel="preload" as="image">` or Next.js `priority`) since it's the LCP element.

## 5. Component Breakdown

```
<Hero>
 ├─ <Navbar>
 │   ├─ Left: nav links (DOCS · FEATURES · USE CASES · FAQ)
 │   ├─ Center: wordmark + small icon
 │   └─ Right: "Demo" (ghost, external-link icon) + "Get Started" (filled pill button)
 │
 ├─ <HeroImage>  (background layer, position: absolute, inset: 0, z-index: 0)
 │
 └─ <HeroContent>  (position: absolute, bottom-anchored, z-index: 1)
     ├─ <Badge>  "● NEW   [short feature callout]"
     ├─ <Headline>  two lines, last word/phrase in --horizon-amber
     ├─ <Subcopy>  one sentence, ~34ch max-width
     ├─ <CTARow>  primary button (filled white) — optionally a secondary ghost button
     └─ <TrustedByStrip>  small caption "TRUSTED BY" + row of monochrome client wordmarks/logos
```

### Navbar
- Fixed/sticky at top, `background: var(--bg-navbar)`, full-width, sits *outside* the image bleed so it's always fully opaque and legible (see reference: navbar is solid black, not glass-over-image).
- Center wordmark: small glyph/icon + product name, weight 500, 15px.
- Right side: two actions — a ghost "Demo" link with a small arrow icon, and a filled pill "Get Started" button with a small arrow icon.

### Badge (eyebrow)
- Small pill, `background: var(--surface-badge)`, `border: 1px solid var(--border-hairline)`, `backdrop-filter: blur(8px)`.
- Content: a small dot/icon + short label + a one-line feature callout, separated by a hairline divider inside the pill.

### Headline
- Two short declarative lines. Line 1 = the problem/old way (plain white). Line 2 = the product's promise, with the key word/phrase in `--horizon-amber`.
- Keep both lines under ~24 characters each so it doesn't wrap unpredictably on smaller desktop widths.

### Subcopy
- One sentence, plain language, describing what the user gets and the effort required (e.g. time-to-integrate). Constrain width so it doesn't run under the image's brightest zone if that hurts contrast — check against the amber band specifically.

### CTA Row
- Primary button only (or primary + one ghost secondary), white fill, dark text, small arrow icon, 6px radius, generous horizontal padding (24–28px).
- On hover: slight scale (1.02) or background shift to `--horizon-amber`-tinted white — pick one, not both.

### Trusted-By Strip
- Sits on the bottom edge of the hero, over the vignette.
- Small muted uppercase caption on the left ("TRUSTED BY" or similar), followed by 4–6 monochrome/grayscale logo marks at reduced opacity (`filter: grayscale(1); opacity: 0.6;`), full color + full opacity on hover.
- **Use the product's real client logos here, provided separately as SVGs — do not fabricate or reuse third-party brand logos that aren't actual customers.**

## 6. Responsive Behavior

- **Desktop (≥1024px):** layout as described, hero content bottom-left aligned, image visible full-bleed.
- **Tablet (768–1023px):** headline drops to ~40px, subcopy width relaxes to ~90%, nav links collapse into a menu icon (keep wordmark + Get Started visible).
- **Mobile (<768px):** hero min-height reduces to ~640px or `100svh`; navbar becomes wordmark + hamburger only; badge, headline, subcopy, CTA stack full-width with 20px side padding; trusted-by strip switches to a horizontally scrollable row (`overflow-x: auto`, snap scroll) since 5–6 logos won't fit.
- Always re-check text contrast against the image at each breakpoint — the amber band's vertical position shifts as `object-fit: cover` recrops the image on narrow/tall viewports.

## 7. Accessibility & Performance

- Maintain WCAG AA contrast for `--text-primary`/`--text-secondary` against the darkest realistic crop of the background (test against the dune-shadow corner, not just the amber band).
- All icon-only buttons get `aria-label`s; the hero image gets empty `alt=""` (decorative) since the headline already conveys the meaning — unless the falling subject is itself informational, in which case give it a real `alt`.
- Respect `prefers-reduced-motion`: disable any parallax/entrance animation on the hero content for users who request it; keep only a simple opacity fade at most.
- Compress `hero-bg.png` to a web-optimized JPEG/WebP (~150–300KB target) since it's the LCP asset; keep the PNG only as the source file.
- Visible keyboard focus states on nav links, badge (if interactive), and both buttons.

## 8. Suggested Tech Stack & File Structure

```
/app or /src
 ├─ /components
 │   ├─ Navbar.tsx
 │   ├─ Hero.tsx
 │   ├─ Badge.tsx
 │   ├─ CTAButton.tsx
 │   └─ TrustedByStrip.tsx
 ├─ /public
 │   └─ /images
 │       └─ hero-bg.webp   (optimized copy of hero-bg.png)
 ├─ /styles or tailwind.config
 │   └─ design-tokens (colors, font, radius from Section 3)
 └─ implementation.md   (this file)
```

- Framework: Next.js (or plain Vite + React) + Tailwind CSS, mapping Section 3's tokens into `tailwind.config.js` `theme.extend.colors` / `fontFamily` rather than hardcoding hex values in components.
- Self-host the chosen typeface via `next/font/local` (or `@font-face` + `font-display: swap`) rather than a third-party CDN, to avoid layout shift and keep the page fast.

## 9. Implementation Checklist

1. [ ] Drop `hero-bg.png` into `/public/images/`, generate an optimized WebP copy.
2. [ ] Set up design tokens (colors, font family, radius, spacing) in the theme config — nothing hardcoded in components.
3. [ ] Self-host chosen typeface, verify weights 400/500/600 load correctly.
4. [ ] Build `Navbar` (solid, opaque, fixed height) with nav links, wordmark, Demo + Get Started actions.
5. [ ] Build `Hero` container: full-bleed background image layer + bottom vignette gradient.
6. [ ] Build `Badge`, `Headline` (with the single amber accent word), `Subcopy`, `CTARow`.
7. [ ] Build `TrustedByStrip` with real client logos (grayscale → color on hover), horizontally scrollable on mobile.
8. [ ] Responsive pass at 1440 / 1024 / 768 / 375px — re-check text contrast against the image at each.
9. [ ] Accessibility pass: contrast, focus states, alt text, reduced-motion.
10. [ ] Performance pass: image compression, font preload, Lighthouse LCP check on the hero image.
11. [ ] Swap the falling-figure metaphor for the actual product object if the current subject doesn't match the product being built (see Section 1).

## 10. Assets to Supply Before Build

- `hero-bg.png` — background artwork (provided).
- Product wordmark/logo (SVG).
- 4–6 real client logo SVGs, monochrome-safe, for the trusted-by strip.
- Final headline/subcopy copy — the two-liner in this spec is a placeholder structure, not final copy; write product-specific copy before shipping (see the frontend-design writing principles: plain, active voice, specific over clever).