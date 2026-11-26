# AGENTS.md

Guidance for AI coding agents and the people driving them. Humans should also
read [CONTRIBUTING.md](CONTRIBUTING.md).

## What this is

A Lovelace card for the [HomePool](https://github.com/domotk/homepool)
integration. It draws the pool from its own shape and size and shows its
filtration and pump state. It is **one file**, `dist/homepool-card.js`. It has
no dependencies and no build step: it is served as a plain ES module, and
HACS installs it as a plugin.

## Commands

```bash
node --check dist/homepool-card.js   # what CI runs, with the HACS validation
```

To see it, copy the file to `<config>/www/`, add it as a Lovelace resource
(`/local/homepool-card.js?v=<version>`, bumping `v` on every change so
browsers reload it), and add `type: custom:homepool-card`. The browser
console shows `HOMEPOOL-CARD v<version>` when it loads.

## How the file is laid out

1. `STRINGS`: all text, `en` and `es`, looked up with `t(hass, "a.b")`, which
   falls back to English.
2. Small helpers: `esc`, `num`, `hm`, `targetSensors`.
3. The drawing: `outline` (shape → SVG path), `steps` (layout variants),
   `poolSvg`, `pumpSvg`.
4. `HomePoolCard`, which renders on every `hass` update.
5. `HomePoolCardEditor`, the visual editor (`ha-form` with `schemaFor`).

## Rules

- **The integration is the source of truth.** The card reads only what HomePool
  exposes on the daily-target sensor: `pool_entities` (its own entities by
  key), shape, `dimensions`, `layout_variant`, `layout_orientation`,
  `liner_color`, the linked `entities` and `lights`. It also reads the control
  sensor's state, `reason`, `reason_key` and `manual_override_by`. Never guess
  from entity ids: they follow the user's language.
- **Something new to show needs the integration to expose it first.** Make that
  change in homepool, then here. Keep the card working with older HomePool
  versions: a missing attribute means "don't show it", not an error. Comments
  say from which HomePool version an attribute exists.
- **Escape everything from Home Assistant** with `esc()` before it goes into
  HTML: names and reasons are user text.
- **Respect `prefers-reduced-motion`**: nothing moves when the user asked for
  less motion. The water moves only while the pump runs.
- **Every string in both languages.** A new language is a new block in
  `STRINGS`.
- **Bump `VERSION`** in a release, matching the git tag.

## Working on it

- One branch and pull request per change, conventional commit prefixes
  (`fix:`, `feat:`, `docs:`).
- In the pull request, say which HomePool version it needs, and what you
  checked in a real dashboard and what you did not.
- Releases: bump `VERSION`, merge, publish a GitHub release `vX.Y.Z` titled
  `HomePool Card X.Y.Z`. Do it alongside the integration's release when they
  change together.
