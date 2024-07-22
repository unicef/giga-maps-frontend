import { Tooltip } from "@carbon/react";

import { DataSourceType } from "../../types/data-source.type";
import { DataSourceTableCell } from "../styles/admin-styles";


type EditableFieldProps = {
  readonly item: DataSourceType;
  readonly fieldName: string;
  readonly updatedData: Record<string, Partial<DataSourceType>>,
  readonly handleInputChange: (_a: string, _b: string, _c: string, _d: string) => void,
  readonly isEditable: boolean
  readonly readOnly: boolean;
}

const Information = ({ oldData, newData }: { oldData: string, newData: string }) => {
  if (!oldData && !newData) return null;
  return (
    <p> <strong>Changed from </strong>{oldData}<strong> to </strong>{newData}</p>
  )
}

const getFieldValue = (item: DataSourceType, fieldName: string) => {
  const [first, second] = fieldName.split('.');
  if (!second) return item[first];
  return item[first][second];
}

export default function EditableField({ item, fieldName, updatedData, handleInputChange, isEditable, readOnly }: EditableFieldProps) {
  const isUpdated = !!item.modified_fields?.[fieldName];
  const oldData = item.modified_fields?.[fieldName]?.old as string;
  const newData = getFieldValue(item, fieldName) as string;
  const editedData = updatedData?.[item.id]?.[fieldName] as string;
  return <DataSourceTableCell className="editable-field-container" $updated={isUpdated} $changed={!!editedData}>
    {
      isUpdated ?
        <Tooltip
          align="bottom"
          label={
            <Information
              oldData={oldData}
              newData={newData}
            />}>
          <button className="sb-tooltip-trigger" type="button">
            <input
              type='text'
              readOnly={readOnly}
              value={editedData ?? newData ?? ''}
              onChange={(e) => handleInputChange(item.id, fieldName, e.target.value, newData)}
            />
          </button>
        </Tooltip> : <input
          type='text'
          title={(readOnly || !isEditable) ? 'Read only' : 'Editable'}
          readOnly={readOnly ?? !isEditable}
          value={editedData ?? newData ?? ''}
          onChange={(e) => handleInputChange(item.id, fieldName, e.target.value, newData)} />
    }
  </DataSourceTableCell>
}