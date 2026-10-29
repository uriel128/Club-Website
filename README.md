# ColorStack at Farmingdale State College

A simple chapter website in forest green, gold, and cream.

**Live:** https://colorstack-fsc.vercel.app

The page contains a hero, a short chapter introduction with two registration steps, and contact links:

1. Fill out the application at https://app.colorstack.io/apply.
2. Join https://discord.gg/B9UbpKtjQu and follow the directions there.

Discord logos open the invite, and the email link opens a message to colorstackfsc@gmail.com. There are no forms, signup dialogs, or officer profiles.

## Development

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

Chapter links live in `src/data/chapter.ts`, the page in `src/App.tsx`, and styles in `src/styles.css`.

## Stack

- React, TypeScript, and Vite
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [Motion for React](https://motion.dev/docs/react) (formerly Framer Motion)
- [React Bits Rotating Text](https://reactbits.dev/text-animations/rotating-text), vendored with its upstream license
- Lucide icons and locally hosted DM Sans / Manrope fonts

The site respects reduced-motion preferences and includes a motion pause control.

## Checks

```sh
npx playwright install chromium
npm test
```

Playwright checks desktop and mobile layouts, direct application navigation, Discord and email links, motion preferences, and automated WCAG A/AA accessibility. Automated checks do not replace a complete manual accessibility audit.

## Deployment

Vercel automatically deploys pushes to `main` from `uriel128/Club-Website`. The Vite build outputs to `dist`; no environment variables or database are required.

## Assets

The chapter owner supplied the logo at `public/images/colorstack-logo.png`. Brand marks remain the property of their respective owners. The hero artwork is CSS. React Bits retains its [MIT + Commons Clause license](src/components/react-bits/LICENSE.md); other libraries and fonts retain their own licenses.
