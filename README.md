# ColorStack at Farmingdale State College

A responsive chapter website in forest green, gold, and cream, built around the supplied chapter logo.

## Stack

- React + TypeScript + Vite
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [Motion for React](https://motion.dev/docs/react) (formerly Framer Motion) for entrance animations and transitions
- [React Bits Rotating Text](https://reactbits.dev/text-animations/rotating-text), vendored in `src/components/react-bits/` with its upstream license
- Lucide icons, a Discord logo link, and locally hosted DM Sans / Manrope fonts
- Vercel hosting

## Local development

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Content and behavior

- Mission, technical/career/community programming, and upcoming-event announcements
- Founding executive board and faculty advisor
- Filterable resources, accessible FAQ accordions, and membership instructions
- Every Discord logo links to `https://discord.gg/B9UbpKtjQu`
- Contact email: `colorstackfsc@gmail.com`
- Contact form validates input and prepares a `mailto:` draft with a clipboard fallback. **The visitor must send the email in their email app.** There is no backend, mailing list signup, or stored submission.
- Membership directs visitors to Discord and an email request for the official roster form. National membership is a separate application.
- Event dates and locations are intentionally unannounced. Planned program formats are clearly distinguished from confirmed events.
- Reduced-motion preferences, a motion pause control, native modal focus management, keyboard navigation, and mobile navigation

Chapter links, officers, program descriptions, resources, and FAQs live in `src/data/chapter.ts`. Layout and event announcements live in `src/App.tsx`; styling is in `src/styles.css`.

### Content provenance

The chapter mission, founding board, advisor, dues, membership requirements, and meeting cadence were taken from the local chapter constitution supplied in the workspace (`Club Document.pdf`). The document itself and member rosters are **not** included in this repository. Email and Discord were supplied directly by the chapter owner. No event dates, attendance counts, testimonials, sponsor relationships, or officer photos have been invented.

Public resources were verified against [ColorStack](https://www.colorstack.org/students), [FSC Student Activities](https://www.farmingdale.edu/student-activities/gettinginvolved.shtml), and the [FSC Nexus Center](https://www.farmingdale.edu/nexus-center/career-development.shtml). Officer graphics are typographic initials, not portraits.

## Checks

```sh
npx playwright install chromium
npm test
```

Playwright exercises desktop and mobile layouts, membership dialogs and focus restoration, resource filters, contact validation and draft content, Discord links, FAQs, reduced-motion controls, and mobile navigation. Axe checks the page and membership dialog for automated WCAG A/AA issues. Automated checks do not replace a complete manual accessibility audit.

To check a deployed instance:

```sh
TEST_BASE_URL=https://your-project.vercel.app npm test
```

## Deployment

`vercel.json` configures Vite, the `dist` output directory, asset caching, and basic response headers. No environment variables or database are required.

```sh
npx vercel login
npx vercel link
npx vercel --prod
```

Connect `uriel128/Club-Website` to the Vercel project for automatic deployments from `main`.

## Assets and attribution

The chapter logo is provided by the chapter owner and remains at `public/images/colorstack-logo.png`. Brand marks remain the property of their respective owners. The hero sculpture and other decorative illustrations are CSS artwork. React Bits code retains its [MIT + Commons Clause license](src/components/react-bits/LICENSE.md). Other libraries and font packages retain their own licenses.
