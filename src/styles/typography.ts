import type { PluginCreator } from "tailwindcss/types/config";

export const createHeadingStyle: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "h1, .heading": {
      fontFamily: theme("font.montserrat"),
      fontSize: "52px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
  });
};

// customTypography.js

export const createH2Plugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "h2, heading2": {
      fontFamily: theme("font.montserrat"),
      fontSize: "36px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
  });
};

export const createSubheadingPlugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "h3, subheading": {
      fontFamily: theme("font.montserrat"),
      fontSize: "24px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
    },
  });
};

export const createSub2Plugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "h4, subheading2": {
      fontFamily: theme("font.montserrat"),
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
    },
  });
};

export const createSub3Plugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "h5, subheading3": {
      fontFamily: theme("font.montserrat"),
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
  });
};

export const createRegularPlugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "p, text-regular": {
      fontFamily: theme("font.montserrat"),
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "normal",
    },
  });
};

export const createRegularMediumPlugin: PluginCreator = ({
  addBase,
  theme,
}) => {
  addBase({
    ".text-medium": {
      fontFamily: theme("font.montserrat"),
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
    },
  });
};

export const createSPlugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    ".text-s": {
      fontFamily: theme("font.montserrat"),
      fontSize: "10px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
    },
  });
};

export const createXSPlugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    ".text-xs": {
      fontFamily: theme("font.montserrat"),
      fontSize: "8px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
    },
  });
};

export const createLinkPlugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    "a, link": {
      fontFamily: theme("font.montserrat"),
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "normal",
    },
    "a:hover, link:hover": {
      textDecoration: "underline",
      textDecorationColor: theme("colors.accent"),
      cursor: "pointer",
    },
  });
};
