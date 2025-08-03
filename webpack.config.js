// webpack.config.js

const autoprefixer = require('autoprefixer');
const postcssScss = require('postcss-scss');
const tailwindcss = require('tailwindcss/postcss');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                syntax: postcssScss,
                plugins: [
                  tailwindcss({
                    content: [
                      './src/**/*.{html,ts,scss}',
                    ],
                    theme: {
                      extend: {},
                    },
                  }),
                  autoprefixer
                ]
              }
            }
          },
          'sass-loader',
        ],
      },
    ],
  },
};