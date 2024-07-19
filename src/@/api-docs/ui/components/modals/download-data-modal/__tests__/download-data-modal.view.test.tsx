import { render } from '@testing-library/react'
import DownloadDataModalView from '../download-data-modal.view'
import { getExploreApiListFx } from '~/@/api-docs/effects/explore-api-fx';
import { apiList } from '~/tests/data/explore-apis-list';
import { onDownloadDataPopup } from '~/@/api-docs/models';
import { setCurrentExploreApi } from '~/@/api-docs/models/explore-api.model';


describe('DownloadDataModalView', () => {

  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('/accounts/apis')) {
        return Promise.resolve(JSON.stringify(apiList))
      } else {
        return Promise.resolve(JSON.stringify(null))
      }
    });

  })
  test('renders Modal component', async () => {
    await getExploreApiListFx();
    const { asFragment } = render(<DownloadDataModalView />)
    expect(asFragment).toMatchSnapshot();
  })

  test('renders Modal component with show popup', async () => {
    await getExploreApiListFx();
    setCurrentExploreApi(1);
    onDownloadDataPopup(true);
    const { asFragment } = render(<DownloadDataModalView />)
    expect(asFragment).toMatchSnapshot();
  })

  // test('renders ModalHeader component', () => {
  //   render(<DownloadDataModalView isOpen={true} onClose={() => { }} />)
  //   expect(screen.getByTestId('modal-header')).toBeInTheDocument()
  // })

  // test('renders ModalBody component', () => {
  //   render(<DownloadDataModalView isOpen={true} onClose={() => { }} />)
  //   expect(screen.getByTestId('modal-body')).toBeInTheDocument()
  // })

  // test('does not render when isOpen is false', () => {
  //   render(<DownloadDataModalView isOpen={false} onClose={() => { }} />)
  //   expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  // })
})
