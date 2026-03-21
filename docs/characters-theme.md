# Character cards — theme & assets

## Current approach (index.html)

- Each `.card` can set **inline CSS variables** (see `carousel_card.css`):
  - `--neon-color`, `--neon-color-2` — border / gradient
  - `--neon-glow`, `--neon-glow-soft` — glow shadows
- **`data-role`** is only a **legacy fallback** (`loyalist` | `threat` | `neutral`) when inline vars are absent. It does **not** need to match story faction anymore.
- **`modal_card.js`** copies computed `--neon-*` from the clicked card onto `.character-detail-card`.

## Future: single config (idea)

1. **`scripts/data/characters.json`** (or `.js` export) — array of `{ id, name, image, shortQuote, details, skills[], neon: { primary, secondary } }`.
2. **Build step or small `characters-render.js`** — generates carousel HTML once, or creates cards at runtime.
3. **CSS** stays as now: cards only need inline `style` or a class like `.card--char-svetlana` generated from JSON.

## Images (`src/images/characters-v2`)

Use v2 full-height WebP where available. **Нора Хармон** has no `characters-v2` file in repo — using `characters/nora-harmon-fullheight.webp`.

## Color reference (primary → paired darker stop)

| Character        | Primary   | Secondary (gradient partner) |
|------------------|-----------|------------------------------|
| Светлана Коваль  | `#4A90E2` | `#2E5AA0`                    |
| Нора Хармон      | `#E67E22` | `#B8601A`                    |
| Дэнни Кит        | `#F1C40F` | `#C9A10C`                    |
| Айзек            | `#F5F7FA` | `#CFD8DC` (белый/серебро)    |
| Марк Вейл        | `#2ECC71` | `#1E8A4F`                    |
| Айда Шен         | `#E74C3C` | `#A83528`                    |
| Коннор           | `#3498DB` | `#236B9A`                    |
| Арчибальд Ванн   | `#F39C12` | `#B8730D`                    |
| Себастьян Кроу   | `#F1C40F` | `#B8940C`                    |
| Red Mood (Алиса) | `#FF3355` | `#D50032` (яркий красный)    |
| Эрика Соул       | `#9B59B6` | `#6C3483`                    |
| Джон Перри       | `#7F8C8D` | `#566063`                    |
