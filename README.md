# SecureVault Explorer

A high-performance, keyboard-first file explorer UI for enterprise cloud storage. Built for law firms and financial institutions who need to navigate deeply nested folder structures with precision and speed.

**Live Demo:** _[https://securevault-explorer.vercel.app/]_
**Design File:** _[https://coat-copy-13470081.figma.site/]_ or simply open the Pdf file found at  _"securevault-explorer/DesignFromFigma.pdf"_

---

## Setup

```bash
# Clone the repository
git clone https://github.com/ArmandCito/securevault-explorer.git
cd securevault-explorer

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

**Requirements:** Node.js 18+ and npm 9+

---

## Tech Stack

- **React 18** — component framework
- **Vite** — build tool and dev server
- **CSS Modules** — scoped, component-level styles (no Bootstrap, no MUI, no Chakra)
- **Inter** + **JetBrains Mono** — typography via Google Fonts

---

## Features

### Core

| Feature | Description |
|---|---|
| Recursive File Tree | Renders any depth of nested folders from JSON data |
| Expand / Collapse | Click any folder to toggle its children |
| File Selection | Click a file to select it and view its metadata |
| Properties Panel | Shows Name, Type, Size, and Modified date for the selected file |
| Keyboard Navigation | Full keyboard control — see shortcuts below |
| Search & Filter | Real-time search with auto-expansion of matching parent folders |

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `↑` / `↓` | Move focus up/down between visible items |
| `→` | Expand focused folder |
| `←` | Collapse focused folder |
| `Enter` | Select focused file / toggle focused folder |

Click on the explorer panel first to enable keyboard navigation.

---

## Recursive Strategy

The core challenge is rendering a tree of unknown depth from a nested JSON array. The solution uses two components:

**`FileTree`** (container) owns all shared state:
- `expandedIds` — a `Set<string>` of which folder IDs are open
- `selectedId` — the currently selected file ID
- `focusedId` — the keyboard-focused node ID
- `flatVisibleList` — a flat ordered array of all currently visible nodes, recomputed whenever `expandedIds` changes (used exclusively for keyboard navigation)

**`RecursiveNode`** (recursive renderer) is called once per node and calls itself for each child:

```
RecursiveNode(root_1, depth=0)
  └─ TreeNodeRow (renders the row)
  └─ if expanded:
       RecursiveNode(leg_1, depth=1)
         └─ TreeNodeRow
         └─ if expanded:
              RecursiveNode(case_a, depth=2)
                └─ ...and so on, any depth
```

State is never duplicated. Each `RecursiveNode` simply looks up whether its own `id` is in the shared `expandedIds / selectedId / focusedId` sets. The indent is `depth × 16px`, matching the design spec's 16px-per-level rule.

---

## Wildcard Feature — Breadcrumb Trail Navigation

**What it is:** When a file is selected, a clickable breadcrumb trail appears at the top of the Properties Panel showing the full path from root to the selected file.

```
01_Legal_Department  ›  Active_Cases  ›  Doe_vs_MegaCorp_Inc  ›  Discovery_Phase
```

Each folder segment is a button. Clicking it expands that folder in the tree : no manual scrolling or collapsing required.

**Why it adds business value:**

The requirements describe a file explorer with deeply nested folders used by law firms and banks. The core problem that goes unaddressed in the spec is **spatial disorientation**: a user navigating 5–6 levels deep via keyboard loses track of exactly where they are in the vault.

1. **Context at a glance** — The full file path is always visible without having to visually trace the tree.
2. **Escape hatch** — One click on any ancestor folder jumps back up the hierarchy, replacing a 6-keystroke action with a single click.
3. **Zero learning curve** — Breadcrumbs are a universal UX pattern understood by every user immediately.
4. **Enterprise signal** — It demonstrates the interface was designed around real workflows (audit trails, matter organization) not just a demo : exactly the kind of detail that wins a CTO's confidence.

**Implementation:** `findPath(tree, targetId)` in `fileUtils.js` recursively walks the tree and returns the full ancestor chain. The result flows as a `filePath` prop through `App → PropertiesPanel → Breadcrumb`. Each segment calls `onNavigate(folderId)` which triggers `expandFolder` inside `FileTree` via a registered callback (`onRegisterExpand`).

---

## Design System

The visual language is derived from the Figma design file and encoded as CSS custom properties in `src/index.css`.

### Colors

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#0D0F14` | App background |
| `--bg-surface` | `#13161E` | Sidebar, panels |
| `--bg-elevated` | `#1C2030` | Hover state, inputs |
| `--bg-border` | `#252A3A` | Dividers, borders |
| `--accent-primary` | `#4F8EF7` | Selection, focus, links |
| `--accent-success` | `#2DD4A0` | Excel files, success |
| `--accent-danger` | `#F25C5C` | PDF files, errors |
| `--text-primary` | `#E8EAF0` | Body text |
| `--text-secondary` | `#8892A4` | Labels, metadata |
| `--text-disabled` | `#4A5268` | Placeholders, captions |

### Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| App title (H1) | Inter | 24px | SemiBold 600 |
| Panel headings (H2) | Inter | 18px | SemiBold 600 |
| File/folder names (H3) | Inter | 14px | Medium 500 |
| Metadata (Body) | Inter | 13px | Regular 400 |
| Sizes, timestamps (Caption) | Inter | 11px | Regular 400 |
| File extensions (Mono) | JetBrains Mono | 12px | Regular 400 |

### Spacing

Base unit: **4px**. Scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`

Tree indent: **16px per depth level**

---

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root layout (topbar + sidebar + detail pane)
├── App.module.css
├── index.css                # Global reset + design tokens (CSS vars)
├── data.json                # File tree data
│
├── hooks/
│   ├── useFileTree.js       # Expand/collapse state + flat visible list
│   ├── useSearch.js         # Search filtering + ancestor resolution
│   └── useKeyboardNav.js    # Up/Down/Left/Right/Enter handler
│
├── utils/
│   └── fileUtils.js         # Extension detection, type labels, colors
│
└── components/
    ├── Breadcrumb.jsx        # Wildcard feature component
    ├── Breadcrumb.module.css 
    ├── Icons.jsx             # All SVG icons (no external icon library)
    ├── FileTree.jsx          # Recursive tree container
    ├── FileTree.module.css
    ├── TreeNode.module.css   # 6 visual states (design spec)
    ├── PropertiesPanel.jsx   # Empty + filled states
    ├── PropertiesPanel.module.css
    ├── SearchBar.jsx         # Controlled search input
    ├── SearchBar.module.css
    ├── SearchStatus.jsx      # Search result summary panel
    └── SearchStatus.module.css
```

---

## Component Constraints

No Bootstrap, Material UI, Chakra UI, or Ant Design was used. All components are hand-built from scratch using CSS Modules and standard React hooks. The only external UI dependency is Google Fonts for typography.
