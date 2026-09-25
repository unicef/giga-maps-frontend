import { ErrorBoundary } from '~/components/ui/error-boundary';
import { AppFrame, Root } from '~/core';

const App = () => (
  <ErrorBoundary name="AppRoot">
    <AppFrame>
      <Root />
    </AppFrame>
  </ErrorBoundary>
);

export default App;