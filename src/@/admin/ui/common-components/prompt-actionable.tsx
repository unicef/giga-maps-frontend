import { ActionableNotification, ActionableNotificationProps } from "@carbon/react";
import styled from "styled-components";

export const PropmptWrapper = styled.div<{ $style?: string; }>`
  position: fixed;
  z-index: 5;
  width: calc(100% - 17rem);
  ${props => props.$style}
`
export type PromptActionableType = { $style?: string, onActionDone?: () => void } & Partial<ActionableNotificationProps>
export default function PromptActionable({ $style, onActionButtonClick, onActionDone, ...otherProps }: PromptActionableType) {
  return (
    <PropmptWrapper $style={$style}>
      <ActionableNotification
        style={{ maxWidth: "100%" }}
        lowContrast
        inline
        title=""
        subtitle=""
        closeOnEscape
        actionButtonLabel="Yes"
        {...otherProps}
        onActionButtonClick={() => {
          onActionButtonClick?.()
          onActionDone?.()
        }}
      // onActionButtonClick={() => void deleteFilterData(apiKeyDeleteId)}
      // onClose={() => setApiKeyDeleteId(null)}
      />
    </PropmptWrapper>
  )
}