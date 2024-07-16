import { createEvent, restore } from "effector";

declare module 'styled-components' {
  export interface DefaultTheme {
    main: string;
    white: string;
    text: string;
    titleBlue: string;
    titleDesc: string;
    mappedCountry: string;
    grey60: string;
    bottomBorder: string;
    schoolId: string;
    schoolListBack: string;
    searchSchoolBorder: string;
    notFoundRed: string;
    graphWeekMonthBorder: string;
    skeleton: string;
    skeletonHighlight: string;
    gigaButtonBack: string;
  }
}

export enum ThemeType {
  dark = 'dark',
  light = 'light',
  accessible = 'accessible'
}

export const gigaThemeList = [ThemeType.dark, ThemeType.light, ThemeType.accessible] as const

export const setTheme = createEvent<ThemeType>()
export const $theme = restore(setTheme, ThemeType.dark);

export const themeData = {
  [ThemeType.dark]: {
    main: '#181818',
    text: "#fff",
    white: "#fff",
    titleBlue: "#277AFF",
    titleDesc: "#9E9E9E",
    iconSecondary: '#fff',
    mappedCountry: "#C6C6C6",
    grey60: "#7E7E7E",
    textTertiary: '#6F6F6F',
    bottomBorder: "#C8C8C8",
    schoolId: "#6F6F6F",
    schoolListBack: "#383838",
    gigaButtonBack: "#383838",
    searchSchoolBorder: "#C7C7C7",
    notFoundRed: "#F94B4B",
    graphWeekMonthBorder: "#474747",
    skeleton: "#353535",
    skeletonHighlight: "#494949",
  },
  [ThemeType.light]: {
    main: '#fff',
    text: "#222222",
    white: "#fff",
    titleBlue: "#277AFF",
    titleDesc: "#474747",
    iconSecondary: '#595959',
    textTertiary: '#6F6F6F',
    mappedCountry: "#C6C6C6",
    grey60: "#7E7E7E",
    bottomBorder: "#E0E0E0",
    schoolId: "#6F6F6F",
    schoolListBack: "#cdcdcd",
    gigaButtonBack: "#fff",
    searchSchoolBorder: "#C7C7C7",
    notFoundRed: "#F94B4B",
    graphWeekMonthBorder: "#b3abab",
    skeleton: "#ededed",
    skeletonHighlight: "#c1c1c1",
  },
  [ThemeType.accessible]: {
    main: '#181818',
    text: "#fff",
    white: "#fff",
    titleBlue: "#277AFF",
    titleDesc: "#9E9E9E",
    iconSecondary: '#fff',
    mappedCountry: "#C6C6C6",
    textTertiary: '#6F6F6F',
    grey60: "#7E7E7E",
    bottomBorder: "#E0E0E0",
    schoolId: "#6F6F6F",
    schoolListBack: "#383838",
    gigaButtonBack: "#383838",
    searchSchoolBorder: "#C7C7C7",
    notFoundRed: "#F94B4B",
    graphWeekMonthBorder: "#474747",
    skeleton: "#353535",
    skeletonHighlight: "#494949",
  }
}



