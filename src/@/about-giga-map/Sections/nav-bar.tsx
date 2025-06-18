import { ArrowRight, Close, Menu } from '@carbon/icons-react'
import { Button, Link, IconButton } from '@carbon/react'

import { aboutus } from '~/core/routes'

import { AboutGigaMapNavBarStyle, NavBarButton, NavBarButtonWrapper, NavBarGigaLogo } from '../styles/about-giga-map-styles'
import { Link as RouterLink } from '~/lib/router'
import { AboutType } from '../about.type'
import { useStore } from 'effector-react'
import { $activeNav, setActiveNav } from '../about.model'
import { useEffect, useMemo, useState } from 'react'
import { $isMobile } from '~/core/media-query'
import MobileNavBar from './mobile-nav-bar'

const NavBar = ({ data }: { data?: AboutType | null }) => {
  const activeNav = useStore($activeNav);
  const [isMenu, setIsMenu] = useState(false);
  const isMobile = useStore($isMobile);
  const navData = useMemo(() => {
    if (!data?.content) return [];
    return data.content.map(item => ({
      ...item,
      targetList: item?.target?.split(',') ?? [],
    }))
  }, [data?.content]);

  const handleHashChange = () => {
    const hash = window.location.hash.substring(1); // Remove leading '#'
    const targetElement = document.getElementById(hash);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const items = navData.map(item => item?.target?.split(',')?.map(item => `#${item}`)?.join(',') ?? '').join(', ');
    if (!navData || !items) return;
    const sections = document.querySelectorAll(items);
    function checkFocus() {
      let active = ''
      sections?.forEach(section => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= (window.innerHeight / 4) && rect.bottom >= 0) {
          active = section.getAttribute('id') ?? '';
        }
      });
      setActiveNav(active);
    }
    checkFocus();
    handleHashChange();
    window.addEventListener('scroll', checkFocus);
    return () => window.removeEventListener('scroll', checkFocus);
  }, [navData]);

  if (!data) return null;
  const { cta, content } = data;
  console.log(isMobile, 'isMobile==')
  return (
    <AboutGigaMapNavBarStyle>
      <div className="navbar-content">
        {isMobile && isMenu && <MobileNavBar navData={navData} setIsMenu={setIsMenu} />}
        {isMobile && <IconButton
          label={isMenu ? "Close" : "Menu"}
          onClick={() => {
            setIsMenu(!isMenu);
          }}
          size="md"
          align="bottom"
          iconDescription='Menu Icon'
          kind="ghost"
          className="sidebar-menuIcon"
        >
          {isMenu ? <Close size={18} /> : <Menu size={18} />}
        </IconButton>}
        <RouterLink to={aboutus}>
          <NavBarGigaLogo data-testid="nav-bar-logo" $size={isMobile ? '1.1rem' : '1.5rem'} dangerouslySetInnerHTML={{ __html: content?.[0]?.logo }} >
            {/* <img src={image as string} alt="giga logo" /> */}
          </NavBarGigaLogo>
        </RouterLink>
        <NavBarButtonWrapper>
          {
            !isMobile && navData?.map((navItem, index) => (
              <NavBarButton $active={navItem?.targetList?.includes(activeNav)} key={`${index}-${navItem?.title}`}>
                <RouterLink to={aboutus} onClick={() => setActiveNav(navItem?.target)} hash={navItem?.target} >
                  {navItem?.name}
                </RouterLink>
              </NavBarButton>
            ))
          }
          <Link href={cta?.link?.[0]} target="_blank">
            <Button kind='ghost'
              renderIcon={ArrowRight}>
              {cta?.text?.[0]}
            </Button>
          </Link>
        </NavBarButtonWrapper>
      </div>
    </AboutGigaMapNavBarStyle >
  )
}

export default NavBar