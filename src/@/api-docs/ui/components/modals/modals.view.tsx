import ApiCreatedSuccessModal from "./api-created-success-modal-view";
import DownloadApiKeyModal from "./download-api-key-modal.view";
import DownloadDataModal from "./download-data-modal/download-data-modal.view";
import ReuestApiKeyPopup from "./request-api-key-popup";
import RequestExtensionModal from "./request-extension-modal";


export default function Modals() {

    return <>
        <DownloadApiKeyModal />
        <DownloadDataModal />
        <ApiCreatedSuccessModal />
        <RequestExtensionModal />
        <ReuestApiKeyPopup />
    </>
}