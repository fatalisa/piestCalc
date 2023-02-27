define(['css!/webapp/nomui-components/pro-list/index.css'], function () {
  class ProList extends nomui.Component {
    constructor(props, ...mixins) {
      const defaults = {
        cols: 1,
        siderRender: null,
        subTitle: null,
        actions: null,
        title: 'title',
        description: 'description',
        showActions: 'always',
        line: null,
        gutter: 'lg',
        hover: true,
        onItemClick: null,
        data: [],
        // showEmpty
      }
      super(nomui.Component.extendProps(defaults, props), ...mixins)
    }

    _config() {
      const that = this
      const { data, cols, siderRender, subTitleRender, actionsRender, showActions, line, gutter, title, description, hover, onItemClick, attrs } = this.props

      let { showEmpty } = this.props

      const items = data.map(function (item) {
        let li = {
          component: 'Cols',
          classes: {
            'pro-list-item': true,
            'pro-list-item-hover': showActions && showActions === 'hover',
            'pro-list-item-selected': that.selectItem && that.selectItem.id === item.id,
          },
          children: [
            siderRender && {
              children: siderRender(item),
            },
            {
              attrs: {
                style: {
                  'flex-grow': 2,
                },
              },
              children: [
                {
                  component: 'Cols',
                  classes: {
                    'pro-list-title': true,
                  },
                  items: [
                    {
                      children: nomui.utils.isFunction(title) ? title(item) : item[title],
                    },
                    subTitleRender && subTitleRender(item),
                  ],
                },
                {
                  classes: {
                    'pro-list-desc': true,
                  },
                  children: nomui.utils.isFunction(description) ? description(item) : item[description],
                },
              ],
            },
            actionsRender && {
              classes: {
                'pro-list-actions': true,
              },
              children: actionsRender(item),
            },
          ],
        }

        if (onItemClick && !actionsRender) {
          li = Object.assign(li, {
            onClick: (args) => {
              that.selectItem = item
              args.event.stopPropagation()
              that._callHandler(onItemClick, item)
              that.update()
            },
          })
        }
        return li
      })

      if (showEmpty === undefined) {
        showEmpty = !data.items || data.items.length === 0
      }
      this.setProps({
        classes: {
          'pro-list-hover-style': hover,
          'pro-list-clickable': !!onItemClick,
        },
        children: {
          component: 'List',
          items: items,
          cols: cols,
          gutter: gutter,
          line: line,
          showEmpty,
          attrs: attrs,
        },
      })
    }
  }

  return ProList
})
