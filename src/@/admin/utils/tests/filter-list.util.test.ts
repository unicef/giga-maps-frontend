import { cleanOptionFields } from '../filter-list.util';

describe('cleanOptionFields', () => {
  it('should clean fields for DROPDOWN type', () => {
    const options = {
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Select',
      range_auto_compute: true,
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    };

    const result = cleanOptionFields(options, 'DROPDOWN');

    expect(result).toEqual({
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Select'
    });
  });

  it('should clean fields for DROPDOWN_MULTISELECT type', () => {
    const options = {
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Select',
      range_auto_compute: true,
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    };

    const result = cleanOptionFields(options, 'DROPDOWN_MULTISELECT');

    expect(result).toEqual({
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Select'
    });
  });

  it('should clean fields for RANGE type', () => {
    const options = {
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Select',
      range_auto_compute: true,
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    };

    const result = cleanOptionFields(options, 'RANGE');

    expect(result).toEqual({
      range_auto_compute: true,
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    });
  });

  it('should clean fields for INPUT type', () => {
    const options = {
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Type here',
      range_auto_compute: true,
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    };

    const result = cleanOptionFields(options, 'INPUT');

    expect(result).toEqual({
      placeholder: 'Type here'
    });
  });

  it('should clean fields for BOOLEAN type', () => {
    const options = {
      choices: ['option1', 'option2'],
      live_choices: true,
      placeholder: 'Select',
      range_auto_compute: true,
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    };

    const result = cleanOptionFields(options, 'BOOLEAN');

    expect(result).toEqual({
      placeholder: 'Select'
    });
  });

  it('should handle empty options object', () => {
    const options = {};
    const result = cleanOptionFields(options, 'INPUT');
    expect(result).toEqual({});
  });
});
