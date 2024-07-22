import { useCallback, useState } from "react";

import ShareButton from "../common-components/share-button";
import ShareURLModal from "../common-components/share-url-modal";

const RightShareBDB = () => {
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  const handleShareClicked = useCallback(() => {
    setShareModalOpen(!shareModalOpen)
  }, [shareModalOpen])

  return <>
    <ShareButton handleShareClicked={handleShareClicked} />
    <ShareURLModal shareModalOpen={shareModalOpen} setshareModalOpen={setShareModalOpen}
      currentLink={window.location.href}
    />
  </>
}

export default RightShareBDB;