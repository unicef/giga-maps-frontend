import { TextInput } from "@carbon/react";
import { useStore } from 'effector-react';

import { $currentGigaLayerItem, $formData, onUdpateGigaLayerForm } from "~/@/admin/models/giga-layer.model";
import { LayerTypeChoices } from "~/@/admin/types/giga-layer.type";
import { stylePaintData } from "~/@/map/map.constant";

import { ColorPicker, ColorPickerLabel, ColorPickerWrapper, DataLayerNameField, LegendCategotyContainer } from "../../../styles/admin-styles";
import { Fragment } from "react";
import { getConnectivityLogicalValues } from "~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant";
import { speedConverterUtil } from "~/lib/utils";

const gigaLengendValues = [
  {
    name: 'Good',
    example: 'Ex. 5G,4G',
    defaultDisplayValue: 'Good',
    value: 'good',
    required: true
  },
  {
    name: 'Moderate',
    example: 'Ex. 3G,2G',
    defaultDisplayValue: 'Moderate',
    value: 'moderate',
    required: true
  },
  {
    name: 'Bad',
    example: 'Ex. No',
    value: 'bad',
    defaultDisplayValue: 'Bad',
    required: true
  },
  {
    name: 'Unknown',
    value: 'unknown',
    defaultDisplayValue: 'Unknown',
    required: false,
  }
]

export default function GigaLegendForm({ isDefaultLayer }: { isDefaultLayer: boolean }) {
  const formData = useStore($formData);
  const isLive = formData.type === LayerTypeChoices.LIVE;
  const isStatic = formData.type === LayerTypeChoices.STATIC;
  const unit = formData?.dataSourceColumn?.unit as string;
  const baseValue = speedConverterUtil(unit, formData?.benchmarkConvertUnit, Number(formData?.dataSourceColumn?.base_benchmark || 0))
  const globalValue = String(speedConverterUtil(unit, formData?.benchmarkConvertUnit, Number(formData?.globalBenchmark?.value || 0)))
  const labels = getConnectivityLogicalValues(globalValue, formData?.benchmarkConvertUnit, baseValue, formData.isReverse);
  const connectivityColors = stylePaintData.dark
  return (<>
    <ColorPickerLabel>
      Legends
    </ColorPickerLabel>
    <LegendCategotyContainer>
      {
        gigaLengendValues.map((item, index) => {
          return (<Fragment key={index}>
            <ColorPickerWrapper key={index}>
              <ColorPicker type="color" value={connectivityColors[item?.value]} />
              <div>
                <span>{item.name} - {isStatic ? item.example : labels[item.value]}</span>
              </div>
            </ColorPickerWrapper>
            <DataLayerNameField>
              <TextInput
                type="text"
                labelText=""
                name={`${item.value}_labels`}
                required
                defaultValue={item.defaultDisplayValue}
                id={`legend-value-${index}`}
                placeholder="Enter display value"
                value={formData?.legendConfigs[item.value]?.labels}
                onChange={(e) => {
                  const [type, name] = e.target.name.split('_')
                  let itemConfig = formData?.legendConfigs[type];
                  if (!itemConfig) {
                    itemConfig = {
                      values: [],
                      labels: ''
                    }
                  }
                  itemConfig[name] = e.target.value;
                  onUdpateGigaLayerForm(['legendConfigs',
                    {
                      ...formData.legendConfigs,
                      [type]: itemConfig
                    }])
                }}
              />
              {isStatic &&
                <TextInput
                  type="text"
                  labelText=""
                  name={`${item.value}_values`}
                  required={item.required}
                  id={`legend-name-${index}`}
                  placeholder="Enter legend category"
                  disabled={isDefaultLayer}
                  value={formData?.legendConfigs[item.value]?.values.join(',')}
                  onChange={(e) => {
                    const [type, name] = e.target.name.split('_')
                    let itemConfig = formData?.legendConfigs[type];
                    if (!itemConfig) {
                      itemConfig = {
                        values: [],
                        labels: ''
                      }
                    }
                    itemConfig[name] = e.target.value.startsWith('SQL:') ? [e.target.value] : e.target.value.split(',')
                    onUdpateGigaLayerForm(['legendConfigs',
                      {
                        ...formData.legendConfigs, [type]: itemConfig
                      }])
                  }}
                />
              }
            </DataLayerNameField>
          </Fragment>)
        })
      }
    </LegendCategotyContainer>
  </>)

}

