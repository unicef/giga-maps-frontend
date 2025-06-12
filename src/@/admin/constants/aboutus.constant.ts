import { AboutusFormType } from "../types/about-us.type";

export enum AboutFormType {
  text = 'text',
  textarea = 'textarea',
  dropdownImage = 'dropdownImage',
  dropdownSectionTarget = 'dropdownSectionTarget',
  content = 'content'
}
const textType = ({ name, path }: { name: string; path: string }) => ({
  name,
  path,
  typeField: {
    type: AboutFormType.text,
    props: {}
  }
});

const textareaType = ({ name, path, props }: { name: string; path: string, props?: Record<string, any> }) => ({
  name,
  path,
  typeField: {
    type: AboutFormType.textarea,
    props: {
      rows: 2,
      ...props
    },
  }
});

const imageType = ({ name, path }: { name: string; path: string }) => ({
  name,
  path,
  typeField: {
    type: AboutFormType.dropdownImage,
    value: '',
    listType: 'image',
  }
})

const dropdownSection = ({ name, path }: { name: string; path: string }) => ({
  name,
  path,
  typeField: {
    type: AboutFormType.dropdownSectionTarget,
    value: '',
    listType: 'section-list',
  }
})

const getContentType = ({ name, path, ...others }: any) => ({
  name,
  path,
  typeField: {
    type: AboutFormType.content,
  },
  ...others
});

export const aboutUsFormList = [
  {
    sectionName: 'Header',
    type: 'header',
    fields: [
      textareaType({ name: 'Logo (svg)', path: 'content.0.logo' }),
      // imageType({ name: 'Logo', path: 'image' }),
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      textareaType({ name: 'Style', path: 'style' }),
    ],
    content: {
      name: 'Menu list',
      path: 'content',
      allowNew: false,
      items: [
        {
          type: 'menulist',
          fields: [
            textType({ name: 'Menu name', path: 'content.0.name' }),
            dropdownSection({ name: 'Select section target', path: 'content.0.target' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 1 - Live map',
    type: 'live-map',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textType({ name: 'Description', path: 'text.0' }),
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      imageType({ name: 'Image', path: 'image' }),
      textareaType({ name: 'Style', path: 'style' }),
    ]
  },
  {
    sectionName: 'Section 2 - School connected',
    type: 'school-connected',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      textareaType({ name: 'Style', path: 'style' }),
    ],
    content: {
      name: 'Content',
      path: 'content',
      allowNew: false,
      maxAllow: 3,
      items: [
        {
          type: 'info',
          fields: [
            textareaType({ name: 'Icon', path: 'content.0.image' }),
            textType({ name: 'Description', path: 'content.0.text.0' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 3 - School location',
    type: 'school-location',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textType({ name: 'Label', path: 'text.1' }),
      textType({ name: 'Description', path: 'text.0' }),
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      imageType({ name: 'Image', path: 'image' }),
      textareaType({ name: 'Style', path: 'style' }),
    ]
  },
  {
    sectionName: 'Section 4 - School connectivity',
    type: 'school-connectivity',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textType({ name: 'Label', path: 'text.1' }),
      textType({ name: 'Description', path: 'text.0' }),
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      imageType({ name: 'Image', path: 'image' }),
      textareaType({ name: 'Style', path: 'style' }),
    ]
  },
  {
    sectionName: 'Section 5 - Infrastructure',
    type: 'infrastructure',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textType({ name: 'Label', path: 'text.1' }),
      textType({ name: 'Description', path: 'text.0' }),
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      imageType({ name: 'Image', path: 'image' }),
      textareaType({ name: 'Style', path: 'style' }),
    ]
  },
  {
    sectionName: 'Section 6 - Testimonials (Gigamaps enabled)',
    type: 'gigamaps-enabled',
    fields: [
      textType({ name: 'Section Title', path: 'title' }),
      textareaType({ name: 'Style', path: 'style' }),
    ],
    content: {
      name: 'Testimonials',
      path: 'content',
      allowNew: true,
      items: [
        {
          type: 'testimonial',
          fields: [
            textType({ name: 'Person Name', path: 'content.0.title' }),
            textType({ name: 'Job Title & Organization', path: 'content.0.text.0' }),
            textareaType({ name: 'Testimonial Quote', path: 'content.0.text.1' }),
            imageType({ name: 'Person Photo', path: 'content.0.image' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 7 - Slides',
    type: 'slides',
    fields: [
      textType({ name: 'Cta text', path: 'cta.text.0' }),
      textType({ name: 'Cta link', path: 'cta.link.0' }),
      textareaType({ name: 'Style', path: 'style' }),
    ],
    content: {
      name: 'Content',
      path: 'content',
      allowNew: true,
      items: [
        {
          type: 'info',
          fields: [
            textType({ name: 'Title', path: 'content.0.title' }),
            textType({ name: 'Description', path: 'content.0.text.0' }),
            imageType({ name: 'Image', path: 'content.0.image' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 8 - Resources',
    type: 'resources',
    fields: [],
    content: {
      name: 'Content',
      path: 'content',
      allowNew: true,
      items: [
        {
          type: 'info',
          fields: [
            textType({ name: 'Title', path: 'content.0.title' }),
            textType({ name: 'Description', path: 'content.0.text.0' }),
            textType({ name: 'Cta link', path: 'content.0.cta.link.0' }),
            // imageType({ name: 'Image', path: 'content.0.image' }),
            textareaType({ name: 'Icon', path: 'content.0.icon' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 9 - Faqs',
    type: 'faqs',
    fields: [
      textType({ name: 'Title', path: 'title' }),
    ],
    content: {
      name: 'Content',
      path: 'content',
      allowNew: true,
      items: [
        {
          type: 'info',
          fields: [
            textType({ name: 'Title', path: 'content.0.title' }),
            textType({ name: 'Description', path: 'content.0.text.0' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 10 - Giga partners',
    type: 'partners',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textareaType({ name: 'Style', path: 'style' }),
    ],
    content: {
      name: 'Content',
      path: 'content',
      allowNew: true,
      items: [
        {
          type: 'info',
          fields: [
            imageType({ name: 'Image', path: 'content.0.image' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 11 - Acknowledgement',
    type: 'eleventh',
    fields: [
      textType({ name: 'Title', path: 'title' }),
      textareaType({ name: 'Style', path: 'style' }),
    ],
    content: {
      name: 'Content',
      path: 'content',
      allowNew: true,
      items: [
        {
          type: 'info',
          fields: [
            imageType({ name: 'Image', path: 'content.0.image' }),
            textareaType({ name: 'Style', path: 'content.0.style' }),
          ]
        }
      ]
    }
  },
  {
    sectionName: 'Section 12 - Live map - Get in touch',
    type: 'live-map-get-in-touch',
    fields: [
      // textType({ name: 'Title', path: 'title' }),
      // textType({ name: 'Description', path: 'text.0' }),
      textType({ name: 'Cta text 1', path: 'cta.text.0' }),
      textType({ name: 'Cta link 1', path: 'cta.link.0' }),
      // textType({ name: 'Cta text 2', path: 'cta.text.1' }),
      // textType({ name: 'Cta link 2', path: 'cta.link.1' }),
      // imageType({ name: 'Image', path: 'image' }),
      textareaType({ name: 'Style', path: 'style' }),
    ]
  },

  {
    sectionName: 'Footer',
    type: 'footer',
    fields: [
      textareaType({ name: 'Logo', path: 'content.logo' }),
      textType({ name: 'Tagline', path: 'text.0' }),
      textareaType({ name: 'Style', path: 'style' }),
      getContentType({
        name: 'Footer links',
        path: 'content.footerLinks',
        allowNew: false,
        items: [
          {
            type: 'list',
            fields: [
              textareaType({ name: 'HTML', path: 'content.footerLinks.0.text' }),
            ]
          }
        ]
      }),
      getContentType({
        name: 'Social links',
        path: 'content.socialLinks',
        allowNew: true,
        items: [
          {
            type: 'socialLinks',
            fields: [
              textareaType({ name: 'HTML', path: 'content.socialLinks.0.text' }),
            ]
          }
        ]
      }),
      textType({ name: 'Footer description', path: 'content.footerDescription' }),
      getContentType({
        name: 'Footer logo\'s',
        path: 'content.footerLogo',
        allowNew: true,
        items: [
          {
            type: 'footerLogo',
            fields: [
              textareaType({ name: 'HTML', path: 'content.footerLogo.0.text' }),
            ]
          }
        ]
      }),
    ],
  },

] as AboutusFormType[]

export const aboutUsFormType = aboutUsFormList.map(item => item.type);
export const defaultAboutUsList = aboutUsFormList.map(({ type }) => ({
  type,
  status: 1,
  order: 1,
})) as Record<string, string | number>[];
