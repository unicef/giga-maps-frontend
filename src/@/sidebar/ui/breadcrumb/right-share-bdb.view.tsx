import { useCallback, useState } from "react";

import ShareButton from "../common-components/share-button";
import ShareURLModal from "../common-components/share-url-modal";

const RightShareBDB = () => {
  const [shareModalOpen, setshareModalOpen] = useState<boolean>(false);

  const handleShareClicked = useCallback(() => {
    setshareModalOpen(!shareModalOpen)
  }, [shareModalOpen])

  return <>
    <ShareButton handleShareClicked={handleShareClicked} />
    <ShareURLModal shareModalOpen={shareModalOpen} setshareModalOpen={setshareModalOpen}
      currentLink={window.location.href}
    />
  </>
}

export default RightShareBDB;