import {
  CmsSection,
  findSection,
  hasLayerContent,
  isVideoUrl,
  resolveMedia,
  toCta,
  toFaqs,
  toFooter,
  toHeader,
  toHero,
  toIntro,
  toLayerSection,
  toLogos,
  toServices,
  toStories,
  toTestimonials,
} from '../landing.types';

// Shape taken from the live `about_us` payload.
const schoolLocation: CmsSection = {
  cta: {
    link: ['https://#/map'],
    text: ['Explore school location layer'],
  },
  id: 3,
  image: 'https://blob.example/school.png',
  status: true,
  text: [
    '2.1M schools location collected from 50+ countries.',
    'Locate schools through our open map',
  ],
  title: 'School Location',
  type: 'school-location',
};

describe('toLayerSection', () => {
  it('maps title to the eyebrow and text[1] to the heading', () => {
    const data = toLayerSection(schoolLocation);

    expect(data.eyebrow).toBe('School Location');
    expect(data.heading).toBe('Locate schools through our open map');
    expect(data.body).toBe(
      '2.1M schools location collected from 50+ countries.',
    );
    expect(data.ctaText).toBe('Explore school location layer');
    expect(data.ctaLink).toBe('https://#/map');
    expect(data.media).toBe('https://blob.example/school.png');
  });

  it('returns empty strings for a section with no content yet', () => {
    const data = toLayerSection({ id: 1, type: 'open-data-apis' });

    expect(data).toEqual({
      body: '',
      ctaLink: '',
      ctaText: '',
      eyebrow: '',
      heading: '',
      media: '',
    });
    expect(hasLayerContent(data)).toBe(false);
  });

  it('strips the U+2028 line separators the CMS stores', () => {
    const data = toLayerSection({
      id: 2,
      text: ['', 'Global School\u2028connectivity map'],
      type: 'school-location',
    });

    expect(data.heading).toBe('Global School connectivity map');
  });
});

describe('toHero', () => {
  it('uses title as the heading, unlike the layer sections', () => {
    const data = toHero({
      cta: { link: ['/map'], text: ['Explore Giga Maps'] },
      id: 4,
      image: 'https://blob.example/globe.png',
      text: ['Mapping school connectivity worldwide'],
      title: 'Giga Maps',
      type: 'live-map',
    });

    expect(data.heading).toBe('Giga Maps');
    expect(data.body).toBe('Mapping school connectivity worldwide');
    // Placeholder globe until the 3D asset lands.
    expect(data.media).toBe('https://blob.example/globe.png');
  });

  it('leaves the globe slot empty when the CMS has no image', () => {
    expect(toHero({ id: 4, type: 'live-map' }).media).toBe('');
  });
});

describe('toHeader', () => {
  it('splits the comma-joined target list into anchors', () => {
    const data = toHeader({
      content: [
        { name: 'About', target: 'live-map,school-location' },
        { name: 'FAQs', target: 'faqs' },
      ],
      cta: { link: ['/map'], text: ['Explore Giga Maps'] },
      id: 13,
      type: 'header',
    });

    expect(data.items).toEqual([
      { label: 'About', targets: ['live-map', 'school-location'] },
      { label: 'FAQs', targets: ['faqs'] },
    ]);
    expect(data.ctaLink).toBe('/map');
  });

  it('drops items with no label or no target', () => {
    const data = toHeader({
      content: [{ name: '', target: 'faqs' }, { name: 'Orphan' }],
      id: 13,
      type: 'header',
    });

    expect(data.items).toEqual([]);
  });

  it('tolerates a missing header section', () => {
    expect(toHeader(null).items).toEqual([]);
  });
});

describe('toTestimonials', () => {
  it('reads testimonials out of the misnamed gigamaps-enabled section', () => {
    const data = toTestimonials({
      content: [
        {
          image: 'https://blob.example/peris.png',
          text: ['Nonkoopir Primary School, Kenya', 'Gigamaps enabled the...'],
          title: 'Head Teacher Peris Gaturi',
        },
        { text: ['No quote here'], title: 'Incomplete' },
      ],
      id: 6,
      type: 'gigamaps-enabled',
    });

    expect(data).toEqual([
      {
        attribution: 'Nonkoopir Primary School, Kenya',
        avatar: 'https://blob.example/peris.png',
        name: 'Head Teacher Peris Gaturi',
        quote: 'Gigamaps enabled the...',
      },
    ]);
  });
});

describe('toFooter', () => {
  it('reads the footer content object rather than an array', () => {
    const data = toFooter({
      content: {
        footerLinks: [{ text: '<ul><li><a href="/map">Map</a></li></ul>' }],
        socialLinks: [{ text: '<a href="https://x.com"></a>' }, { text: '' }],
      },
      id: 12,
      text: ['Connect every school'],
      type: 'footer',
    });

    expect(data.tagline).toBe('Connect every school');
    expect(data.linkColumns).toHaveLength(1);
    expect(data.socialLinks).toHaveLength(1);
  });
});

describe('resolveMedia', () => {
  it('rewrites relative image paths using an absolute sibling as the base', () => {
    const [partners, hero] = resolveMedia([
      {
        content: [
          { image: 'images/a.png' },
          { image: 'https://blob.example/c/images/b.png' },
        ],
        id: 1,
        type: 'partners',
      },
      { id: 2, image: 'images/hero.png', type: 'live-map' },
    ]);

    const items = partners.content as { image?: string }[];
    expect(items[0].image).toBe('https://blob.example/c/images/a.png');
    expect(items[1].image).toBe('https://blob.example/c/images/b.png');
    expect(hero.image).toBe('https://blob.example/c/images/hero.png');
  });

  it('leaves the payload alone when nothing absolute is available', () => {
    const sections = [{ id: 1, image: 'images/a.png', type: 'partners' }];

    expect(resolveMedia(sections)[0].image).toBe('images/a.png');
  });

  it('does not touch the footer content object', () => {
    const [footer] = resolveMedia([
      { content: { logo: '<svg/>' }, id: 1, type: 'footer' },
      { id: 2, image: 'https://blob.example/c/images/x.png', type: 'live-map' },
    ]);

    expect(footer.content).toEqual({ logo: '<svg/>' });
  });
});

describe('Phase 2 adapters', () => {
  it('maps story items and keeps the per-item CTA link', () => {
    const stories = toStories({
      content: [
        {
          cta: { link: ['https://giga.global/story'] },
          image: 'https://blob.example/co.png',
          text: ['In Colombia, Giga mapped 7,000 schools.'],
          title: 'Colombia',
        },
        { text: [''] },
      ],
      id: 1,
      type: 'slides',
    });

    expect(stories).toHaveLength(1);
    expect(stories[0].title).toBe('Colombia');
    expect(stories[0].ctaLink).toBe('https://giga.global/story');
  });

  it('maps services and tolerates items without a link', () => {
    const services = toServices({
      content: [
        { cta: { link: ['docs/explore-api'] }, title: 'Data downloads & API' },
        { text: ['No title, dropped'] },
        { title: 'Open-source code' },
      ],
      id: 1,
      type: 'resources',
    });

    expect(services.map((s) => s.title)).toEqual([
      'Data downloads & API',
      'Open-source code',
    ]);
    expect(services[1].link).toBe('');
  });

  it('drops FAQs missing either side of the pair', () => {
    const faqs = toFaqs({
      content: [
        { text: ['Because it does.'], title: 'Why?' },
        { title: 'No answer' },
        { text: ['No question'] },
      ],
      id: 1,
      type: 'faqs',
    });

    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toBe('Why?');
  });

  it('keeps logos that have an image and drops the rest', () => {
    const logos = toLogos({
      content: [{ image: 'https://blob.example/a.png' }, {}],
      id: 1,
      type: 'partners',
    });

    expect(logos).toHaveLength(1);
  });

  it('pairs the closing CTA text and link arrays by index', () => {
    const cta = toCta({
      cta: {
        link: ['/about', '/map', '/orphan'],
        text: ['Get in touch', 'Explore Giga Maps'],
      },
      id: 1,
      text: ['An open & live global map', 'Whether you are a government...'],
      title: 'Ready to Connect the World?',
      type: 'live-map-get-in-touch',
    });

    expect(cta.heading).toBe('Ready to Connect the World?');
    expect(cta.note).toBe('Whether you are a government...');
    expect(cta.ctas).toEqual([
      { link: '/about', text: 'Get in touch' },
      { link: '/map', text: 'Explore Giga Maps' },
    ]);
  });

  it('reads the shared heading and subtitle', () => {
    expect(
      toIntro({ id: 1, text: ['Sub'], title: 'FAQs', type: 'faqs' }),
    ).toEqual({ heading: 'FAQs', subheading: 'Sub' });
    expect(toIntro(null)).toEqual({ heading: '', subheading: '' });
  });
});

describe('findSection', () => {
  const sections: CmsSection[] = [
    schoolLocation,
    { id: 9, status: false, title: 'Hidden', type: 'faqs' },
  ];

  it('finds a visible section by type', () => {
    expect(findSection(sections, 'school-location')?.id).toBe(3);
  });

  it('ignores unpublished sections and unknown types', () => {
    expect(findSection(sections, 'faqs')).toBeNull();
    expect(findSection(sections, 'open-data-apis')).toBeNull();
    expect(findSection(null, 'school-location')).toBeNull();
  });
});

describe('isVideoUrl', () => {
  it('spots the extensions the CMS now accepts', () => {
    expect(isVideoUrl('https://blob.example/images/a.mp4')).toBe(true);
    expect(isVideoUrl('https://blob.example/images/a.webm')).toBe(true);
    expect(isVideoUrl('https://blob.example/images/a.MP4?v=2')).toBe(true);
  });

  it('leaves stills alone', () => {
    expect(isVideoUrl('https://blob.example/images/a.png')).toBe(false);
    expect(isVideoUrl('https://blob.example/mp4-logo.svg')).toBe(false);
    expect(isVideoUrl('')).toBe(false);
  });
});
