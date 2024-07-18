import { Button, InlineLoading } from "@carbon/react";

import { ModalFooter } from "~/@/common/modal";

import { $modalFooterStyle } from "../modals.style";
import styled from "styled-components";

const Loading = styled(InlineLoading)`
  min-block-size: 1.1rem;
`
export function ModalFooterButtons({ onCancel, isLoading = false, loadingText = "Downloading..." }: { readonly onCancel: () => void, readonly isLoading?: boolean; readonly loadingText?: string }) {
  return (<ModalFooter $style={$modalFooterStyle} primaryButtonText="" secondaryButtonText="" >
    <Button
      kind="secondary"
      onClick={onCancel}>
      Cancel
    </Button>
    <Button
      type="submit"
      kind="primary"
      disabled={isLoading}
    >
      {isLoading ? <Loading small description={loadingText} />
        : 'Submit'}
    </Button>
  </ModalFooter >)
}