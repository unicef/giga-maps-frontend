import { ServerErrorType } from "~/lib/request/types";

export const errorToasterHandler = (errorResponse: unknown) => {
  const error = errorResponse as ServerErrorType;
  let response = error?.response.data;
  let defaultMessage = 'Something went wrong. Please try again';
  let message: string | undefined;
  if (Array.isArray(response)) {
    response = response[0];
  }
  if (typeof response === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    message = Object.values(response)[0];
    if (Array.isArray(message)) {
      message = message[0];
    }
  } else if (typeof response === 'string') {
    message = response;
  }
  if (typeof message !== 'string') {
    message = defaultMessage;
  }
  return ({
    title: 'Validation error:',
    subtitle: message,
    kind: 'error',
  })
}

export const errorToastFilter = (errorResponse: unknown) => {
  const error = errorResponse as ServerErrorType;
  return error && error.response;
}