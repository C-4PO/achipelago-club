/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        achipelago: {
          "primary": "#CC9D66",
          "secondary": "#191C26",
          "accent": "#126173",
          "neutral": "#fbedd7",
          "base-100": "#F2EEEB",
          "info": "#9DF7E5",
          "success": "#DAEFB3",
          "warning": "#E8AE68",
          "error": "#E63B2E",
          "ambient": "#111220",
        },
      },
      "dark",
      "light"
    ],
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography")
  ],
}

