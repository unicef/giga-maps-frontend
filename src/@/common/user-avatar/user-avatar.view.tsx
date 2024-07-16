import { UserAvatarIcon, UserAvatarWrapper, UserNameWrapper } from "./user-avatar.style";

export default function UserAvatar({ userName }: { userName: string; }) {
  const shortName = userName?.split(' ').map((name) => name[0]).join('');

  return (
    <UserAvatarWrapper>
      <UserAvatarIcon>
        {shortName}
      </UserAvatarIcon>
      <UserNameWrapper>
        <span>{userName}</span>
      </UserNameWrapper>
    </UserAvatarWrapper>
  )
}