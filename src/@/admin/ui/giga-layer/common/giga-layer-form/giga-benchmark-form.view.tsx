import { Checkbox, SelectItem, TextInput } from "@carbon/react";
import { useStore } from "effector-react";

import { $formData, onUdpateGigaLayerForm } from "~/@/admin/models/giga-layer.model";
import { LayerTypeChoices } from "~/@/sidebar/types";

import { DataLayerFieldContainer, DataLayerNameField, InputLabel, SelectLayerConfig } from "../../../styles/admin-styles";
import { Div } from "~/@/common/style/styled-component-style";
import { speedConverterUtil } from "~/lib/utils";

const benchmarkUnitValues = ['bps', 'ms', 'mbps'];
export default function GigaBenchmarkForm({ isDefaultLayer }: { readonly isDefaultLayer: boolean }) {
  const formData = useStore($formData);

  if (!formData.dataSourceColumn || String(formData.type) === String(LayerTypeChoices.STATIC)) return null;
  const unit = formData?.dataSourceColumn?.unit as string;
  const connectivityType = formData?.globalBenchmark?.connectivity_type as string;
  const baseValue = formData?.dataSourceColumn?.base_benchmark as number;
  const benchmarkValue = formData?.globalBenchmark?.value;
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
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, { ...formData?.globalBenchmark, value: e.target.value }])}
        />
      </DataLayerNameField>
      <Div $margin="0.5rem 0">
        <InputLabel>
          {speedConverterUtil(unit, formData?.benchmarkConvertUnit, Number(benchmarkValue ?? 0))}
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

      <DataLayerNameField>
        <InputLabel>
          Connectivity Type
        </InputLabel>
        <TextInput
          type="text"
          labelText=""
          name='globalBenchmark'
          id="connectivity-type"
          value={formData?.globalBenchmark?.connectivity_type}
          placeholder="Enter connectivity type (default: Global)"
          onChange={(e) => onUdpateGigaLayerForm([e.target.name, { ...formData?.globalBenchmark, connectivity_type: e.target.value }])}
        />
      </DataLayerNameField>

    </DataLayerFieldContainer>
  </>
}