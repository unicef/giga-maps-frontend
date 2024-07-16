import { Event, sample, Store } from 'effector';
// Effector helpers
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createEvent, restore } from "effector";

export const getVoid = (payload?: unknown): void => undefined;
export const getInverted = (payload: unknown): boolean => !payload;
export const setBoolean = (state: unknown, value: unknown): boolean =>
  Boolean(value);
export const setTrue = (state?: unknown, payload?: unknown): true => true;
export const setFalse = (state?: unknown, payload?: unknown): false => false;
export const setNull = (state?: unknown, payload?: unknown): null => null;
export const setPayload = <Payload = unknown>(
  state: unknown,
  payload: Payload
): Payload => payload;

export const setPayloadResults = <Payload = {
  results: unknown
}>(
  state: unknown,
  payload: { results: Payload }
): Payload => payload.results;

export const setPayloadFirst = <T>(
  state: T,
  payload: { results: T[] }
): T | null => payload?.results ? payload?.results[0] : null

export const debounce = <T>(
  $input: Store<T>, {
    timeout
  }: { timeout: number; }
) => {
  const udpateDebounceValue = createEvent<T>();
  let timer: ReturnType<typeof setTimeout>;
  const debounceValue = restore(udpateDebounceValue, $input.getState());
  $input.watch((value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      udpateDebounceValue(value)
    }, timeout)
  })
  return debounceValue;
}

export const timeoutStore = <T>({ clock, target, timeout = 4000, resetState = null }: { clock: Store<T> | Event<T>, target: Event<T>, timeout?: number, resetState?: any }) => {
  let timer: ReturnType<typeof setTimeout>;
  sample({
    clock,
    fn: () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        target(resetState)
      }, timeout)
    }
  })
}