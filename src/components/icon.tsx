import * as Icons from '@ant-design/icons-vue'
import { h } from 'vue'

export default (props: { icon: string }) => {
  return h(Icons[props.icon as keyof typeof Icons])
}
