define([
  'dragula',
  'css!/libs/dragula/dragula.min.css',
  'css!/nomui-components/pro-group/index.css',
], function (Dragula) {
  nomui.Icon.add(
    'tasks',
    `<svg t="1681958966318" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3003" width="1em" height="1em" fill="currentColor"><path d="M224 800.256L223.712 224H320v31.68c0 35.456 28.64 64.32 63.872 64.32h256.256A64.16 64.16 0 0 0 704 255.68V224l96-0.256L800.256 800 224 800.256zM640 192.32L640.128 256 384 255.68V192.32L383.872 192 640 192.32zM799.84 160H695.04c-11.072-19.04-31.424-32-54.912-32h-256.256c-23.488 0-43.808 12.928-54.912 32H223.712A63.776 63.776 0 0 0 160 223.744v576.512C160 835.392 188.608 864 223.744 864h576.512A63.84 63.84 0 0 0 864 800.256V223.744A64 64 0 0 0 799.84 160z" p-id="3004"></path><path d="M619.072 429.088l-151.744 165.888-62.112-69.6a32 32 0 1 0-47.744 42.624l85.696 96a32 32 0 0 0 23.68 10.688h0.192c8.96 0 17.536-3.776 23.616-10.4l175.648-192a32 32 0 0 0-47.232-43.2" p-id="3005"></path></svg>`,
    'Uncategorized'
  )

  class ProGroup extends nomui.Component {
    constructor(props, ...mixins) {
      const defaults = {
        data: [
          {
            id: '001',
            name: '需求提案',
            events: [
              {
                id: '00101',
                name: 'app原型设计',
                status: 'warning',
                checked: true,
                disabled: false,
                date: '2023-01-05',
                tasks: 3,
                eventRender: null,
              },
              {
                id: '00102',
                name: 'web原型设计',
                status: 'warning',
                checked: false,
                disabled: false,
                date: '2023-01-08',
                tasks: 1,
                eventRender: null,
              },

              {
                id: '00103',
                name: '测试1',
                status: null,
                checked: false,
                disabled: false,
                date: '2023-01-12',
                tasks: 1,
                eventRender: null,
              },
              {
                id: '00104',
                name: '测试2',
                status: null,
                checked: false,
                disabled: false,
                date: null,
                tasks: 1,
                eventRender: null,
              },
              {
                id: '00105',
                name: '测试3',
                status: null,
                checked: false,
                disabled: false,
                date: '2023-01-07',
                tasks: 1,
                eventRender: null,
              },
            ],
          },
          {
            id: '002',
            name: '前期设计',
            events: [
              {
                id: '00102',
                name: 'UI设计',
                status: 'success',
                checked: false,
                disabled: false,
                date: '2023-01-10',
                tasks: 3,
                eventRender: null,
              },
            ],
          },
        ],
        onEventCreate: null,
        onEventDelete: null,
        onEventClick: null,
        onEventDrag: null,
        titleRender: null,
        eventRender: null,
      }
      super(nomui.Component.extendProps(defaults, props), ...mixins)
    }

    _config() {
      const me = this
      const { data } = this.props

      this.setProps({
        children: {
          component: 'List',
          onCreated: ({ inst }) => {
            this.mainList = inst
          },
          classes: {
            'pro-group-main': true,
          },
          itemRender: ({ itemData,item }) => {
            if (itemData.isCreateBtn) {
              return {
                component:'Flex',
                classes:{
                  'pro-group-list-add':true
                },
                align:'center',
                cols:[
                  {
                    component:'Icon',
                    type:'plus'
                  },
                  {
                    children:'新增列表'
                  }
                ],
                onClick:()=>{
                  me._appendList()
                }
              }
            }
            return {
              component: 'Flex',
              classes: {
                'pro-group-box': true,
              },
              rows: [
                {
                  children: {
                    component: 'Flex',
                    gutter: 'small',
                    classes: {
                      'pro-group-title': true,
                    },
                    attrs: {
                      style: {
                        padding: '0 .25rem .5rem .25rem',
                      },
                    },
                    cols: [
                      {
                        children: itemData.name,
                      },
                      {
                        classes: {
                          'pro-group-title-count': true,
                        },
                        children:
                          (itemData.events && itemData.events.length) || 0,
                      },
                    ],
                  },
                },
                this._renderEventList(itemData,item),
                {
                  children: {
                    classes: {
                      'pro-group-event-add': true,
                    },

                    children: [
                      {
                        classes: {
                          'pro-group-event-add-btn': true,
                        },
                        onClick: ({ sender }) => {
                          sender.parent.parent.parent.element.classList.add(
                            'pro-group-inputing'
                          )
                        },
                        children: {
                          component: 'Icon',
                          type: 'plus',
                        },
                      },
                      {
                        component: 'Flex',
                        classes:{
                          'pro-group-event-add-input-panel':true
                        },
                        rows: [
                          {
                            component: 'MultilineTextbox',
                            onCreated: ({ inst }) => {
                              
                              item.input = inst
                            },
                          },
                          {
                            gutter:'small',
                            justify:'end',
                            cols: [
                              {
                                component: 'Button',
                                text: '确定',
                                size:'small',
                                type: 'primary',
                                onClick: ({ sender }) => {
                                  const input = item.input
                                  const val = input.getValue()
                                  const list = item.eventList
                                  
                                  list.appendDataItem({
                                    id: nomui.utils.newGuid(),
                                    name: val,
                                    status: null,
                                    checked: false,
                                    disabled: false,
                                    date: null,
                                    tasks: 0,
                                    eventRender: null,
                                  })
                                  input.clear()
                                  


                                  sender.element
                                    .closest('.pro-group-inputing')
                                    .classList.remove('pro-group-inputing')
                                },
                              },
                              {
                                component: 'Button',
                                text: '取消',
                                size:'small',
                                onClick: ({ sender }) => {
                                  item.input.clear()
                                
                                  
                                  sender.element
                                    .closest('.pro-group-inputing')
                                    .classList.remove('pro-group-inputing')
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            }
          },
          data: [...data,{
            isCreateBtn:true
          }],
        },
      })
    }

    _renderEventList(itemData,item) {
        const me = this
      const { itemRender } = this.props

      const defaultRender =
        itemRender ||
        function ({ itemData }) {
          return {
            children: {
              component: 'List',
              align: 'start',
              gutter: 'sm',
      

              items: [
               !!itemData.tasks && {
                  component: 'Flex',
                  align: 'center',
                  cols: [
                    {
                      component: 'Icon',
                      type: 'tasks',
                      classes: {
                        'pro-group-event-icon': true,
                      },
                    },
                    { children: itemData.tasks },
                  ],
                },
                !!itemData.date && {
                  component: 'Flex',
                  align: 'center',
                  cols: [
                    {
                      component: 'Icon',
                      type: 'clock',
                      classes: {
                        'pro-group-event-icon': true,
                      },
                    },
                    { children: itemData.date },
                  ],
                },
              ],
            },
          }
        }

      return {
        component: 'List',
        classes: {
          'pro-group-box-list': true,
        },

        onCreated: ({ inst }) => {

          item.eventList = inst
        },
        cols: 1,
        itemRender: ({ itemData }) => {
          return {
            component: 'Flex',
            classes: {
              'pro-group-card': true,
            },
            gap: 'small',
            onClick:()=>{
              me._onEventClick({itemData})
            },
            rows: [
              {
                align: 'start',

                cols: [
                  {
                    classes: {
                      'pro-group-card-status-line': true,
                    },
                  },
                  {
                    classes: {
                      'pro-group-checkbox': true,
                    },
                    children: {
                      component: 'Checkbox',
                      value:itemData.checked
                    },
                  },
                  {
                    rows: [
                      {
                        children: itemData.name,
                      },
                    ],
                  },
                ],
              },
              {
                attrs: {
                  style: {
                    paddingLeft: '22px',
                  },
                },
                children: itemData.eventRender
                  ? itemData.eventRender({ itemData })
                  : defaultRender({ itemData }),
              },
            ],
          }
        },
        data: itemData.events,
      }
    }

    _rendered() {
      this._initDragable()
    }

    _initDragable() {
      const me = this

      const listArr = []

      const boxArr = [this.element.querySelector('.pro-group-main ul')]
      const lists = this.element.querySelectorAll('.pro-group-box-list')
      lists.forEach((n) => {
        listArr.push(n.querySelector('ul'))
      })

      this.boxDrag = Dragula({
        containers: boxArr,
        moves: function (el, source, handle, sibling) {
          if (handle.closest('.pro-group-title')) {
            return true
          }
          return false
        },
      })

      this.listDrag = Dragula({
        containers: listArr,
        moves: function (el, source, handle, sibling) {
          if (handle.closest('.pro-group-card ')) {
            return true
          }
          return false
        },
      })

      this.listDrag.on('drop', function (el, target, source, sibling) {
        me._handleEventDrop({el, target, source, sibling})
      })

      this.listDrag.on('cancel', function (el, container, source) {
        me._handleEventDrop({isCancel:true})
      })

      this.listDrag.on('drag', function (el, source) {
        me._handleEventDrag()
      })
    }

    _handleEventDrop({el, target, source, sibling,isCancel}) {
      this.element.querySelectorAll('.pro-group-event-add').forEach((n) => {
        n.classList.remove('hide')
      })

      this.element.querySelectorAll('.pro-group-box-list').forEach((n) => {
        n.closest('.nom-flex-item').classList.remove('strech')
      })

      if (isCancel) {
        return
      }

      // const k = el.component.key

      const s =  source.closest('.nom-list').component
      const sData = this._getListData(s)

      const t =  target.closest('.nom-list').component
      const tData = this._getListData(t)
      s.update({data:sData})
      t.update({data:tData})

      this._initDragable()
    
      console.log(this.getData())
    }

    _handleEventDrag() {
      this.element.querySelectorAll('.pro-group-event-add').forEach((n) => {
        n.classList.add('hide')
      })

      this.element.querySelectorAll('.pro-group-box-list').forEach((n) => {
        n.closest('.nom-flex-item').classList.add('strech')
      })
    }

    _onEventClick (args) {
      
    }

    _appendList() {
      const d = this.getData()
      d.push({
        id: nomui.utils.newGuid(),
        name: '新列表',
        events:[]
      })



      this.update({
        data:d
      })
    }

    _getListData(target) {
      const data = target.getAllItems().map((n) => {
        return n.props.data
      })
      return data
    }

    getData() {
      const data = this.mainList.getAllItems().filter(n=>{return n.props.data.isCreateBtn!==true}).map((n) => {
        const { events, ...base } = n.props.data
        const c = n.eventList.getAllItems()
        base.events = c.map((e) => {
          return e.props.data
        })
        return base
      })

      return data
    }


  }

  return ProGroup
})
