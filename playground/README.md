# Playground - MultiCoin SDK

Playground untuk testing SDK secara lokal.

## Setup

```bash
# Install dependencies
npm install
# atau
pnpm install
```

## Menjalankan

```bash
npm run dev
```

## Import Styles

Playground menggunakan alias ke source SDK, jadi untuk import styles:

**Option 1: Import langsung dari source (Recommended untuk playground)**
```tsx
import "../src/styles/tailwind.css";
```

**Option 2: Menggunakan alias (jika alias sudah dikonfigurasi)**
```tsx
import "multicoyn-sdk/styles";
```

## Troubleshooting

### Error: Failed to resolve import "multicoyn-sdk/styles"

Jika mendapat error ini, gunakan import langsung:
```tsx
import "../src/styles/tailwind.css";
```

### Styles tidak muncul

1. Pastikan PostCSS config ada di `playground/postcss.config.js`
2. Pastikan Tailwind config ada di `playground/tailwind.config.js`
3. Pastikan dependencies terinstall: `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/postcss`
4. Restart dev server setelah install dependencies




