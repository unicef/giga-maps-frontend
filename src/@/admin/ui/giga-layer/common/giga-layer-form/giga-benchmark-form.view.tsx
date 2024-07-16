import { Checkbox, SelectItem, TextInput } from "@carbon/react";
import { useStore } from "effector-react";

import { $formData, onUdpateGigaLayerForm } from "~/@/admin/models/giga-layer.model";
import { stylePaintData } from "~/@/map/map.constant";
import { LayerTypeChoices } from "~/@/sidebar/types";
import { getConnectivityLogicalValues } from "~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant";

import { DataLayerFieldContainer, DataLayerNameField, InputLabel, LegendCategotyContainer, SelectLayerConfig } from "../../../styles/admin-styles";
import { Div } from "~/@/common/style/styled-component-style";
import { speedConverterUtil } from "~/lib/utils";

const benchmarkUnitValues = ['bps', 'ms', 'mbps'];
export default function GigaBenchmarkForm({ isDefaultLayer }: { isDefaultLayer: boolean }) {
  const formData = useStore($formData);

  if (!formData.dataSourceColumn || String(formData.type) === String(LayerTypeChoices.STATIC)) return null;
  const unit = formData?.dataSourceColumn?.unit as string;
  const baseValue = formData?.dataSourceColumn?.base_benchmark as number;
  const labels = getConnectivityLogicalValues(formData?.globalBenchmark?.value, unit, baseValue, formData.isReverse);
  const benchmarkValue = formData?.globalBenchmark?.value;
  const connectivityColors = stylePaintData.dark;
  return <>
    <DataLayerFieldContainer>
      <Checkbox disabled={isDefaultLayer} id="checkbox" labelText="Is reverse" checked={formData?.isReverse} onChange={(_, { checked }) => onUdpateGigaLayerForm(['isReverse', checked])} />
    </DataLayerFieldContainer>
    <SelectLayerConfig
      name="benchmarkConvertUnit"
      required
      labelText="Convert unit"
      id={`unit-select`}
      value={formData?.benchmarkConvertUnit}
      placeholder="Select unit"
      onChange={(e) => onUdpateGigaLayerForm([e.target.name, e.target.value])}
    >
      <SelectItem value="" text="Select parameter" />
      {benchmarkUnitValues?.map((value) => <SelectItem key={value} value={value} text={value} />)}
    </SelectLayerConfig>
    <DataLayerFieldContainer>
      <InputLabel>
        Global Giga Benchmark({unit})
      </InputLabel>
      <DataLayerNameField>
        <TextInput
          type="text"
          labelText=""
          name='globalBenchmark'
          id="global-giga-benchmark"
          value={benchmarkValue}
          required
          placeholder="Enter global benchmark"
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, { value: e.target.value, unit }])}
        />
      </DataLayerNameField>
      <Div $margin="0.5rem 0">
        <InputLabel>
          {speedConverterUtil(unit, formData?.benchmarkConvertUnit, Number(benchmarkValue || 0))}
          {' '}<b>{formData?.benchmarkConvertUnit.toUpperCase()}</b>
        </InputLabel>
      </Div>
      <DataLayerNameField>
        <InputLabel>
          Base Benchmark({unit})
        </InputLabel>
        <TextInput
          type="text"
          labelText=""
          name='dataSourceColumn'
          id="base-giga-benchmark"
          value={baseValue}
          required
          placeholder="Enter base benchmark"
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, { ...formData.dataSourceColumn, base_benchmark: e.target.value }])}
        />
        <Div $margin="0.5rem 0">
          <InputLabel>
            {speedConverterUtil(unit, formData?.benchmarkConvertUnit, Number(baseValue || 0))}
            {' '}<b>{formData?.benchmarkConvertUnit.toUpperCase()}</b>
          </InputLabel>
        </Div>
      </DataLayerNameField>
      {/* {benchmarkValue && <LegendCategotyContainer>
        {
          Object.entries(labels)?.map(([name, value]) => <ColorPickerWrapper key={name}>
            <ColorPicker disabled type="color" value={connectivityColors[name]} />
            <DataLayerNameField>
              <span key={name}>{ConnectivityDistributionNames[name]}  {value}</span>
            </DataLayerNameField>
          </ColorPickerWrapper>)
        }
      </LegendCategotyContainer>} */}
    </DataLayerFieldContainer>
  </>
}