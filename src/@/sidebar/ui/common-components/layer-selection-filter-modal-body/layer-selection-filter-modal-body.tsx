import { ModalBody } from "@carbon/react";
import { forwardRef, useRef, useState } from 'react'
import { imperativeHandle } from "~/lib/utils/react.util";

import ConnectivityBenchmark from "./connectivity-benchmark.view";
import LiveConnectivityType from "./live-connectivity-type.view";
import { useStore } from "effector-react";
import { $selectedLayerId } from "~/@/sidebar/sidebar.model";

type RefType = { apply: () => void } | null;
export default forwardRef(function LayerSelectionFilterModalBody(_props, ref) {
  // const schoolView = useRoute(mapSchools);
  const [currentLayerId, setCurrentLayerId] = useState<number | null>(null);
  const liveConnectivityRef = useRef<RefType>(null);
  const connectvityBenchmarkRef = useRef<RefType>(null);
  // const connectivitySpeedRef = useRef<RefType>(null);

  const handleApply = () => {
    liveConnectivityRef.current?.apply();
    connectvityBenchmarkRef.current?.apply();
    // connectivitySpeedRef.current?.apply();
  };

  imperativeHandle(ref, handleApply)

  return (
    <ModalBody className='layer-selection-filter-body'>
      <LiveConnectivityType ref={liveConnectivityRef} setCurrentLayer={setCurrentLayerId} />
      <ConnectivityBenchmark ref={connectvityBenchmarkRef} layerId={currentLayerId} />
      {/* {!schoolView && <ConnectivitySpeedOptions ref={connectivitySpeedRef} />} */}
    </ModalBody>
  )
});

