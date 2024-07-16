
import { Breadcrumb, BreadcrumbItem } from '@carbon/react';

import { docsApiKeys, docsExporeApi, mapOverview } from '~/core/routes';
import { Link, useRoute } from '~/lib/router';

const ApiBreadcrumb = () => {
  const isExporeRoute = useRoute(docsExporeApi)
  const isApiKeys = useRoute(docsApiKeys);

  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">
        <Link to={mapOverview}>Home</Link></BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>API’s and download</BreadcrumbItem>
      {isExporeRoute && <BreadcrumbItem isCurrentPage>
        Explore APIs
      </BreadcrumbItem>}
      {isApiKeys && <BreadcrumbItem isCurrentPage>
        API keys
      </BreadcrumbItem>}
    </Breadcrumb>
  )
}

export default ApiBreadcrumb;