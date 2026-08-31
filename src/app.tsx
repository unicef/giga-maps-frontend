import { ErrorBoundary } from '~/components/ui/error-boundary';
import { AppFrame, Root } from '~/core';

const App = () => (
  <ErrorBoundary name="AppRoot" variant="page">
    <AppFrame>
      <Root />
    </AppFrame>
  </ErrorBoundary>
);

export default App;