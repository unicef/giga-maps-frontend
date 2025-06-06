import "~/core/init"
import { ReactNode } from "react"
import { ThemeProvider } from "styled-components"
import { themeData } from "~/core/theme.model"
import "~/core/i18n/instance"

export const testWrapper = (component: ReactNode) => {
  return <ThemeProvider theme={themeData.dark}>
    {component}
  </ThemeProvider>
}