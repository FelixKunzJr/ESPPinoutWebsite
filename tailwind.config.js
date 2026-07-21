/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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

