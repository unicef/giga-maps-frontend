export interface AboutType {
  id: number
  text: string[]
  cta: {
    text?: string[]
    link?: string[]
  }
  content: Content[]
  title?: string
  icon?: string
  image?: string
  type: string
  status: boolean
  order: number
  style?: string
}

export interface Content {
  text?: string[]
  title?: string
  image?: string
  style?: string
  target?: string
  icon?: string
  cta?: {
    text?: string[]
    link?: string[]
  }
}