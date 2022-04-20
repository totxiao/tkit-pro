import { Method } from 'axios'
import { Ref } from 'vue'
import DataHandler from './DataHandler'

export const CompType: 'text' | 'select'

export interface BasicTable {
  fetchData: () => void
  getTableData: () => any
  getTableLoading: () => Ref<boolean>
  getTableError: () => Error
  clearTable: () => void
  _tableOptions: TableOptions
  _dataHandler: DataHandler
  [key: string]: any
}

export interface TableOptions {
  columns: TableColumn[]
  pagination?: object | boolean
  data?: any
  service?:
    | string
    | (() => Promise<any>)
    | {
        url: string
        method: Method
        params?: Record<string, unknown>
        headers?: Record<string, string | number | boolean>
      }
  rowKey?: string
  [key: string]: any
}

export interface TableColumn {
  title: string
  key: string
  render?: (param: {
    text: any
    record: Record<string, unknown>
    index: number
    column: TableColumn
  }) => JSX.Element | string
  customRender?: (param: {
    text: any
    record: Record<string, unknown>
    index: number
    column: TableColumn
  }) => JSX.Element | string
  [key: string]: any
}

export interface PageConfig {
  result: string
  current: string
  message: string
  pageSize: string
  pageNumber: string
  total: string
}

export interface PageData {
  result: any[]
  current: number
  message: string
  pageSize: number
  pageNumber: number
  total: number
}
