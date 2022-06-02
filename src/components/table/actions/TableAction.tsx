import { Action, ActionType } from './actions'
import { ToRef } from 'vue'
import Icon from '../../icon'
import './TableAction.less'

const DEFAULT_ICON = {
  view: 'EyeOutlined',
  update: 'EditOutlined',
  delete: 'ClearOutlined',
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
    const actions: ToRef<Action[]> = toRef(props, 'actions')
    const type: ToRef<ActionType> = toRef(props, 'type')

    const analysisIcon = (icon: string | undefined) => {
      let actIcon: string | undefined
      if (icon) {
        Object.entries(DEFAULT_ICON).forEach(([key, val]) => {
          if (icon === key) {
            actIcon = val
          }
        })
        if (!icon) {
          actIcon = icon
        }
      }

      return actIcon
    }

    const iconRenderer = (action: Action) => {
      return (
        <a-tooltip
          v-slots={{
            title: () => action.title,
          }}
        >
          <a-button
            key={action.title}
            type={action.type}
            danger={action.danger}
            disabled={action.disabled}
            onClick={action.click}
            v-slots={{
              icon: () => <Icon icon={analysisIcon(action.icon) || 'EyeOutlined'} />,
            }}
          ></a-button>
        </a-tooltip>
      )
    }

    const textRenderer = (action: Action) => {
      return (
        <a-tooltip
          v-slots={{
            title: () => action.title,
          }}
        >
          {!action.disabled && (
            <a class="action-text" onClick={action.click} key={action.title}>
              {action.title}
            </a>
          )}
          {action.disabled && (
            <a class="action-text disabled" key={action.title}>
              {action.title}
            </a>
          )}
        </a-tooltip>
      )
    }

    const menuRenderer = (action: Action) => {
      return (
        <a-tooltip
          v-slots={{
            title: () => action.title,
          }}
        >
          <a-menu-item disabled={action.disabled} onClick={action.click} key={action.title}>
            <div class="action-menu">
              {action.icon && <Icon icon={analysisIcon(action.icon) || 'EyeOutlined'} />}
              {action.render && action.render()}
              {!action.render && <a style={{ padding: '0 5px' }}>{action.title}</a>}
            </div>
          </a-menu-item>
        </a-tooltip>
      )
    }

    const textRender = (actions: Action[]) => {
      if (actions.length <= 4) {
        return actions.map((action) => textRenderer(action))
      } else {
        const restActions = actions.slice(3)
        return (
          <>
            {textRenderer(actions[0])}
            {textRenderer(actions[1])}
            {textRenderer(actions[2])}
            {
              <a-dropdown
                v-slots={{
                  overlay: () => <a-menu>{restActions.map((action) => menuRenderer(action))}</a-menu>,
                }}
              >
                <div class="action-rest">
                  <Icon icon={'EllipsisOutlined'} />
                </div>
              </a-dropdown>
            }
          </>
        )
      }
    }

    return () => {
      return (
        <div class="action-box">
          {type.value === 'icon' && (
            <a-button-group>
              {actions.value.map((action: any) => {
                return iconRenderer(action)
              })}
            </a-button-group>
          )}
          {type.value === 'text' && textRender(actions.value)}
        </div>
      )
    }
  },
}
