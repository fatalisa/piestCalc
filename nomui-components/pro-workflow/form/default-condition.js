define([], function () {
  return (modal) => {
    const { args } = modal.props
    const { workFlowInfo, inst } = args
    var flowProp_database = inst.props.data.database;

    const currentStep = args.item;
    var sqlConditionRef;

    var viewBag =
    {
      oid: workFlowInfo.Model.oid,
      Category: workFlowInfo.Model.Category,
    };

    const renderTab1 = () => {
      return {
        component: 'Flex',
        rows: [
          {
            component: 'Form',
            fieldDefaults: {
              labelAlign: 'top',
            },
            fields: [
              {
                component: 'MultilineTextbox',
                label: 'SQL条件',
                name: 'div_sql_value',
                ref: (c) => {
                  sqlConditionRef = c;
                },
                value: currentStep.condition && currentStep.condition.sqlWhere ? currentStep.condition.sqlWhere : null,
                onValueChange: ({ newValue }) => {
                  var str = newValue;
                  if (str.length <= 0) {
                    currentStep.condition.isConditionLine = false;
                  } else {
                    currentStep.condition.isConditionLine = true;
                  }
                  currentStep.condition.sqlWhere = str
                },
              },
              {
                component: 'Button',
                text: '测试SQL条件',
                type: 'primary',
                name: 'test_sqlcondition',
                onClick: ({ sender, event }) => {
                  if (!flowProp_database
                    || !flowProp_database.table) {
                    new nomui.Alert({
                      type: 'warning',
                      title: '警告',
                      description: '请先在【属性】中设置表及主键信息!',
                    })
                    return;
                  }
                  if (!currentStep.condition.sqlWhere) {
                    new nomui.Alert({
                      type: 'warning',
                      title: '警告',
                      description: 'SQL条件不能为空',
                    })
                    return;
                  }

                  console.log('sqlWhere',currentStep.condition.sqlWhere);
                  axios({
                    method: 'post',
                    url: `/Common/WorkFlow/TestLineSqlWhere`,
                    params: {
                      oid: viewBag.oid,
                      TableName: flowProp_database.table,
                      SqlWhere: currentStep.condition.sqlWhere
                    },
                  }).then(ar => {
                    if (ar.Success) {
                      new nomui.Alert({
                        type: 'success',
                        title: '成功',
                        description: '条件测试成功!',
                      })
                    } else {
                      new nomui.Alert({
                        type: 'error',
                        title: '失败',
                        description: '条件测试失败!',
                      })
                    }
                  })
                }
              },
            ],
          },
          {
            children: `#<p>1.条件对应的表为流程对应的主表</p><p>2.条件对应的字段为流程主表字段</p><p>3.示例：a=1 and b='1'</p>`,
          },
        ],
      }
    }
    const renderTab2 = () => {
      return {
        component: 'Flex',
        rows: [
          {
            component: 'Form',
            fieldDefaults: {
              labelAlign: 'top',
            },
            fields: [
              {
                component: 'MultilineTextbox',
                label: '自定义方法',
                name: 'custom_method',
                value: currentStep.condition && currentStep.condition.customMethod ? currentStep.condition.customMethod : null,
                onValueChange: ({ newValue }) => {
                  var str = newValue.replace(/\s*/g, "");
                  if (str.length > 0) {
                    currentStep.condition.customMethod = str
                  }
                },
              },
            ],
          },
          {
            children: `#<p>1.方法名称格式为：命名空间.类名.方法名（例：CTS.WebSite.Areas.Common.Controllers.WorkFlowRunController.TestMethod）</p>
            <p>2.方法返回类型为 bool 类型的 True 时条件满足,返回其它类型且字符串值不为 "1" 时条件不满足</p>
            <p>3.方法返回类型为 bool 类型时提示信息为上面输入的信息，否则提示返回的值</p>
            <p>4.方法访问限定符为 Public,方法为实例方法</p>`,
          },
        ],
      }
    }

    return {
      header: {
        caption: { title: '步骤条件' },
      },
      body: {
        children: {
          children: {
            component: 'Tabs',
            uistyle: 'line',
            onTabSelectionChange: ({ key }) => {
              // console.log(`选中的key:${key}`)
            },
            tabs: [
              {
                key: 'sql',
                item: { text: 'SQL条件' },
                panel: {
                  children: renderTab1(),
                },
              },
              {
                key: 'custom',
                item: { text: '自定义方法' },
                panel: {
                  children: renderTab2(),
                },
              },
            ],
          },
        },
      },
      footer: {
        children: {
          component: 'Cols',
          items: [
            {
              component: 'Button',
              type: 'primary',
              text: '确定',
              onClick: () => {
                modal.props.handleOk({ item: currentStep })
                modal.close()
              },
            },
            {
              component: 'Button',
              text: '取消',
              onClick: () => {
                modal.close()
              },
            },
          ],
        },
      },
    }
  }
})
