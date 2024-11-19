import { checkForChangeFields } from '../common.util';

describe('checkForChangeFields', () => {
  it('should return empty object if either input is null/undefined', () => {
    expect(checkForChangeFields(null, {})).toEqual({});
    expect(checkForChangeFields({}, null)).toEqual({});
    expect(checkForChangeFields(undefined, {})).toEqual({});
  });

  it('should detect changed fields between objects', () => {
    const currentData = {
      name: 'New Name',
      age: 30,
      email: 'test@test.com'
    };

    const oldData = {
      name: 'Old Name',
      age: 30,
      email: 'test@test.com'
    };

    const result = checkForChangeFields(currentData, oldData);
    expect(result).toEqual({ name: 'New Name' });
  });

  it('should handle empty objects', () => {
    const result = checkForChangeFields({}, {});
    expect(result).toEqual({});
  });

  it('should handle objects with different properties', () => {
    const currentData = {
      name: 'Test',
      age: 25
    };

    const oldData = {
      email: 'test@test.com'
    };

    const result = checkForChangeFields(currentData, oldData);
    expect(result).toEqual({
      name: 'Test',
      age: 25
    });
  });

  it('should handle objects with null values', () => {
    const currentData = {
      name: null,
      age: 30
    };

    const oldData = {
      name: 'Test',
      age: 30
    };

    const result = checkForChangeFields(currentData, oldData);
    expect(result).toEqual({ name: null });
  });
});
