# Contributing to HomePool Card

The card is part of [HomePool](https://github.com/domotk/homepool), a
community project. Bug reports with a screenshot, your HomePool and card
versions and the browser console line are the most useful thing you can send.

- **Code:** the card is one plain JavaScript file, `dist/homepool-card.js`,
  with no dependencies and no build step. [AGENTS.md](AGENTS.md) explains how
  it is laid out and the rules it keeps, for people and AI agents alike.
- **Data the card does not have yet:** open the issue in
  [homepool](https://github.com/domotk/homepool/issues) first. The card only
  shows what the integration exposes.
- **Translations:** add a block to `STRINGS`, next to `en` and `es`.

Before opening a pull request, run `node --check dist/homepool-card.js` and try
it in a real dashboard. In the pull request, say which HomePool version it
needs.

Be kind and assume good faith.
