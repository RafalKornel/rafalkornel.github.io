import {
  createH2Plugin,
  createHeadingStyle,
  createLinkPlugin,
  createRegularMediumPlugin,
  createRegularPlugin,
  createSPlugin,
  createSub2Plugin,
  createSub3Plugin,
  createSubheadingPlugin,
  createXSPlugin,
} from "./src/styles/typography";
import { colors } from "./src/styles/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors,
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans"], // Define the Montserrat font here
      },
    },
  },
  plugins: [
    createHeadingStyle,
    createH2Plugin,
    createSubheadingPlugin,
    createSub2Plugin,
    createSub3Plugin,
    createRegularPlugin,
    createRegularMediumPlugin,
    createSPlugin,
    createXSPlugin,
    createLinkPlugin,
  ],
};
