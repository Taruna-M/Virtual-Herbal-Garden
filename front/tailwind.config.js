// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Only scan df.css and any components that use its styles
    "./src/Components/df.css",
    // If you have any JS files using Tailwind classes, include them:
    "./src/Components/**/*.{js,jsx}" 
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'),
  ],
}