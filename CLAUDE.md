# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run serve   # Start dev server
npm run build   # Production build
```

No linting or test scripts are configured.

## Architecture

This is a Vue 3 SPA (built with Vue CLI, not Vite) that serves as an AI-powered landing page constructor. Users write prompts, the app sends them to a Gradio-hosted AI model, and the generated HTML is rendered live in an iframe.

### Tech stack
- **Vue 3** + **Vuex 4** + **Vue Router 4**
- **Vuetify 3** (UI components, MDI icons)
- **TinyMCE** (`@tinymce/tinymce-vue`) — rich-text prompt input with image upload
- **Prism Editor** (`vue-prism-editor`) — syntax-highlighted code view of generated HTML
- **Gradio client** (`@gradio/client`) — connects to the AI model endpoint
- **html-to-text** — strips HTML from prompts before sending to the AI
- **vue-socials** — share dialog (Facebook, VK, Telegram, WhatsApp, Viber, Odnoklassniki)

### Configuration (`src/config/config.js`)
All environment-specific settings live here: TinyMCE API key, backend API base URL (`serverApi`), and image path. To develop locally, swap the commented-out `127.0.0.1:8000` values back in.

### Vuex store (`src/store/index.js`)
Central state includes:
- `prompt` — current HTML prompt (from TinyMCE editor)
- `text` — generated HTML code (rendered in iframe or shown in code editor)
- `history` — array of past prompts/responses for the session
- `model_id` / `models` — selected Gradio model
- `collapse`, `show_history`, `show_code`, `show_mobil` — UI panel toggles
- `disable_send_button`, `globalSpinner` — loading states
- `notifications` — transient toast array (auto-cleared after 2–4s)

Key actions:
- `getData(payload)` — fetches landing record from `GET /api/ai/landings/:id`; populates all state fields
- `getCode(context)` — strips HTML from prompt via `html-to-text`, connects to Gradio (`Client.connect(modelName)`), calls `/generate_code`, slices markdown fences off result, stores raw HTML in `state.text`
- `saveLanding()` — POSTs current `prompt` + `text` to `POST /api/ai/landings/update`
- `saveHistory()` — POSTs each prompt as a history entry to `POST /api/ai/landings/add_history`

### Layout (`src/layouts/MainLayout.vue`)
The single layout wrapping the whole app. Split into two columns:
- **Left (col 4):** Chat/History panel + TinyMCE prompt input fixed at bottom. Switches between `Chat.vue` (chat bubbles) and `History.vue` (clickable list to re-run old prompts) based on `store.state.show_history`.
- **Right (col 7/11):** Either an `<iframe srcdoc>` rendering the generated HTML, or `<PrismEditor>` showing the raw code, based on `store.state.show_code`.

Landing ID resolution on mount: first checks `document.body.getAttribute('aiid')` (set by the backend when embedding the widget), then falls back to parsing the second-to-last URL path segment.

### Components
- **`Navbar.vue`** — toolbar with model selector, history/collapse/code toggles, mobile preview toggle, Share button, and Save button
- **`Chat.vue`** — renders a single history item as a chat bubble; question items show a "Обновить" button to re-send the same prompt
- **`History.vue`** — renders a history item as a clickable card; clicking re-dispatches `getCode` with that prompt and switches back to chat view
- **`Share.vue`** — dialog with social share links using `vue-socials`; share URL is `https://leadpushka.ru/ai/landing/{state.token}`

### Important patterns
- State mutations are done directly on `store.state` (no Vuex mutations defined for most fields) — this is intentional throughout the codebase.
- `componentKey` is incremented to force re-render of keyed components (used by the reload button).
- The `html-to-text` `convert()` call in `getCode` also strips Froala Editor watermark strings before sending to the AI.
- TinyMCE config is defined inline in `MainLayout.vue` data; it uses the same API key as `config.js`.
