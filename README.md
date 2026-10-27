# From Ambition to Action

A 7-slide presentation on personal SMART goals, built with plain HTML, CSS and JavaScript. It needs no install, no build step and no internet connection.

## Run it

1. Keep all the files together in one folder.
2. Double-click **`index.html`** to open it in Chrome, Edge, Firefox or Safari.
3. Press **F** to go full screen.

You can also serve the folder if you prefer: `python3 -m http.server`, then open http://localhost:8000.

## Deploy to Cloudflare Pages

This is a static site with no build step.

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick this repository.
2. Production branch: `main`. Framework preset: **None**. Build command: *leave empty*. Build output directory: `/`.
3. Deploy. The presentation is served at `https://<project-name>.pages.dev`. Every push to `main` redeploys it.

A shared link opens on slide 1. Adding `#4` to the end opens slide 4.

## Controls

| Key | Action |
|---|---|
| → / ↓ / Space / Enter / Page Down | Next slide |
| ← / ↑ / Page Up / Backspace | Previous slide |
| 1–7 | Jump to that slide |
| Home / End | First / last slide |
| **F** | Toggle full screen |
| **N** | Toggle the speaker-notes overlay (for rehearsing) |
| **P** | Open the presenter window: notes, timer, what comes next |

The small controls in the bottom-right corner fade out when the mouse is idle. Swipe works on touch screens. The URL hash tracks the current slide, so `index.html#4` opens the weekly plan.

## Presenting with a projector

- Extend your display (don't mirror it). Put `index.html` on the projector and press **F**.
- Press **P** and drag the presenter window onto your laptop screen. Arrow keys work in either window.
- If pop-ups are blocked, allow them for this file, or rehearse with **N** instead.

The slides are drawn on a fixed 1920×1080 (16:9) canvas that scales to fit any screen. On 4:3 projectors it letterboxes instead of reflowing, so nothing gets clipped.

## Files

| File | Purpose |
|---|---|
| `index.html` | The slides |
| `styles.css` | Design system, layouts and animations |
| `app.js` | Scaling, navigation, and the data-driven visuals (weekly calendar, hour totals, essay timeline, recovery chart) |
| `notes.js` | Speaker notes, used by the N overlay and the presenter window |
| `presenter.html` | Presenter view |
| `speaker-notes.md` | Printable speaker notes, per-slide timing, and a rubric map |

## Editing

- **Add your name:** change the line `<span>Student</span>` in `index.html` (slide 1) to your name.
- **Change the weekly plan:** edit the `blocks` list in `app.js`. Each entry is `[day, start, end, type, label]`, where day 0 is Sunday and times are decimal hours (20.5 = 20:30). The totals on the right recalculate automatically.
- **Change the notes:** edit `notes.js`, and update `speaker-notes.md` to match.

## Accessibility

- Animations are turned off if the operating system's "reduce motion" setting is on.
- The smallest text on the slides is 16px on the 1080p canvas, and nearly all of it is 20px or larger.
- Each goal has its own colour, and every coloured block also has a text label, so nothing depends on colour alone.
