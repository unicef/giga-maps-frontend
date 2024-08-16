import { defaultGigaLayerForm } from "~/@/admin/constants/giga-layer.constant";
import GigaLegendForm from "../../../giga-layer/common/giga-layer-form/giga-legend-form.view";
import { Button } from "@carbon/react";
import { useState } from "react";
import { InputContainer } from "../../../styles/admin-styles";
import { Div } from "~/@/common/style/styled-component-style";

export default function CountryLegendBenchmark() {
  const [showLegend, setShowLegend] = useState(false)
  return (<InputContainer>
    <Div $width="100%">
      {!showLegend && <Button className="legend-button" kind="ghost" onClick={() => setShowLegend(true)}>Add Legend</Button>}
      {showLegend && <GigaLegendForm legendConfigs={defaultGigaLayerForm.legendConfigs} onUpdate={(config) => { }} />}
    </Div>
  </InputContainer>
  )
}