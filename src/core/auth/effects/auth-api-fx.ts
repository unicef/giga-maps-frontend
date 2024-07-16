import { createEffect } from "effector";

import { UserInfoType } from "../types/user.type";
import { createRequestAuthFx } from "./common.fx";

export const getUserDetailFx = createEffect(() => {
  return createRequestAuthFx({
    url: 'auth/user_details/?force=true'
  }) as Promise<UserInfoType>
})
