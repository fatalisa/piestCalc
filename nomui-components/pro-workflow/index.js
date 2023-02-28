define(['css!/nomui-components/pro-workflow/index.css'], function () {
  class ProWorkflow extends nomui.Component {
    constructor(props, ...mixins) {
      const defaults = {
        readonly: false,
        data: {
          data: [],
          lines: [],
        },
        workFlowInfo: {},
        buttons: {},
        hideFirstStep: false,
        forms: {
          step: '/webapp/nomui-components/pro-workflow/form/default-step.js',
          condition: '/webapp/nomui-components/pro-workflow/form/default-condition.js',
          flowprop: '/webapp/nomui-components/pro-workflow/form/default-flowprop.js',
        },
        toolRender: null,
      }

      super(nomui.Component.extendProps(defaults, props), ...mixins)
    }

    _created() {
      this.stepRef = {}
      this.backArrList = {}
      this.flowData = null
    }

    _config() {
      const that = this
      this.setProps({
        children: [
          this.props.toolRender && {
            component: 'Flex',
            classes: {
              'workflow-tools': true,
            },
            justify: 'end',
            gutter: 'small',
            cols: this.props.toolRender(this),
          },
          {
            component: 'Flex',
            classes: {
              'workflow-root': true,
              'hide-first': this.props.hideFirstStep,
            },
            _created: function () {
              that.flowRef = this
              that._createFlow()
            },
          },
        ],
      })
    }

    _createNew(isDouble) {
      const { data } = this.props.data
      // data.push(this._newStep())
      if (!isDouble) {
        data.push(this._newStep())
      }
      else {
        const n = this._newStep()
        data.push(Object.assign({}, n, { hidden: true }))
        this._addMultiple(n.id)
      }
      this.update({ data: this.props.data })
    }

    _createFlow() {
      const data = this.props.data ? this.props.data.data : []
      let backArr = ''

      const createStep = (arr, isEqual) => {
        const data = arr.map((n, i) => {
          if (!n.children || !n.children.length) {
            backArr += `/ ${n.id}`
            return this._drawStep({ item: n, isEqual: isEqual && i === 0, backArr: backArr })
          } else {
            const c = n.children.map((a) => {
              return {
                fit: true,
                rows: createStep(a, true),
              }
            })

            return {
              component: 'Flex',
              fit: true,
              classes: {
                'equal-group': true,
              },
              rows: [
                {
                  component: 'Flex',
                  classes: {
                    'equal-flow': c.length > 1,
                  },
                  attrs: {
                    'data-equal-length': c.length,
                  },
                  fills: true,
                  cols: c,
                },
                {
                  justify: 'center',
                  fit: true,
                  cols: [
                    {
                      classes: {
                        'workflow-line-y': true,
                        fit: true,
                      },
                    },
                  ],
                },
              ],
            }
          }
        })
        return data
      }

      const s = createStep(data)

      this._updateFlow(s)
    }
    _updateFlow(data) {
      if (!data.length) {
        data.push({
          component: 'Flex',
          justify: 'center',
          rows: [
            {
              classes: {
                'workflow-card': true,
              },
              fit: true,
              rows: [
                {
                  classes: {
                    'workflow-card-before': true,
                  },
                  rows: [
                    {
                      justify: 'center',
                      cols: [
                        {
                          classes: {
                            'workflow-line-y': true,
                          },
                        },
                      ],
                    },
                  ],
                },

                {
                  classes: {
                    fit: true,
                    'workflow-card-after': true,
                  },
                  rows: [
                    {
                      justify: 'center',
                      cols: [
                        {
                          classes: {
                            'workflow-add': true,
                          },
                          component: 'Icon',
                          type: 'plus',
                          popup: {
                            children: {
                              component: 'List',
                              classes: {
                                'workflow-add-menu': true,
                              },
                              gutter: 'md',
                              cols: 1,
                              items: [
                                {
                                  text: '新增步骤',
                                  icon: 'profile',
                                  onClick: () => {
                                    this._createNew()
                                  },
                                },
                                {
                                  icon: 'multiple-box',
                                  onClick: () => {
                                    this._createNew(true)
                                  },
                                  text: '新增并行步骤',
                                },
                              ],
                              itemDefaults: {
                                onConfig: ({ inst }) => {
                                  inst.setProps({
                                    children: {
                                      component: 'Flex',
                                      align: 'center',
                                      cols: [
                                        { component: 'Icon', type: inst.props.icon || 'plus' },
                                        {
                                          children: inst.props.text,
                                        },
                                      ],
                                    },
                                  })
                                },
                              },
                            }
                          }
                        },
                      ],
                    },
                    {
                      justify: 'center',
                      fit: true,
                      cols: [
                        {
                          classes: {
                            'workflow-line-y': true,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          // onClick: () => {
          //   this._createNew()
          // },
        })
      }
      data.unshift({
        component: 'Flex',
        justify: 'center',
        cols: [
          {
            classes: {
              'workflow-flag': true,
            },
            rows: [{ component: 'Icon', type: 'start-mark' }, { children: '流程开始' }],
          },
        ],
      })

      data.push({
        component: 'Flex',
        justify: 'center',
        cols: [
          {
            classes: {
              'workflow-flag': true,
            },
            rows: [{ component: 'Icon', type: 'finish-mark' }, { children: '流程结束' }],
          },
        ],
      })
      this.flowRef.update({
        rows: data,
      })
    }


    _drawStep({ item, isEqual, backArr }) {
      if (!item) {
        item = this._newStep()
      }

      const stepDealInfo = (stepItem) => {
        if (stepItem && stepItem.behavior && stepItem.behavior.selectRange) {
          var rangeArr = stepItem.behavior.selectRange.split('|');
          if (rangeArr.length > 1) {
            var nameArr = rangeArr[1].split(',');
            if (nameArr.length >= 3) {
              return nameArr[0] + ',' + nameArr[1] + '...';
            } else {
              var nameInfo = rangeArr[1];
              if (nameInfo[nameInfo.length - 1] == ',') {
                return nameInfo.substring(0, nameInfo.length - 1);
              } else {
                return nameInfo;
              }
            }
          }
        }
        return '';
      }

      const card = {
        component: 'Flex',
        onCreated: ({ inst }) => {
          this.stepRef[item.id] = inst
          this.backArrList[item.id] = backArr
        },
        classes: {
          'workflow-item': true,
          'workflow-item-hidden': item.hidden
        },
        fit: true,
        rows: [
          {
            classes: {
              'workflow-card': true,
            },
            fit: true,
            rows: [
              {
                classes: {
                  'workflow-card-before': true,
                },
                rows: [
                  {
                    justify: 'center',
                    cols: [
                      {
                        classes: {
                          'workflow-line-y': true,
                        },
                      },
                    ],
                  },
                  isEqual && {
                    justify: 'center',
                    cols: [
                      {
                        classes: {
                          'workflow-case': true,
                          'workflow-case-active': isEqual && item.condition && item.condition.sqlWhere ? true : false,
                        },
                        component: 'Icon',
                        type: 'case',
                        onClick: () => {
                          this._showCasePopup(item.id)
                        },
                      },
                    ],
                  },
                  isEqual && {
                    justify: 'center',
                    cols: [
                      {
                        classes: {
                          'workflow-line-y': true,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                justify: 'center',

                cols: [
                  {
                    attrs: {
                      style: {
                        width: '200px',
                      },
                    },
                    children: {
                      classes: {
                        'workflow-card-box': true,
                      },
                      onClick: () => {
                        this._showStepPop(item.id)
                      },
                      rows: [
                        !this.props.readonly && {
                          component: 'Button',
                          classes: {
                            'remove-flow-btn': true,
                          },
                          icon: 'times',
                          type: 'text',
                          size: 'small',
                          onClick: ({ event }) => {
                            event.stopPropagation()
                            this._removeStep(item.id)
                          },
                        },
                        {
                          rows: [
                            {
                              attrs: {
                                style: {
                                  'font-weight': 'bold',
                                },
                              },
                              children: item.name
                            },
                            {
                              attrs: {
                                style: {
                                  'word-break': 'break-all'
                                }
                              },
                              children: stepDealInfo(item)
                            }
                          ]
                        },
                      ],
                    },
                  },
                ],
              },
              {
                classes: {
                  fit: true,
                  'workflow-card-after': true,
                },
                rows: [
                  !this.props.readonly && {
                    justify: 'center',
                    cols: [
                      {
                        classes: {
                          'workflow-line-y': true,
                        },
                      },
                    ],
                  },
                  !this.props.readonly && {
                    justify: 'center',
                    cols: [
                      {
                        classes: {
                          'workflow-add': true,
                        },
                        component: 'Icon',
                        type: 'plus',
                        popup: {
                          children: this._showAddPopup(item.id),
                        },
                      },
                    ],
                  },
                  {
                    justify: 'center',
                    fit: true,
                    cols: [
                      {
                        classes: {
                          'workflow-line-y': true,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }

      return card
    }

    getData() {
      return this.props.data
    }

    setData(param) {
      this.update({
        data: param,
      })
    }

    _showStepPop(param) {
      const item = this._getItem({ target: param })
      const backSteps = this._getBackSteps(param)
      new nomui.Modal({
        size: 'medium',
        content: this.props.forms.step,
        args: {
          item: item,
          workFlowInfo: this.props.workFlowInfo,
          backSteps: backSteps,
          buttons: this.props.buttons,
          readonly: this.props.readonly
        },
        handleOk: ({ item }) => {
          this._getItem({ target: item.id, data: item })
          this._createFlow()
        },
      })
    }

    showFlowProp() {
      new nomui.Modal({
        size: 'medium',
        content: this.props.forms.flowprop,
        args: { workFlowInfo: this.props.workFlowInfo, inst: this, readonly: this.props.readonly },
        handleOk: ({ item }) => {
          if (!this.props.data.database) {
            this.props.data.database = {
              table: '',
              primaryKey: '',
            }
          }
          this.props.data.database.table = item.table
          this.props.data.database.primaryKey = item.primaryKey
          this._createFlow()
        },
      })
    }



    _ifItemInChildren({ target, item }) {
      let flag = false


      const mapArr = (data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === item) {
            flag = true
            break
          }
          if (Array.isArray(data[i])) {
            mapArr(data[i])
          }
          if (data.children) {
            data.children.forEach((c) => {
              mapArr(c)
            })
          }
        }
      }

      if (Array.isArray(target)) {
        mapArr(target)
      } else if (target.children) {
        mapArr(target.children)
      } else if (target.id === item) {
        flag = true
      }

      return flag
    }

    _getBackSteps(target) {
      const arr = []
      let skip = false
      const findArr = (item) => {
        for (let i = 0; i < item.length; i++) {
          if (skip) {
            return
          }
          if (item[i].id && item[i].id === target) {
            skip = true
            break
          }
          if (item[i].id && item[i].id !== target) {
            arr.push(item[i])
          } else if (item[i].children) {
            const c = item[i].children
            if (this._ifItemInChildren({ target: c, item: target })) {
              for (let x = 0; x < c.length; x++) {
                if (this._ifItemInChildren({ target: c[x], item: target })) {
                  !skip && findArr(c[x])
                  break
                }
              }
            } else {
              c.forEach((n) => {
                !skip && findArr(n)
              })
            }
          }
        }
      }
      findArr(this.props.data.data)
      return arr
    }

    _getItem({ arr, target, data }) {
      if (!arr) {
        arr = this.props.data.data
      }
      let obj = null
      const findArr = (item) => {
        for (let i = 0; i < item.length; i++) {
          if (item[i].id && item[i].id === target) {
            obj = item[i]
            if (data) {
              item[i] = Object.assign({}, item[i], data)
            }
            break
          } else if (item[i].children) {
            item[i].children.forEach((n) => {
              findArr(n)
            })
          }
        }
      }
      findArr(arr)
      return obj
    }

    _showCasePopup(param) {
      const item = this._getItem({ target: param })

      new nomui.Modal({
        size: 'medium',
        content: this.props.forms.condition,
        args: { item: item, workFlowInfo: this.props.workFlowInfo, inst: this, readonly: this.props.readonly },
        handleOk: ({ item }) => {
          this._getItem({ target: item.id, data: item })
          this._createFlow()
        },
      })
    }

    _showAddPopup(param) {
      return {
        component: 'List',
        classes: {
          'workflow-add-menu': true,
        },
        gutter: 'md',
        cols: 1,
        items: [
          {
            text: '新增步骤',
            icon: 'profile',
            onClick: () => {
              this._addSingle(param)
            },
          },
          {
            icon: 'multiple-box',
            onClick: () => {
              this._addMultiple(param)
            },
            text: '新增并行步骤',
          },
        ],
        itemDefaults: {
          onConfig: ({ inst }) => {
            inst.setProps({
              children: {
                component: 'Flex',
                align: 'center',
                cols: [
                  { component: 'Icon', type: inst.props.icon || 'plus' },
                  {
                    children: inst.props.text,
                  },
                ],
              },
            })
          },
        },
      }
    }

    _insertItem(arr, index, value) {
      arr.splice(index, 0, value)
      return arr
    }

    _removeItem(arr, index) {
      arr.splice(index, 1)
      return arr
    }

    _newStep() {
      return {
        id: nomui.utils.newGuid(),
        name: '新步骤',
        condition: {
          customMethod: '',
          sqlWhere: '',
          noaccordMsg: '',
          isConditionLine: false,
        },
        type: 'normal',
        opinionDisplay: '',
        expiredPrompt: '0',
        expiredPromptDays: '',
        signatureType: '',
        workTime: '',
        limitTime: '',
        otherTime: '',
        archives: '',
        archivesParams: '',
        note: '',
        position: {
          x: 196,
          y: 199,
          width: 108,
          height: 50,
        },
        skipType: '0',
        behavior: {
          flowType: '',
          runSelect: '',
          handlerType: '1',
          handlerAlert: '0',
          isCascade: 1,
          isCUserTask: 1,
          selectRange: '',
          handlerStep: '',
          valueField: '',
          defaultHandler: '',
          hanlderModel: '',
          backModel: '',
          backType: '1',
          backStep: '',
          percentage: '',
          countersignature: '0',
          countersignaturePercentage: '',
        },
        forms: [],
        buttons: [
          {
            id: '2',
            name: '审批',
            sort: 1,
          },
        ],
        fieldStatuses: [],
        itemGroupStatuses: [],
        event: {
          submitBefore: '',
          submitAfter: '',
          backBefore: '',
          backAfter: '',
        },
      }
    }
    _removeStep(target) {
      let { data } = this.props.data
      let skip = false

      if (
        data.filter((n, i) => {
          return n.id === target && i === 0
        }).length &&
        data[1] &&
        data[1].children
      ) {
        new nomui.Alert({ title: '初始节点不能是并行分支' })
        return
      }

      if (
        data.filter((n, i) => {
          return n.id === target && i === data.length - 1
        }).length &&
        data[data.length - 2] &&
        data[data.length - 2].children
      ) {
        new nomui.Alert({ title: '并行分支必须指向一个共同后续节点' })
        return
      }

      const findArr = (item, equal, equalIndex, equalParent) => {
        for (let i = 0; i < item.length; i++) {
          if (skip) return
          if (item[i].id && item[i].id === target) {
            if (item.length < 2) {
              this._removeItem(equal, equalIndex)

              if (equal && equal.length === 1) {
                const index = equalParent.findIndex((item) => {
                  return this._ifItemInChildren({ target: item, item: equal[0][0].id })
                })

                let result = []
                const getObjFromArr = (arr) => {
                  if (Array.isArray(arr[0])) {
                    getObjFromArr(arr[0])
                  } else {
                    result = [...arr]
                  }
                }
                getObjFromArr(equal)

                equalParent.splice(index, 1, ...result)
              }
            } else {
              this._removeItem(item, i)
            }
            break
          } else if (item[i].children) {
            item[i].children.forEach((n, x) => {
              findArr(n, item[i].children, x, item)
            })
          }
        }
      }

      if (data.length === 1) {
        this.props.data.data = []
      } else {
        findArr(data)
      }

      if (data[0].hidden && !data[1].children) {
        this._removeItem(data, 0)
      }

      this._createFlow()
    }

    _addSingle(target) {
      const { data } = this.props.data
      const findArr = (item) => {
        for (let i = 0; i < item.length; i++) {
          if (item[i].id && item[i].id === target) {
            this._insertItem(item, i + 1, this._newStep())
            break
          } else if (item[i].children) {
            item[i].children.forEach((n) => {
              findArr(n)
            })
          }
        }
      }

      findArr(data)
      this._createFlow()
    }

    _addMultiple(target) {
      const { data } = this.props.data
      const findArr = (item) => {
        for (let i = 0; i < item.length; i++) {
          if (item[i].id && item[i].id === target) {
            if (item[i + 1] && item[i + 1].children) {
              item[i + 1].children = [...item[i + 1].children, [this._newStep()]]
            } else {
              const c = { children: [[this._newStep()], [this._newStep()]] }
              this._insertItem(item, i + 1, c)
            }

            break
          } else if (item[i].children) {
            item[i].children.forEach((n) => {
              findArr(n)
            })
          }
        }
      }

      findArr(data)
      if (data[data.length - 1].children) {
        data.push(this._newStep())
      }
      this._createFlow()
    }
  }

  return ProWorkflow
})
