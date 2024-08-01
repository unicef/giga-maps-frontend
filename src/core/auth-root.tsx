import { MsalProvider } from '@azure/msal-react';
import { ActionableNotification, Loading } from '@carbon/react';
import { useStore } from 'effector-react';
import { lazy, PropsWithChildren, Suspense, useEffect } from 'react';

import Toast from '~/@/common/Toast/Toast.view';
import { admin, apiDocs, docsExporeApi } from '~/core/routes';
import { useRoute } from '~/lib/router';

import { $msalInstance } from './auth/azure-msal/model';
import { $isAdmin, $isCheckingAuthentication, $isLoggedIn, } from './auth/models';
import { $isMobile } from './media-query';
import styled from 'styled-components';

const NotAvailableOnMobileSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: ${props => props.theme.main};
  padding-top: 10%;
  .cds--actionable-notification--info {
    background: ${props => props.theme.main};
  }
`

const AdminPanelMain = lazy(async () => import('~/@/admin/ui/main/admin-main.view'));
const ApiDocsMain = lazy(async () => import('~/@/api-docs/ui/page'));

const AuthRoute = ({ children }: PropsWithChildren<{}>) => {
  const isLoggedIn = useStore($isLoggedIn);
  const isAdminAccess = useStore($isAdmin);
  useEffect(() => {
    if (!isLoggedIn || !isAdminAccess) {
      docsExporeApi.redirect();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;
  return children
}

const AuthVerification = ({ children }: PropsWithChildren<{}>) => {
  const isChecking = useStore($isCheckingAuthentication);

  if (isChecking) return null;
  return children
}


export default function AuthRoot() {
  const msalInstance = useStore($msalInstance);
  const apiDocsRoute = useRoute(apiDocs);
  const adminRoute = useRoute(admin);
  const isChecking = useStore($isCheckingAuthentication);
  const isMobile = useStore($isMobile);
  if (!msalInstance) return null;

  if (isMobile) {
    return (
      <NotAvailableOnMobileSection>
        <ActionableNotification
          hideCloseButton
          actionButtonLabel="Back to map"
          aria-label="closes notification"
          kind="info"
          onActionButtonClick={() => {
            window.location.href = '/map';
          }}
          statusIconDescription="notification"
          subtitle="Our APIs and downloads are not available yet on mobile. Please visit the desktop version to access this page."
          title="Coming soon on mobile"
        />
      </NotAvailableOnMobileSection>
    )
  }
  return (
    <MsalProvider instance={msalInstance}>
      <Suspense fallback={<Loading withOverlay={true} active={true} />}>
        <AuthVerification>
          {apiDocsRoute && <ApiDocsMain />}
          {adminRoute && <AuthRoute>
            <AdminPanelMain />
          </AuthRoute>}
        </AuthVerification>
        <Toast />
        <Loading withOverlay={true} active={isChecking} />
      </Suspense >
    </MsalProvider>
  );
};
