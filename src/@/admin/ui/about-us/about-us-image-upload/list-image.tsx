import { Upload } from '@carbon/icons-react';
import { ActionableNotification, Button, Link, Table, TableHeader, TableRow } from '@carbon/react'
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { deleteImageFx, getImagesListFx } from '~/@/admin/effects/about-us-fx';
import { $imageList } from '~/@/admin/models/about-us-model';

import { AboutUsImagesListWrapper, AdminTableScroll, DeleteIcon, SearchContainer, TableDataBody, TableDataCell, TableDataHead } from '../../styles/admin-styles'
import ModalUploadImage from './modal-upload-image';

function ListImage() {

  const { results: imageList } = useStore($imageList) || {};
  const [deleteId, setDeleteId] = useState<null | number>(null);
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    void getImagesListFx();
  }, []);

  const onDeleteRole = async (Id: number) => {
    setDeleteId(null);
    const body = {
      id: [Id]
    }
    try {
      await deleteImageFx({ body })
      await getImagesListFx()
    } catch (e) {
      console.error(e)
    }
  }

  return (<>
    <SearchContainer>
      {deleteId && <ActionableNotification
        lowContrast inline
        title="Delete role - "
        subtitle="Are you sure?"
        closeOnEscape
        data-testid="admin-about-us-delete-image"
        actionButtonLabel="Yes"
        onActionButtonClick={() => void onDeleteRole(deleteId)}
        onClose={() => setDeleteId(null)}
      />}
      <Button
        disabled={false}
        onClick={() => {
          setModalOpen(true)
        }}
        renderIcon={Upload}>
        Upload New Image
      </Button>
    </SearchContainer>
    <AdminTableScroll $contentHeight="13rem">
      <AboutUsImagesListWrapper>
        <Table aria-label="user-roles-data-table" >
          <TableDataHead >
            <TableRow>
              <TableHeader>
                Name
              </TableHeader>
              <TableHeader>
                Image Link
              </TableHeader>
              <TableHeader>
                Action
              </TableHeader>
            </TableRow>
          </TableDataHead>
          <TableDataBody >
            {
              imageList?.map((image) => (
                <TableRow key={image?.id}>
                  <TableDataCell>
                    {image?.name}
                  </TableDataCell>
                  <TableDataCell>
                    <Link href={image?.image} target='_blank'>{image?.image}</Link>
                  </TableDataCell>
                  <TableDataCell>
                    <span style={{ marginLeft: 10 }} onClick={() => setDeleteId(image?.id)} data-testid={'delete-about-us-image' + image.id}>
                      <DeleteIcon size={16} />
                    </span>
                  </TableDataCell>
                </TableRow>
              ))
            }
          </TableDataBody>
        </Table >
      </AboutUsImagesListWrapper>
    </AdminTableScroll>
    <ModalUploadImage open={modalOpen} setOpen={setModalOpen} />
  </>
  )
}

export default ListImage