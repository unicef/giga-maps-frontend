import { AboutusFormType } from '../../types/about-us.type';
import { updateItemContentAndPath } from '../aboutus.util';

describe('updateItemContentAndPath', () => {

  beforeEach(() => {
    global.structuredClone = (val) => JSON.parse(JSON.stringify(val))
  })

  it('should update content items when path is content', () => {
    const originalState = [{
      type: 'section1',
      sectionName: 'Section 1',
      fields: [],
      content: {
        name: 'Content',
        path: 'content',
        allowNew: true,
        items: [
          { id: 1, type: 'item', fields: [] },
          { id: 2, type: 'item', fields: [] }
        ]
      }
    }];

    const result = updateItemContentAndPath(originalState, { type: 'section1', path: 'content' }, 3);

    expect(result[0]?.content?.items?.length).toBe(5);
  });
  it('should not modify state when type does not match', () => {
    const originalState = [{
      type: 'section1',
      sectionName: 'Section 1',
      fields: [{
        path: 'field1',
        items: [{ id: 1 }]
      }]
    }];

    const result = updateItemContentAndPath(originalState, { type: 'section2', path: 'field1' }, 2);

    expect(result).toEqual(originalState);
  });
  it('should handle empty fields array', () => {
    const originalState = [{
      type: 'section1',
      fields: []
    }];

    const result = updateItemContentAndPath(originalState, { type: 'section1', path: 'field1' }, 2);

    expect(result[0].fields).toEqual([]);
  });
});
