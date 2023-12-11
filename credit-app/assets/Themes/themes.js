import { palette } from "./palette";

export default Themes = {
  // Feel free to customize these!
  light: {
    bg: palette.orange,
    bgSecondary: palette.lightGreen,
    bgThird: palette.green,
    white: palette.white,
    black: palette.black,
    gray: palette.lightGray,
    text: palette.black,
    textSecondary: palette.white,
    statusBar: "dark-content",
    navigation: palette.black,
    shadows: {
      shadowColor: palette.black,
      shadowOpacity: 0.4,
      shadowRadius: 5,
      shadowOffset: { width: -1, height: 5 },
    },
  },
};
