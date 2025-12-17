# Excalidraw Board

A minimalist, dark-themed board app built with Next.js and Tailwind CSS. Create multiple boards and lightweight "boxes" for notes, edit full‑screen with Split / Edit / Preview modes, search & highlight, and persist data in the browser (localStorage). Import/export boards as JSON for backups.

## Features
- Multiple boards with named boxes
- Fullscreen editor with Split / Edit / Preview modes
- In-modal search & highlight
- Autosave to `localStorage`
- Import / Export boards as JSON
- Dark (black) primary theme with white/gray accents

## Quickstart
1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open http://localhost:3000

## Files of interest
- `app/page.js` — landing page
- `app/board/page.js` — main board UI and editor
- `app/globals.css` — color variables and global styles

## Usage
- Create a new board from the sidebar.
- Add boxes to a board; click a box to open the fullscreen editor.
- Use the header search in fullscreen to find text inside the box (matches are highlighted).
- Export to JSON for backups; import JSON to restore.

## Suggested GitHub settings
- Repository description: "Excalidraw Board — a minimal dark Next.js board with fullscreen editor and autosave"
- Topics/tags: `nextjs`, `tailwindcss`, `notes`, `productivity`, `dark-theme`
- Recommended license: MIT

## Contributing
PRs welcome. For UI tweaks, run the dev server locally and open the app. Keep changes minimal and follow the existing style.

## License
MIT — add a `LICENSE` file if you want to publish this repository publicly.

---

If you'd like, I can now:
- add a `LICENSE` (MIT) file,
- create a `.gitignore` tailored for Next.js, or
- prepare a short GitHub repository description and topics you can paste into the repo settings.
Tell me which and I'll add them.