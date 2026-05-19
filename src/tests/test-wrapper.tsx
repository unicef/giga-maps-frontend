import "~/core/init"
import { ReactNode } from "react"
import { ThemeProvider } from "styled-components"
import { themeData } from "~/core/theme.model"
import { TooltipProvider } from "~/components/ui/tooltip"

export const testWrapper = (component: ReactNode) => {
  return <ThemeProvider theme={themeData.dark}>
    <TooltipProvider>
      {component}
    </TooltipProvider>
  </ThemeProvider>
}