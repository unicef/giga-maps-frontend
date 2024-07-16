import { Fragment } from "react"
import { AboutusFormType } from "~/@/admin/types/about-us.type"
import { FieldItem } from "./form-content-list.view"

export const FormFieldList = ({ fields }: { fields: AboutusFormType["fields"] }) => {
  return fields.map((field, index) => <Fragment key={field.path}>
    <FieldItem key={`${index}${field.typeField.type}`} type={field.typeField.type} field={field} />
  </Fragment>)
}
