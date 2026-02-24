# FixPix Design System

> Single source of truth: `src/styles/theme.css`

## Token Architecture

```
theme.css         → Defines ALL design tokens (single source)
├── index.css     → Consumes tokens: semantic classes, input system
├── studio-system.css → Consumes tokens: editor-specific layout vars
├── mobile-overrides.css → Consumes tokens: mobile adjustments
└── apple-material-system.css → Consumes tokens: material utilities
```

## Surface Hierarchy

| Surface | Class | Background | Shadow | Use |
|---------|-------|-----------|--------|-----|
| Base | `.surface-base` | `--surface` | none | Page background cards |
| Elevated | `.surface-elevated` | `--surface-elevated` | `--depth-1` | Floating cards |
| Panel | `.surface-panel` | `--surface-elevated` | `--depth-2` | Inspector, command bar |
| Modal | `.surface-modal` | `--surface` | `--depth-3` | Modals, dialogs |

## Depth System

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--depth-1` | `0 6px 20px rgba(0,0,0,0.06)` | `rgba(0,0,0,0.30)` | Cards, buttons |
| `--depth-2` | `0 12px 32px rgba(0,0,0,0.10)` | `rgba(0,0,0,0.40)` | Panels, toolbars |
| `--depth-3` | `0 20px 50px rgba(0,0,0,0.18)` | `rgba(0,0,0,0.55)` | Modals |

## Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | 4px | Micro gaps |
| `--space-2` | 8px | Text spacing |
| `--space-3` | 12px | Icon gaps |
| `--space-4` | 16px | Card padding, mobile edges |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Grid gaps, page padding |
| `--space-7` | 32px | Large sections |
| `--space-8` | 40px | Page sections |
| `--space-9` | 48px | Page top/bottom |

**Helpers:** `.stack-sm` (8px) · `.stack-md` (16px) · `.stack-lg` (24px)
**Inline:** `.inline-sm` (8px) · `.inline-md` (12px) · `.inline-lg` (16px)

## Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 10px | Badges, small controls |
| `--radius-md` | 14px | Buttons, inputs |
| `--radius-lg` | 18px | Cards |
| `--radius-xl` | 20px | Toolbars, FABs |
| `--radius-2xl` | 28px | Panels, modals |
| `--radius-full` | 9999px | Pills, avatars |

## Motion Scale

| Token | Value | Use |
|-------|-------|-----|
| `--motion-fast` | 100ms | Hover, active |
| `--motion-base` | 150ms | Default transitions |
| `--motion-slow` | 200ms | Panel open/close |
| `--motion-ease` | `cubic-bezier(0.25, 1, 0.5, 1)` | Easing curve |

**Shorthands:** `--transition-fast` · `--transition-normal` · `--transition-slow`

## Typography

| Weight | Value | Use |
|--------|-------|-----|
| Regular | 400 | Body, descriptions |
| Medium | 500 | Buttons, meta text |
| Semibold | 600 | Card titles, labels |
| Bold | 700 | Hero titles only |

## Icon Scale

| Size | px | Use |
|------|-----|-----|
| Compact | 14 | Editor micro-icons |
| Small | 16 | Inline text icons |
| Default | 18 | Buttons, nav items |
| Large | 20–22 | Card icons, hero |

**Stroke:** `1.5` (subtle) · `1.75` (default) · `2` (standard) · `2.5` (emphasis)

## Color (Accent)

```
--accent:       #007AFF    (base)
--accent-hover: #338FFF    (hover)
--accent-active:#0062CC    (pressed)
--accent-soft:  rgba(0,122,255,0.12)  (backgrounds)
```

## Rules

1. **Only `theme.css` defines tokens** — all other CSS files consume them
2. **Use semantic classes** where possible (`.surface-elevated`, `.stack-md`)
3. **Button.jsx is the only button implementation** — no inline button styles
4. **`.input-field` is the only input style** — no inline input styles
5. **Reduced motion respected** via `prefers-reduced-motion: reduce`
