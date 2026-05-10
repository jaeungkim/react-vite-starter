# Tailwind CSS v4 — Documentation Site

Tailwind CSS is a utility-first CSS framework that lets developers build custom designs by composing small, single-purpose classes directly in HTML markup. Version 4 is a ground-up rewrite optimized for performance and modern CSS, replacing the JavaScript configuration file (`tailwind.config.js`) with a CSS-native configuration system built around the `@theme` directive and native CSS custom properties. This documentation site is a Next.js application (`v4.tailwindcss.com`) that serves the official v4 reference, installation guides, blog, and showcase for the framework.

The core functionality documented covers: installing Tailwind via Vite plugin, PostCSS plugin, or standalone CLI; customizing design tokens through CSS `@theme` variables; using utility classes conditionally with variants (hover, focus, responsive breakpoints, dark mode); extending the framework with `@utility`, `@variant`, and `@custom-variant` directives; using arbitrary values for one-off styles; and migrating from Tailwind CSS v3 to v4. The site itself is built with Next.js App Router, MDX for documentation pages, Shiki for syntax highlighting, and Tailwind CSS v4 for all of its own styling.

---

## Installation via Vite Plugin

The recommended path for Vite-based projects (SvelteKit, React Router, Nuxt, SolidJS, Laravel). The `@tailwindcss/vite` plugin handles automatic class detection, CSS bundling, and vendor prefixing without additional tooling.

```bash
# Step 1 – scaffold a Vite project
npm create vite@latest my-project
cd my-project

# Step 2 – install Tailwind and its Vite plugin
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

```css
/* src/style.css */
@import 'tailwindcss';
```

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/src/style.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

```bash
# Step 5 – start the dev server
npm run dev
```

---

## Installation via PostCSS Plugin

Best for frameworks that already integrate with PostCSS (Next.js, Angular). Install the dedicated `@tailwindcss/postcss` package — `postcss-import` and `autoprefixer` are no longer needed in v4.

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

```css
/* app/globals.css */
@import 'tailwindcss';
```

```html
<!doctype html>
<html>
  <head>
    <link href="/dist/styles.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

---

## Installation via Tailwind CLI

The simplest path for projects without a bundler. Also available as a standalone executable that requires no Node.js install.

```bash
# Install CLI
npm install tailwindcss @tailwindcss/cli

# Or use npx directly with a standalone binary
```

```css
/* src/input.css */
@import 'tailwindcss';
```

```bash
# Build and watch for changes
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

```html
<!-- src/index.html -->
<!doctype html>
<html>
  <head>
    <link href="./output.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

---

## Utility Classes — Core Styling Pattern

Style elements by combining single-purpose utility classes directly in markup. No custom CSS or class naming required for the vast majority of UI work.

```html
<!-- Notification card built entirely with utilities -->
<div
  class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
>
  <img
    class="size-12 shrink-0 rounded-full"
    src="/avatar.png"
    alt="ChitChat logo"
  />
  <div>
    <div class="text-xl font-medium text-black dark:text-white">ChitChat</div>
    <p class="text-gray-500 dark:text-gray-400">You have a new message!</p>
  </div>
</div>
```

---

## Responsive Design — Breakpoint Variants

Every utility can be applied at a specific breakpoint by prefixing it with the breakpoint name followed by `:`. Tailwind uses a mobile-first approach — unprefixed utilities apply at all sizes, prefixed utilities apply from that breakpoint upward.

| Prefix | Min-width      | Generated CSS                     |
| ------ | -------------- | --------------------------------- |
| `sm`   | 40rem (640px)  | `@media (width >= 40rem) { ... }` |
| `md`   | 48rem (768px)  | `@media (width >= 48rem) { ... }` |
| `lg`   | 64rem (1024px) | `@media (width >= 64rem) { ... }` |
| `xl`   | 80rem (1280px) | `@media (width >= 80rem) { ... }` |
| `2xl`  | 96rem (1536px) | `@media (width >= 96rem) { ... }` |

```html
<!-- Width: 16 default → 32 on md → 48 on lg -->
<img class="w-16 md:w-32 lg:w-48" src="..." />

<!-- Stack on mobile, side-by-side on sm+ -->
<div class="flex flex-col gap-4 sm:flex-row">
  <div class="w-full sm:w-1/2">Left</div>
  <div class="w-full sm:w-1/2">Right</div>
</div>

<!-- Custom breakpoint defined in @theme -->
<!-- @theme { --breakpoint-3xl: 120rem; } -->
<div class="3xl:grid-cols-6">...</div>
```

---

## Hover, Focus, and State Variants

Any utility can be applied conditionally for pseudo-classes, pseudo-elements, media queries, and attribute selectors by prefixing the class with the variant name.

```html
<!-- Hover state -->
<button class="rounded-full bg-sky-500 px-5 py-2 text-white hover:bg-sky-700">
  Save changes
</button>

<!-- Focus state -->
<input
  class="rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
/>

<!-- First/last child pseudo-classes -->
<ul>
  <li class="border-b py-2 first:pt-0 last:border-b-0 last:pb-0">Item</li>
</ul>

<!-- Stacked variants: dark mode + breakpoint + hover -->
<button class="bg-white md:dark:hover:bg-gray-700">Click me</button>

<!-- Group hover — parent triggers child styles -->
<div class="group flex items-center gap-2">
  <img class="rounded-full" src="..." />
  <span class="opacity-0 transition-opacity group-hover:opacity-100"
    >View profile</span
  >
</div>

<!-- Peer — sibling state targeting -->
<input id="email" type="email" class="peer rounded border px-3 py-2" />
<p class="hidden text-sm text-red-500 peer-invalid:block">
  Invalid email address.
</p>
```

---

## Dark Mode

The `dark` variant conditionally applies styles when the user's system preference is dark or when a parent element has `data-theme="dark"`. By default, Tailwind uses the `prefers-color-scheme` media query.

```html
<!-- Automatic OS-level dark mode -->
<div
  class="rounded-xl bg-white p-8 text-gray-900 shadow dark:bg-gray-900 dark:text-white"
>
  <h2 class="text-2xl font-bold">Settings</h2>
  <p class="mt-2 text-gray-500 dark:text-gray-400">
    Manage your account preferences.
  </p>
</div>
```

```css
/* Opt in to selector-based dark mode (e.g., a toggle button) */
/* app.css */
@import 'tailwindcss';

@variant dark (&:where(.dark, .dark *));
```

```html
<!-- Selector-based: add class="dark" to <html> or a wrapper element -->
<html class="dark">
  <body class="bg-white dark:bg-gray-900">
    ...
  </body>
</html>
```

---

## @theme Directive — Design Tokens

The `@theme` directive replaces `tailwind.config.js` for customization. CSS custom properties defined inside `@theme` generate new utility classes and are exposed as regular CSS variables. All `@theme` blocks must be top-level (not nested inside selectors or media queries).

```css
/* app.css */
@import 'tailwindcss';

@theme {
  /* Custom font families → font-display, font-sans, etc. */
  --font-display: 'Satoshi', 'sans-serif';

  /* Custom colors → bg-avocado-500, text-avocado-600, etc. */
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);

  /* Custom breakpoint → 3xl:... */
  --breakpoint-3xl: 120rem;

  /* Custom easing → ease-fluid, ease-snappy */
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

```html
<!-- The theme variables become utility classes automatically -->
<div class="bg-avocado-500 text-avocado-100 font-display 3xl:grid-cols-6">
  Custom themed content
</div>

<!-- They're also available as CSS variables for inline styles or arbitrary values -->
<div style="background-color: var(--color-avocado-500)">Inline usage</div>
<div class="bg-[var(--color-avocado-300)]">Arbitrary value usage</div>
```

---

## Arbitrary Values

Escape the constraint system for one-off values using square bracket notation. Supports all utility categories including spacing, colors, typography, and raw CSS properties. Combine with any variant.

```html
<!-- One-off spacing -->
<div class="top-[117px]">Positioned element</div>

<!-- Combine arbitrary values with variants -->
<div class="top-[117px] lg:top-[344px]">Responsive arbitrary</div>

<!-- Arbitrary color -->
<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">Custom</div>

<!-- Arbitrary background image -->
<div class="bg-[url('/what_a_rush.png')] bg-cover bg-center">Hero</div>

<!-- CSS variable shorthand (auto-wraps in var()) -->
<div class="fill-(--my-brand-color)">SVG with brand color</div>

<!-- Full arbitrary CSS property -->
<div class="[mask-type:luminance] hover:[mask-type:alpha]">Masked element</div>

<!-- Inline CSS variable that changes per breakpoint -->
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]">Scrollable</div>

<!-- Grid with complex template -->
<div class="grid grid-cols-[1fr_500px_2fr] gap-4">
  <div>Col 1</div>
  <div>Col 2 (500px)</div>
  <div>Col 3</div>
</div>

<!-- Type hint for ambiguous CSS variable values -->
<div class="text-(length:--my-size-var)">Font-size from variable</div>
<div class="text-(color:--my-color-var)">Color from variable</div>
```

---

## @utility Directive — Custom Utilities

Register custom utility classes that integrate with variants (hover, responsive, dark, etc.) using the `@utility` directive inside your CSS file.

```css
/* app.css */
@import 'tailwindcss';

/* Simple custom utility */
@utility tab-4 {
  tab-size: 4;
}

/* Utility with multiple properties */
@utility content-auto {
  content-visibility: auto;
}

/* Functional utility using CSS variables */
@utility scrollbar-hide {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

```html
<!-- Works with all variants because it's a proper utility -->
<pre class="tab-4 focus:tab-8">Code block</pre>
<section class="content-auto">Lazy-rendered section</section>
<div class="scrollbar-hide overflow-y-scroll">Hidden scrollbar container</div>
```

---

## @variant and @custom-variant Directives

Apply existing Tailwind variants to custom CSS rules with `@variant`, or create entirely new variants with `@custom-variant`.

```css
/* app.css */
@import 'tailwindcss';

/* Use @variant to apply dark mode styles inside custom CSS */
.card {
  background: white;
  color: black;

  @variant dark {
    background: #1e293b;
    color: white;
  }
}

/* Create a custom variant for a data-theme attribute */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));

/* Create a custom variant for touch devices */
@custom-variant touch (@media (hover: none) and (pointer: coarse));
```

```html
<!-- theme-midnight variant now works like any built-in variant -->
<div data-theme="midnight">
  <p class="theme-midnight:bg-black theme-midnight:text-white p-4">
    Midnight themed paragraph
  </p>
</div>

<!-- touch variant -->
<button class="touch:opacity-100 opacity-50">Touch-optimized button</button>
```

---

## @apply Directive — Utility Classes in Custom CSS

Inline any Tailwind utility class into your own CSS rules. Useful when overriding third-party library styles or working with components that need predictable class names.

```css
/* styles/third-party-overrides.css */
@import 'tailwindcss';

/* Override Select2 styles using design tokens */
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}

.select2-search {
  @apply rounded border border-gray-300;
}

.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}

/* Base styles using @layer */
@layer base {
  h1 {
    @apply text-3xl font-bold tracking-tight text-gray-900 dark:text-white;
  }
  h2 {
    @apply text-2xl font-semibold text-gray-800 dark:text-gray-200;
  }
}
```

---

## @reference Directive — Using @apply in Vue/Svelte/CSS Modules

When using `@apply` or `@variant` in scoped `<style>` blocks or CSS modules, import your main stylesheet for reference (without duplicating output CSS) using `@reference`.

```html
<!-- Vue single-file component -->
<template>
  <h1>Hello world!</h1>
</template>

<style>
  @reference "../../app.css";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

```css
/* Button.module.css (CSS Modules) */
@reference "tailwindcss";

.button {
  @apply rounded-full px-4 py-2 font-semibold text-white;

  @variant hover {
    @apply brightness-110;
  }
}
```

---

## @source Directive — Explicit Class Detection

By default, Tailwind automatically detects source files. Use `@source` to add directories that aren't auto-detected (e.g., node_modules packages, external template libraries).

```css
/* app.css */
@import 'tailwindcss';

/* Scan a UI library in node_modules */
@source "../node_modules/@my-company/ui-lib";

/* Scan additional template directories */
@source "../templates";

/* Force specific file types to be scanned */
@source "*.php";
```

---

## Color System

Tailwind v4 ships a curated default palette using OKLCH color space. Every color has 11 shades from 50 (lightest) to 950 (darkest). Colors are exposed as CSS variables and generate `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`, `ring-*`, and `shadow-*` utilities.

```html
<!-- Full range of sky color shade utilities -->
<div class="bg-sky-50">Lightest sky</div>
<div class="bg-sky-100">...</div>
<div class="bg-sky-200">...</div>
<div class="bg-sky-300">...</div>
<div class="bg-sky-400">...</div>
<div class="bg-sky-500">Mid-tone sky</div>
<div class="bg-sky-600">...</div>
<div class="bg-sky-700">...</div>
<div class="bg-sky-800">...</div>
<div class="bg-sky-900">...</div>
<div class="bg-sky-950">Darkest sky</div>

<!-- Color with opacity modifier -->
<div class="bg-blue-500/75">75% opacity blue</div>
<div class="border border-black/10">10% opacity black border</div>
```

```css
/* Override or extend the default palette in @theme */
@import 'tailwindcss';

@theme {
  /* Replace the entire red scale */
  --color-red-*: initial;
  --color-red-500: oklch(0.63 0.24 29.23);

  /* Add a new color */
  --color-brand: oklch(0.55 0.2 250);
}
```

---

## Preflight — Base Style Reset

Tailwind automatically injects Preflight (built on `modern-normalize`) when you `@import "tailwindcss"`. It normalizes browser inconsistencies and removes default margins, padding, and heading styles so your design system is the only source of truth.

```css
/* Preflight is injected automatically into the base layer */
@layer theme, base, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base); /* ← auto-injected */
@import 'tailwindcss/utilities.css' layer(utilities);
```

```css
/* Disable Preflight if you're integrating with an existing CSS codebase */
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
/* simply omit the preflight import */
```

---

## Upgrading from v3 to v4

Use the automated upgrade tool for most projects. It migrates `tailwind.config.js` to CSS, updates dependencies, and adjusts template syntax.

```bash
# Automated migration (requires Node.js 20+, run in a new branch)
npx @tailwindcss/upgrade
```

```js
// BEFORE (v3): postcss.config.mjs
export default {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

// AFTER (v4): postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```ts
// BEFORE (v3): tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: { brand: '#4F46E5' },
      fontFamily: { display: ['Satoshi', 'sans-serif'] },
    },
  },
}

// AFTER (v4): app.css
@import "tailwindcss";

@theme {
  --color-brand: #4F46E5;
  --font-display: "Satoshi", "sans-serif";
}
```

```ts
// BEFORE (v3): vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  // No tailwind plugin; configured via postcss
});

// AFTER (v4): vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

---

## Arbitrary Variants — On-the-Fly Selector Modification

Use square bracket notation to write custom selectors inline without registering a named variant.

```html
<!-- Target nth-child ranges inline -->
<ul>
  <li class="lg:[&:nth-child(-n+3)]:hover:underline">Featured item</li>
  <li class="lg:[&:nth-child(-n+3)]:hover:underline">Featured item</li>
  <li class="[&:nth-child(-n+3)]:hover:underline">Featured item</li>
  <li class="hover:underline">Regular item</li>
</ul>

<!-- Style direct children -->
<div class="[&>p]:mt-4 [&>p]:text-gray-700">
  <p>First paragraph</p>
  <p>Second paragraph</p>
</div>

<!-- Target elements by attribute -->
<div
  class="[&[data-active]]:bg-blue-500 [&[data-active]]:text-white"
  data-active
>
  Active state
</div>
```

---

Tailwind CSS v4 is most commonly adopted for building entire product UIs — dashboards, marketing sites, SaaS applications, and documentation — using a composable utility class system that keeps styles colocated with markup and eliminates the need for a separate CSS architecture or naming convention like BEM. Its CSS-native configuration via `@theme` makes it straightforward to encode design systems as shareable CSS files, and its tight integration with modern build tools (Vite, PostCSS, the CLI) means it fits into virtually any JavaScript stack with minimal setup friction.

Integration typically follows one of three paths depending on the project toolchain: the **Vite plugin** (`@tailwindcss/vite`) for Vite-based frameworks like SvelteKit, Nuxt, SolidJS, and React Router; the **PostCSS plugin** (`@tailwindcss/postcss`) for frameworks that configure PostCSS under the hood such as Next.js and Angular; and the **standalone CLI** (`@tailwindcss/cli`) for non-Node environments or simple HTML/CSS projects. In all cases the entry point is a single `@import "tailwindcss";` line in the project's root CSS file, from which all utilities, theme variables, and Preflight styles are generated. Customization — colors, fonts, spacing, breakpoints, animations — is expressed as CSS custom properties inside `@theme`, while `@utility`, `@variant`, and `@custom-variant` blocks extend the framework's primitive system to cover any project-specific design pattern.
