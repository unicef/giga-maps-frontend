import { CustomPagination } from '../styles/admin-styles'

const defaultPageSizes = [10, 20, 50, 100, 500];
const defaultPageSize = 20;
const Pagination = ({ page, setPage, count = 1, pageSize = defaultPageSize }:
  { page: number, setPage: (args: { page: number; pageSize: number }) => void, count?: number, pageSize?: number }) => {
  return (
    <CustomPagination
      itemsPerPageText="Items per page"
      page={page}
      pageSize={pageSize}
      pageSizes={defaultPageSizes}
      size="md"
      totalItems={count}
      onChange={({ page, pageSize }: { page: number, pageSize: number }) => setPage({ page, pageSize })}
    />
  )
}

export default Pagination