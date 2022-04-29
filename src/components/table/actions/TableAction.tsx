import { Action, ActionType } from './actions'
import * as Icons from '@ant-design/icons-vue'
import { h } from 'vue'

const Icon = (props: { icon: string }) => {
  return h(Icons[props.icon as keyof typeof Icons])
}

export default {
  name: 'TableAction',
  components: { Icon },
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'icon',
    },
  },
  setup(props: Record<string, any>) {
    const actions: Action[] = props.actions
    const type: ActionType = props.type

    const itemRenderer = (action: Action, type: ActionType) => {
      return (
        <a-tooltip
          v-slots={{
            title: () => action.title,
          }}
        >
          {action.render && action.render()}
          {!action.render && type === 'icon' && (
            <a-button
              key={action.title}
              type={action.type}
              danger={action.danger}
              disabled={action.danger}
              onClick={action.onClick}
              v-slots={{
                icon: () => <Icon icon={action.icon || 'EditOutlined'} />,
              }}
            ></a-button>
          )}
          {!action.render && type === 'text' && <a-menu-item key={action.title}>{action.title}</a-menu-item>}
        </a-tooltip>
      )
    }

    const textRender = (actions: Action[]) => {
      console.log(actions.length)
      if (actions.length <= 3) {
        return actions.map((action) => itemRenderer(action, 'icon'))
      } else {
        const restActions = actions.slice(2)
        console.log(restActions)
        return (
          <>
            {itemRenderer(actions[0], 'icon')}
            {itemRenderer(actions[1], 'icon')}
            {
              <a-dropdown
                v-slots={{
                  overlay: () => <a-menu>{restActions.map((action) => itemRenderer(action, 'text'))}</a-menu>,
                }}
              >
                <a-button>Actions</a-button>
              </a-dropdown>
            }
          </>
        )
      }
    }

    console.log(type)

    return () => (
      <div>
        {type === 'icon' && (
          <a-button-group>
            {actions.map((action) => {
              return itemRenderer(action, 'icon')
            })}
          </a-button-group>
        )}
        {type === 'text' && textRender(actions)}
      </div>
    )
  },
}
