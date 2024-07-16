import { ObjectType } from "~/core/global-types";
import { waitFor } from "~/lib/utils";
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
            value: 'On the map view you can navigate between different countries and zoom in to explore specific areas and schools.'
          }],
          description:
            'On the map view you can navigate between different countries and zoom in to explore specific areas and schools.',
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
            value: 'Every country has dots. Each dot represents a mapped school. In this legend panel you can view the different colors of each dot.'
          }, {
            type: 'text',
            value: 'Blinking dots represent schools showing real-time connectivity. (real time connectivity layer)'
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
          align: isMobile ? 'left' : 'left'
        },
        popupProps: {
          content: [{
            type: 'text',
            value: 'You can customize how you want to view the map by clicking the themes & layers button:'
          }, {
            type: 'text',
            value: 'Switch between themes and turn on/off certain layers.'
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
            value: 'You can also search for a specific country,region or school using search in sidebar.'
          },
          {
            type: 'clone',
            value: '.main-search-list'
          },
          {
            type: 'text',
            value: 'or type your text by clicking inside the search panel.'
          },
          {
            type: 'clone',
            value: isMobile ? '.search-icon' : '.sidebar-searchbox'
          },],
          title: 'Select & search ',

          style: {}
        },
        highlightBox: {
          search: isMobile ? '.top-search-bar' : '.top-search-bar',//---here update class
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
            value: 'The side panel shows the data that each country, region or school has based on the selected layers.'
          }, {
            type: 'text',
            value: 'You can view, filter and share different data inputs based on date and type.'
          }],
          title: 'Data panel',
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
            value: 'Gigamaps has several layers you can select, view and overlay.'
          }, {
            type: 'text',
            value: 'By default the connectivity status base layer is selected along with the real-time connectivity layer.'
          }],
          title: 'Giga layers',
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
            value: 'You can find out more info about Giga and Giga maps.'
          }, {
            type: 'text',
            value: 'You can also go to our open-source Api pages.'
          }],
          title: 'Resources',
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