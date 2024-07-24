import { errorToasterHandler } from "../utils";

describe('errorToasterHandler', () => {
  it('should return default message if error response is undefined', () => {
    const errorResponse = undefined;
    const result = errorToasterHandler(errorResponse);
    expect(result.title).toEqual('Validation error:');
    expect(result.subtitle).toEqual('Something went wrong. Please try again');
    expect(result.kind).toEqual('error');
  });

  it('should extract message from error response object', () => {
    const errorResponse = {
      response: {
        data: {
          field: ['Error message 1', 'Error message 2']
        }
      }
    };
    const result = errorToasterHandler(errorResponse);
    expect(result.title).toEqual('Validation error:');
    expect(result.subtitle).toEqual('Error message 1');
    expect(result.kind).toEqual('error');
  });

  it('should handle response as string', () => {
    const errorResponse = {
      response: {
        data: 'Error message'
      }
    };
    const result = errorToasterHandler(errorResponse);
    expect(result.title).toEqual('Validation error:');
    expect(result.subtitle).toEqual('Error message');
    expect(result.kind).toEqual('error');
  });

  it('should handle response as array of strings', () => {
    const errorResponse = {
      response: {
        data: ['Error message 1', 'Error message 2']
      }
    };
    const result = errorToasterHandler(errorResponse);
    expect(result.title).toEqual('Validation error:');
    expect(result.subtitle).toEqual('Error message 1');
    expect(result.kind).toEqual('error');
  });

  it('should handle unexpected response types with default message', () => {
    const errorResponse = {
      response: {
        data: 123
      }
    };
    const result = errorToasterHandler(errorResponse);
    expect(result.title).toEqual('Validation error:');
    expect(result.subtitle).toEqual('Something went wrong. Please try again');
    expect(result.kind).toEqual('error');
  });
});
