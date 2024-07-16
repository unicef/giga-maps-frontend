export interface AboutUsImage {
  id: number;
  image: string;
  name: string;
}

export interface AboutusFormType {
  sectionName: string
  type: string
  fields: AboutFormFieldType[]
  content?: AboutUsContentType
}

export interface AboutFormFieldType {
  name: string
  path: string
  typeField: AboutUsFieldType
}

export interface AboutUsFieldType {
  type: string
  props?: Record<string, string>
  value?: string
  listType?: string
}

export interface AboutUsContentType {
  name: string
  path: string
  allowNew: boolean
  items: Item[]
  maxAllow?: number
}

export interface Item {
  type: string
  fields: AboutFormFieldType[]
}


