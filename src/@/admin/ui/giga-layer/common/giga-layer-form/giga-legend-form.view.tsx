import { Accordion, AccordionItem, TextInput } from "@carbon/react";

import { LegendConfigType } from "~/@/admin/types/giga-layer.type";
import { stylePaintData } from "~/@/map/map.constant";

import { ColorPicker, ColorPickerLabel, ColorPickerWrapper, DataLayerNameField, LegendCategotyContainer } from "../../../styles/admin-styles";
import { Fragment } from "react";
import { defaultGigaLayerForm } from "~/@/admin/constants/giga-layer.constant";

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

export default function GigaLegendForm({ legendConfigs = defaultGigaLayerForm.legendConfigs, onUpdate }: Readonly<{ legendConfigs: LegendConfigType, onUpdate: (legendConfig: LegendConfigType) => void }>) {
  const connectivityColors = stylePaintData.dark

  const onUpdateLegendConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [type, name] = e.target.name.split('_')
    let itemConfig = legendConfigs?.[type];
    if (!itemConfig) {
      itemConfig = {
        values: [],
        labels: '',
        tooltip: ''
      }
    }
    if (name === 'values') {
      itemConfig[name] = e.target.value.startsWith('SQL:') ? [e.target.value] : e.target.value.split(',')
    } else if (name === 'labels' || name === 'tooltip') {
      itemConfig[name] = e.target.value;
    }
    onUpdate(
      {
        ...legendConfigs,
        [type]: itemConfig
      })
  }

  return (<>
    <ColorPickerLabel>
      Legends
    </ColorPickerLabel>
    <LegendCategotyContainer>
      <Accordion>
        {
          gigaLengendValues.map((item, index) => {
            return (<Fragment key={`${item.name}-${index}`}>
              <DataLayerNameField>
                <AccordionItem title={<ColorPickerWrapper key={`${item.name}-${index}`}>
                  <ColorPicker disabled type="color" value={connectivityColors[item?.value]} />
                  <div>
                    <span>{item.name} - {legendConfigs[item.value]?.labels ?? item.example}</span>
                  </div>
                </ColorPickerWrapper>}>
                  <TextInput
                    type="text"
                    labelText="Legend type"
                    name={`${item.value}_labels`}
                    id={`legend-value-${index}`}
                    placeholder="Enter display value"
                    value={legendConfigs[item.value]?.labels}
                    onChange={onUpdateLegendConfig}
                  />
                  <TextInput
                    type="text"
                    labelText="Category Values(ex- SQL:)"
                    name={`${item.value}_values`}
                    id={`legend-name-${index}`}
                    placeholder="Enter legend category"
                    value={legendConfigs[item.value]?.values.join(',')}
                    onChange={onUpdateLegendConfig}
                  />
                  <TextInput
                    type="text"
                    labelText="Tooltip"
                    name={`${item.value}_tooltip`}
                    id={`legend-name-${index}`}
                    placeholder="Enter tooltip value"
                    value={legendConfigs[item.value]?.tooltip}
                    onChange={onUpdateLegendConfig}
                  />
                </AccordionItem>
              </DataLayerNameField>
            </Fragment>)
          })
        }
      </Accordion>
    </LegendCategotyContainer>
  </>)

}

