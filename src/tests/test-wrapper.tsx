import "~/core/init"
import { ReactNode } from "react"
import { ThemeProvider } from "styled-components"
import { themeData } from "~/core/theme.model"

export const testWrapper = (component: ReactNode) => {
  return <ThemeProvider theme={themeData.dark}>
    {component}
  </ThemeProvider>
}