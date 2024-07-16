import { SideNavItems } from "@carbon/react"
import { css } from "styled-components"
import { SideBarMenuList, MenuItem } from "~/@/common/menu-item-link/menu-item-link.style"
import { onChangeMenu } from "~/@/sidebar/sidebar.model"
import { setActiveNav } from "../about.model"
import { Link as RouterLink } from '~/lib/router'
import { aboutus } from "~/core/routes"

const SideBarMenuStyle = css`
    height: calc(100vh - 48px);
    left: 0;
  
`

export default function MobileNavBar({ navData, setIsMenu }: { navData: any; setIsMenu: (isOpen: boolean) => void }) {

  return <SideBarMenuList $style={SideBarMenuStyle}>
    <SideNavItems>
      {navData?.map((navItem, index) => (
        <RouterLink to={aboutus} onClick={() => {
          setIsMenu(false)
          setActiveNav(navItem?.target)
        }} hash={navItem?.target} key={index}>
          <MenuItem>
            {navItem?.name}
          </MenuItem>
        </RouterLink>))}
    </SideNavItems>
  </SideBarMenuList>
}