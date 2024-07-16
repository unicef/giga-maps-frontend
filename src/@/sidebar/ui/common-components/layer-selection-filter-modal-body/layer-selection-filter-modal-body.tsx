import { ModalBody } from "@carbon/react";
import { forwardRef, useRef } from 'react'

import { mapSchools } from "~/core/routes";
import { useRoute } from "~/lib/router";
import { imperativeHandle } from "~/lib/utils/react.util";

import ConnectivityBenchmark from "./connectivity-benchmark.view";
import ConnectivitySpeedOptions from "./connectivity-speed-options.view";
import LiveConnectivityType from "./live-connectivity-type.view";

type RefType = { apply: () => void } | null;
export default forwardRef(function LayerSelectionFilterModalBody(_props, ref) {
  const schoolView = useRoute(mapSchools);
  const liveConnectivityRef = useRef<RefType>(null);
  const connectvityBenchmarkRef = useRef<RefType>(null);
  const connectivitySpeedRef = useRef<RefType>(null);

  const handleApply = () => {
    liveConnectivityRef.current?.apply();
    connectvityBenchmarkRef.current?.apply();
    connectivitySpeedRef.current?.apply();
  };

  imperativeHandle(ref, handleApply)

  return (
    <ModalBody className='layer-selection-filter-body'>
      <LiveConnectivityType ref={liveConnectivityRef} />
      <ConnectivityBenchmark ref={connectvityBenchmarkRef} />
      {/* {!schoolView && <ConnectivitySpeedOptions ref={connectivitySpeedRef} />} */}
    </ModalBody>
  )
});

