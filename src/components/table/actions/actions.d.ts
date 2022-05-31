// export type PresetAction = 'view' | 'edit' | 'delete'

export interface Action {
  title: string
  icon?: string
  type?: 'primary' | 'default' | 'dashed' | 'link'
  danger?: boolean
  disabled?: boolean
  popupConfirm?: boolean
  click?: () => void
  render?: () => JSX.Element | string
}

export type ActionType = 'icon' | 'text' | 'menu'
