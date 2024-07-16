import { RefObject, useEffect } from 'react';

type ClickAnywhereProps = {
  container?: RefObject<HTMLDivElement>;
  trigger: boolean;
  insideClick?: () => void;
  outsideClick?: () => void;
  classList: string[];
};

const fallbackCallback = () => { };

const ClickAnywhere = (props: ClickAnywhereProps) => {
  const { container, trigger, insideClick = fallbackCallback, outsideClick = fallbackCallback, classList } = props;

  const checkContainer = (targetElement: HTMLElement) => {
    if (!container?.current) return true;
    return targetElement !== container.current && !container.current.contains(targetElement)
  }
  useEffect(() => {
    const callback = function (event: Event) {
      const targetElement = event.target as HTMLElement;
      // Check if the clicked element or any ancestor has the .sidebar-searchbox class
      const isClassFound = classList?.length && classList.some((className: string) => targetElement.classList.contains(className) || targetElement.closest(`.${className}`));
      if (!isClassFound && checkContainer(targetElement)) {
        outsideClick();
      } else {
        insideClick();
      }
    };
    setTimeout(() => {
      if (trigger) {
        document.addEventListener('click', callback);
      } else {
        document.removeEventListener('click', callback);
      }
    });

    return () => {
      document.removeEventListener('click', callback);
    };
  }, [trigger, insideClick, outsideClick, container, classList]);

  return null;
};

export default ClickAnywhere;
