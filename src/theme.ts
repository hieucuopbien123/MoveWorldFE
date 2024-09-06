import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// EXP Frontend / Setup tailwind

const breakpoints = {
  sm: "30em",
  md: "52em",
  lg: "64em",
  xl: "80em",
};

// const breakpoints = {
//   sm: '576px',
//   md: '768px',
//   lg: '992px',
//   xl: '1200px',
//   '2xl': '1400px',
// }

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  semanticTokens: {
    colors: {
      _header: {
        _dark: "#272832",
        default: "#272832",
      },
      background: {
        default: "#fff",
        _dark: "#111827",
      },
      header: {
        default: "#ffff",
        _dark: "#111827f2",
      },
      primary: {
        _dark: "#10a3a3",
        _light: "#3cc9c9",
      },
      hoverCover: {
        _dark: "rgba(255,255,255,0.2)",
        _light: "rgba(0,0,0,0.2)",
      },
      pagination: {
        default: "#edf2f7",
        _dark: "#303744",
      },
      divider: {
        _dark: "#303744",
        default: "#b9bec7",
      },
      backgroundTop: {
        _dark: "#141b2a",
        default: "#f6f7f9",
      },
      text: {
        _light: "#000",
        _dark: "#ffffffa8",
      },
      cover: {
        _dark: "#161d2c",
        default: "#f6f7f9",
      },
      coveritem: {
        _dark: "#212834",
        default: "#f6f7f9",
      },
      backgroundBigText: {
        _dark: "#303744",
        default: "#bee3f8",
      },
      bright: {
        _dark: "#6b7280",
        default: "#bee3f8",
      },
      backgroundTab: {
        _dark: "#2d3748",
        default: "#f6f7f9",
      },
      dividerdash: {
        _dark: "#c6f6d533",
        default: "#80808021",
      },
      bioText: {
        _dark: "#ffffffa8",
        _light: "#808080",
      },
      hoverDark: {
        _dark: "#212e48",
        default: "#b9bec7",
      },
      topCollectionCard: {
        _dark: "#24243557",
        default: "#e8eaed",
      },
      hoverTable: {
        _dark: "#0D213F",
        _light: "rgba(0,0,0,0.15)",
      },
      tableHeader: {
        _dark: "#285E61",
        _light: "#808080",
      },
    },
  },
  colors: {
    white: "#fff",
    black: "#000",
  },
  breakpoints,
  config,
  components: {
    Divider: {
      baseStyle: {
        borderColor: "#747474",
      },
    },
  },
});

export default theme;
