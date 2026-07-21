/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // IBM Plex: an engineering type family that suits a tool built on
        // KiCad data. Sans carries the UI; Mono carries the technical labels
        // (pin names, GPIO numbers) so the data reads like schematic annotation.
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // Bumped one notch off the Tailwind defaults. Nearly every string in
      // the app chrome is text-xs, which at the stock 12px was reported as
      // hard to read; 13px keeps the layout dense while clearing the floor.
      // Body copy moves to text-sm, which lands on the 14px that was asked
      // for. The diagrams are unaffected - they size their labels in px.
      fontSize: {
        xs:   ['0.8125rem', { lineHeight: '1.15rem' }],  // 13px
        sm:   ['0.875rem',  { lineHeight: '1.3rem'  }],  // 14px
        base: ['1rem',      { lineHeight: '1.55rem' }],  // 16px
      },
    },
  },
  plugins: [],
}

