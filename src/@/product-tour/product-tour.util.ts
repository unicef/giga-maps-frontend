import { ObjectType } from "~/core/global-types";
import { onShowLegend, onShowThemeLayer } from "../sidebar/sidebar.model";

export const clickElement = (target: string) => {
  const element = document.querySelector(target) as HTMLElement;
  if (element) {
    element.click();
  }
}

export const getTourData = ({ isMobile }: { isMobile: boolean }) => [
  {
    stepId: 1,
    substeps: [
      {
        subStepId: 1,
        popupProps: {
          content: [{
            type: 'text',
            value: 'on-the-map-view-areas-and-schools'
          }],
          description:
            'on-the-map-explore-specific-areas-and-schools',
          actionItem: '',
          title: 'Map navigation',
          style: {
            transform: 'translateY(-5.625rem)'
          }
        },
        highlightBox: {
          search: '.center-pointer',
          style: {
            boxShadow: 'none'
          }
        },
        nextButton: false,
      },
      {
        subStepId: 2,
        popupOptions: {
          align: isMobile ? 'bottom' : 'left'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'every-country-has-dots-you-can-view-the-each-dot'
          }, {
            type: 'text',
            value: 'blinking-dots-real-time-connectivity-layer'
          }],
          title: 'Map legend',
          style: {}
        },
        highlightBox: {
          search: '.legend-info-popover-content',
          trigger: async () => {
            // show legend
            onShowLegend(true);
            if (!isMobile) {
              onShowThemeLayer(false)
            }
          },
          style: {}
        },
        nextButton: true,
      },
      {
        subStepId: 3,
        popupOptions: {
          align: 'left'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'you-can-customize-themes-layers-button'
          }, {
            type: 'text',
            value: 'switch-between-certain-layers'
          }],
          title: 'Map themes & layers',
          style: {}
        },
        highlightBox: {
          search: isMobile ? '.theme-wrapper-popup' : '.theme-layer-popover-content',
          trigger: async () => {
            // show themes & layers
            onShowLegend(false);
            if (!isMobile) {
              onShowThemeLayer(true)
            }
          },
          style: {}
        },
        nextButton: true,
      },
      {
        subStepId: 4,
        popupOptions: {
          align: isMobile ? 'bottom-right' : 'right-top'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'you-can-also-search-in-sidebar'
          },
          {
            type: 'clone',
            value: '.main-search-list'
          },
          {
            type: 'text',
            value: 'or-type-your-search-panel'
          },
          {
            type: 'clone',
            value: isMobile ? '.search-icon' : '.sidebar-searchbox'
          },],
          title: 'select-search',

          style: {}
        },
        highlightBox: {
          search: '.top-search-bar',//---here update class
          trigger: () => {
            // hide themes & layers
            if (!isMobile) {
              onShowThemeLayer(false)
            }
          },
        },
        nextButton: true,
      },
      {
        subStepId: 5,
        popupOptions: {
          align: isMobile ? 'top' : 'right-top'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'the-side-panel-selected-layers'
          }, {
            type: 'text',
            value: 'you-can-view-filter-on-date-and-type'
          }],
          title: 'data-panel',
          style: {}
        },
        highlightBox: {
          search: '.sidebar',
        },
        nextButton: true,
      },
      {
        subStepId: 6,
        popupOptions: {
          align: isMobile ? 'top' : 'right-bottom'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'gigamaps-has-several-overlay'
          }, {
            type: 'text',
            value: 'by-default-the-connectivity-layer'
          }],
          title: 'giga-layers',
          style: {}
        },
        highlightBox: {
          search: '.sidebar-footer-gigalayer-container',
        },
        nextButton: true,
      },
      {
        subStepId: 7,
        popupOptions: {
          align: isMobile ? 'bottom-left' : 'right-top'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'you-can-find-giga-maps'
          }, {
            type: 'text',
            value: 'you-can-open-source-api-pages'
          }],
          title: 'resources',
          style: {},
        },
        highlightBox: {
          search: '.sidebar-menuIcon',
        },
        nextButton: true,
      }
    ],
  },

];


export const getTourBoxStyle = (highlightBox: { search: string; style: any; trigger?: () => void; }) => {
  let position = {} as ObjectType;
  const items = [] as ObjectType[];
  if (highlightBox) {
    document.querySelectorAll(highlightBox.search).forEach((elm, i) => {
      const { top, left, width, height } = elm.getBoundingClientRect();
      if (i === 0) {
        position = { top, left }
      }
      items.push({
        width: width + 'px',
        height: height + 'px'
      })
    })
  }
  return {
    items,
    position
  }
}