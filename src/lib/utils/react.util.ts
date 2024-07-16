import { Ref, useImperativeHandle } from "react";


export const imperativeHandle = (ref: Ref<unknown>, apply: () => void) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useImperativeHandle(ref, () => {
    return {
      apply
    };
  }, [apply]);
}