import React, { Suspense } from "react";
import { useCheckHealth } from "./features/frontend/health/useCheckHealth";
import Healthy from "./features/frontend/health/Healthy";
import Unhealthy from "./features/frontend/health/Unhealthy";
import { ViewportProvider } from "./features/frontend/viewportProvider/ViewportProvider";

const loadAppInner = () => import("./AppInner");
const LazyAppInner = React.lazy(loadAppInner); 

const App: React.FC = () => {
  const { loading, error, pages, theme, progress } = useCheckHealth(loadAppInner);

  if (loading) return <Healthy progress={progress} />;
  if (error || !pages?.length) return <Unhealthy error={error || "No pages found"} />;

  return (
    <Suspense fallback={<Healthy progress={progress} />}>
      <ViewportProvider>
        <LazyAppInner pages={pages} theme={theme} />
      </ViewportProvider>
    </Suspense>
  );
};

export default App;
