// Support imports
import '@carbon/react';

declare module '*.jpg' {
  const url: string;
  // noinspection all
  export default url;
}
declare module '*.png' {
  const url: string;
  // noinspection all
  export default url;
}
declare module '*.gif' {
  const url: string;
  // noinspection all
  export default url;
}
declare module '*.woff2' {
  const url: string;
  // noinspection all
  export default url;
}
declare module '*.svg' {
  import { ComponentType } from 'react';

  const Component: ComponentType<Record<string, unknown>>;
  // noinspection all
  export default Component;
}
declare module '*.css';

// global.d.ts
declare namespace NodeJS {
  interface Process {
    env: {
      API_MAPBOX_ACCESS_TOKEN: string;
      API_BASE_URL: string;
      NODE_ENV: string;
      ENV: string;
      WEBPACK_DEV_SERVER: string;
      B2C_CLIENT_ID: string;
    };

  }
}

declare module 'webfontloader' {
  interface WebFontConfig {
    google?: {
      families: string[];
    };
    custom?: {
      families: string[];
      urls: string[];
    };
    // Add other configuration properties as needed
  }

  const WebFont: {
    load: (config: WebFontConfig) => void;
  };

  export default WebFont;
}

declare module '@carbon/react' {
  export interface PaginationNavProps {
    // Define the props you expect PaginationNav to have
    page?: number;
    totalItems?: number;
    itemsPerPage?: number;
    onChange?: (page: number) => void;
    // Add any other props you need
  }

  export const PaginationNav: React.FC<PaginationNavProps>;

  export interface IconButtonProps {
    children?: React.ReactNode;
    iconDescription?: string;
    align?: string;
    disabled?: boolean;
    className?: string;
    label: string;
    type?: string;
    renderIcon?: (props: IconButtonProps) => React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    kind?: 'primary' | 'secondary' | 'tertiary' | "ghost";
    size?: 'sm' | 'md' | 'lg';
    tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
    tooltipAlignment?: 'start' | 'center' | 'end';
    tooltipText?: string;
  }

  export const IconButton: React.FC<IconButtonProps>;

  export const InlineLoading = React.FC<any>

  export const OverflowMenu = React.FC<any>
}

