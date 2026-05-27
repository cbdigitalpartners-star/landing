# CLAUDE.md

Marketing landing site for **C&B Digital Partners** — custom-software studio, Santiago, Chile.

- Static HTML + hand-written `styles.css`. No framework, no build step. Deployed on Vercel.
- Spanish (es). Pages: `index.html`, `privacidad.html`, `terminos.html`.
- Brand assets in `assets/`: `logo-clean.png` (header/footer, transparent), `favicon.ico`. Other `logo_*.png` are raw brand-sheet crops (have caption text baked in) — do not use directly.
- Design tokens live in `styles.css` `:root`. Full guidelines in `.impeccable.md`.

## Design Context

### Users
Chilean business decision-makers evaluating whether to hire the studio for custom software (messaging integrations, automation, web platforms, fintech, education). Skeptical, time-poor. Job to be done: *"prove this studio is competent and safe to trust, fast."* Emotional goal: **confidence**.

### Brand Personality
**Modern · trustworthy · technically precise.** Direct, concrete voice — real products in production, official APIs, encrypted data. Senior engineers who ship, not a marketing agency. No hype, no buzzword salad.

### Aesthetic Direction
Clean, tech-forward, light-first; deep-navy anchors + blue→teal accent. Generous whitespace, restrained palette, intentional hierarchy. Dark mode in scope (`prefers-color-scheme`, mirror tokens).

**Anti-reference — NOT generic AI-template:** no identical equal-weight card grids, no emoji-as-icons, no everything-centered layouts, no stock gradient soup. Each section earns its layout.

### Design Principles
1. **Evidence over claims** — real products, numbers, screenshots beat adjectives.
2. **Restraint** — two accents max (blue + teal); navy + paper carry the rest.
3. **Intentional hierarchy** — vary layout/rhythm; never a uniform card grid by default.
4. **Accessible by default (WCAG AA)** — ≥4.5:1 contrast, visible focus, keyboard nav, honor `prefers-reduced-motion`; verify both themes.
5. **Production-grade polish** — tight type, aligned spacing, no layout shift, subtle purposeful motion. Craft signals competence.
