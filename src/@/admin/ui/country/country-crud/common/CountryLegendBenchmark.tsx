import { defaultGigaLayerForm } from "~/@/admin/constants/giga-layer.constant";
import GigaLegendForm from "../../../giga-layer/common/giga-layer-form/giga-legend-form.view";
import { Button } from "@carbon/react";
import { useState } from "react";
import { InputContainer } from "../../../styles/admin-styles";
import { Div } from "~/@/common/style/styled-component-style";
import { LegendConfigType } from "~/@/admin/types/giga-layer.type";

export default function CountryLegendBenchmark({ config, onChange }: { config: LegendConfigType, onChange: (config: LegendConfigType) => void }) {
  const [showLegend, setShowLegend] = useState(Object.keys(config ?? {})?.length > 0);
  return (<InputContainer>
    <Div $width="100%">
      {!showLegend && <Button size="sm" className="legend-button" kind="ghost" onClick={() => setShowLegend(true)}>Add Legend</Button>}
      {showLegend && <GigaLegendForm legendConfigs={config ?? defaultGigaLayerForm.legendConfigs} onUpdate={onChange} />}
    </Div>
  </InputContainer>
  )
}