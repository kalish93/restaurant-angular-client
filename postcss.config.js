module.exports = {
  plugins: {
    'tailwindcss/postcss': {
      // Configuration for Tailwind CSS v4
      // You can add your content paths, theme, and plugins here.
      // This replaces the old tailwind.config.js file.
      content: [
        './src/**/*.{html,ts,scss}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    },
    autoprefixer: {},
  },
};