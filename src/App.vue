<template>
  <router-view />
  <AppToast />
</template>

<script setup>
import AppToast from './components/AppToast.vue'
</script>

<style>
/* ══════════════════════════════════════
   CSS Custom Properties (Design Tokens)
══════════════════════════════════════ */
:root {
  /* Brand colours */
  --primary:       #C8102E;
  --primary-dark:  #a00d24;
  --primary-light: #fff0f2;
  --gold:          #F5A623;
  --gold-light:    #fff8ec;

  /* Surfaces */
  --bg:      #f8f5f5;
  --surface: #ffffff;
  --border:  #ede0e0;

  /* Text */
  --text:       #1a0a0a;
  --text-muted: #7a5a5a;

  /* Skeleton / shimmer */
  --skeleton:           #f0e0e0;
  --shimmer-mid:        #fdf4f4;
  --shimmer-gold-tint:  #fef3e2;

  /* Typography */
  --font-body:    'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-arabic:  'Cairo', 'Segoe UI', sans-serif;
  --font-display: 'Dancing Script', 'Pacifico', cursive;
}

[data-theme="dark"] {
  --primary:       #e84060;
  --primary-dark:  #ff6080;
  --primary-light: #2d1015;
  --gold:          #F5A623;
  --gold-light:    #2d2210;

  --bg:      #120808;
  --surface: #1e0e0e;
  --border:  #3d2020;

  --text:       #fdf0f0;
  --text-muted: #c49898;

  --skeleton:          #2a1212;
  --shimmer-mid:       #3d1e1e;
  --shimmer-gold-tint: #2d1e0a;
}

/* ══════════════════════════════════════
   Reset & Base
══════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background .25s, color .25s;
}

/* ── Arabic elements: Cairo font, RTL direction (excluding html/body roots) ── */
[lang="ar"]:not(html):not(body),
.ar,
.brand-ar,
.hero-ar,
.item-name-ar,
.daqqah-title [lang="ar"],
.hero-ar-text {
  font-family: var(--font-arabic);
  unicode-bidi: embed;
}

/* ── English display / script text: Dancing Script ── */
.en-display,
.hero-en,
.brand-en,
.script {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: .01em;
}

a { color: inherit; }
input, button, textarea, select { font-family: inherit; }

/* ══════════════════════════════════════
   Shimmer / Skeleton animation
══════════════════════════════════════ */
@keyframes shimmer {
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
}

/* Branded shimmer: subtle red → near-white → gold-tint wave */
.shimmer {
  background: linear-gradient(
    90deg,
    var(--skeleton)          0%,
    var(--shimmer-mid)      30%,
    var(--shimmer-gold-tint) 50%,
    var(--shimmer-mid)      70%,
    var(--skeleton)         100%
  );
  background-size: 300% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
  border-radius: 8px;
}

/* ══════════════════════════════════════
   Scrollbar
══════════════════════════════════════ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ══════════════════════════════════════
   Focus visible (global)
══════════════════════════════════════ */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
</style>
