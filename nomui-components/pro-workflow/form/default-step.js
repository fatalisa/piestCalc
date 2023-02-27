define(['pro-tree-select'], function (ProTreeSelect) {
  return (modal) => {
    const { args } = modal.props
    const { workFlowInfo, readonly, backSteps, buttons } = args
    const currentStep = args.item;
    var buttonArr = [];
    var personTablRoom = [];
    var viewBag =
    {
      oid: workFlowInfo.Model.oid,
      Category: workFlowInfo.Model.Category,
      ActiveMenu: workFlowInfo.Model.ActiveMenu,
      StudySiteFlow: workFlowInfo.Model.VersionModel.StudySiteFlow
    };
    const studySiteFlow = viewBag.StudySiteFlow;
    var formList = workFlowInfo.FormList;
    var sel_handlerTypeRef, treesel_handlerRangeRef, sel_backStepRef, personTableRef, tab_buttonRef, formSettingRef, formFormsRef;

    const items = []
    if (viewBag.Category == '101' || viewBag.Category == '103' || viewBag.Category == '104') {
      items.push({ text: '项目角色', value: '5' })
    } else {
      items.push({ text: '部门', value: '1' }, { text: '组织角色', value: '2' })
    }
    if (studySiteFlow) {
      items.push({ text: '分配到项目的机构个人角色', value: '6' }, { text: '分中心PI', value: '3' }, { text: '咨询PI', value: '7' })
    }
    if (viewBag.Category != '101' && viewBag.Category != '103' && viewBag.Category != '104') {
      items.push({ text: '人员', value: '4' })
    }

    const itemsBack = [
      { text: '退回前一步', value: '0' },
      { text: '退回第一步', value: '1' },
      { text: '退回某一步', value: '2' },
    ]

    if ((viewBag.Category == '1' || viewBag.Category == '22') && studySiteFlow) {
      itemsBack.push({ text: '退回机构秘书', value: '3' })
      if (viewBag.Category == '1') {
        itemsBack.push({ text: '退回重新提交', value: '4' })
      }
    } else {
      itemsBack.push({ text: '退回重新提交', value: '3' })
    }

    const getTabs = () => {
      var result = [{
        key: 'info',
        item: { text: '步骤信息' },
        panel: {
          children: renderStepInfoTab(),
        },
      }];
      if (studySiteFlow || viewBag.Category == '101' || viewBag.Category == '103') {
        result.push({
          key: 'actions',
          item: { text: '按钮' },
          hidden: true,
          panel: {
            children: renderButtonTab(),
          },
        });
      }
      if (studySiteFlow) {
        result.push({
          key: 'events',
          item: { text: '事件' },
          panel: {
            children: renderEvensTab(),
          },
        });
      }

      return result;
    }

    const removeByValue = (arr, attr, value) => {
      var index = 0;
      for (var i in arr) {
        if (arr[i][attr] == value) {
          index = i;
          break;
        }
      }
      arr.splice(index, 1);
    }

    const getBackSteps = () => {
      var result = [];
      for (const s of backSteps) {
        result.push({ text: s.name, value: s.id });
      }
      return result;
    }

    const getFormValue = () => {
      if (currentStep.forms && currentStep.forms.length > 0) {
        return currentStep.forms[0].id;
      }
    }
    const getFormList = () => {
      var result = [];
      if (!formList || formList.length <= 0) {
        return result;
      }
      for (const s of formList) {
        result.push({
          text: s.CodeText,
          value: s.CodeValue
        });
      }
      return result;
    }

    const initPersonRoom = () => {
      if (currentStep.selectDataModel) {
        var selectData = JSON.parse(currentStep.selectDataModel.selectjson)
        selectData.map((item, index) => {
          var deptIdArr = item.DeptIds.split(',');
          personTablRoom.push({
            userId: item.UserId,
            deptIds: deptIdArr
          });
        })
      } else {
        let formData = new FormData()
        formData.append('versionId', workFlowInfo.Model.Version.Id)
        formData.append('stepId', currentStep.id)
        formData.append('oid', viewBag.oid)

        axios({
          method: 'post',
          url: `/Common/WorkFlow/GetListByFlowId`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((res) => {
          if (res.Success) {
            res.Data.map((n, i) => {
              var deptIds = [];
              if (n.DeptIds) {
                deptIds = n.DeptIds.split(',');
              }
              personTablRoom.push({ userId: n.UserId, deptIds: deptIds });
            });
          }
        })
      }
    }

    const init = () => {
      // 兼容老数据中的错误属性
      if (currentStep.behavior.hasOwnProperty('IsCUserTask')) {
        currentStep.behavior.isCUserTask = currentStep.behavior.IsCUserTask;
        Reflect.deleteProperty(currentStep, 'IsCUserTask')
      }
      if (currentStep.skipType === 0 || currentStep.skipType === 1) {
        currentStep.skipType = '';
      }

      // 部分老数据没有此属性
      if (currentStep.behavior.isCascade == undefined
        || currentStep.behavior.isCascade == null) {
        currentStep.behavior.isCascade = 1;
      }

      // 部分老数据没有此属性
      if (currentStep.behavior.isCUserTask == undefined
        || currentStep.behavior.isCUserTask == null) {
        currentStep.behavior.isCUserTask = 1;
      }

      buttonArr = JSON.parse(JSON.stringify(buttons.items));
      buttonArr.map((n, i) => {
        var currentStepBut = currentStep.buttons.find(s => s.id == n.Id);

        if (currentStepBut && currentStepBut.name) {
          n.Title = currentStepBut.name;
        }
      })
      if (!currentStep.expiredPromptDays) {
        // 兼容老数据，没有expiredPromptDays属性
        currentStep.expiredPromptDays = '';
      }
    }
    init();
    initPersonRoom();

    const refreshTreeHanderRange = (dealType, inst) => {
      axios.post(`/Common/WorkFlow/SelectDealwithTypeTree?dealType=${dealType}&oid=${viewBag.oid}`)
        .then((res) => {
          inst.update({ options: res })
          if (dealType == '4') {
            updatePersonData(treesel_handlerRangeRef.selectedArr)
          }
        })
    }
    const selectRangeValue = () => {
      var result = [];
      if (!currentStep.behavior.selectRange) {
        return result;
      }
      if (!currentStep.behavior.selectRange) {
        return result;
      }
      var valueStrArr = currentStep.behavior.selectRange.split('|');
      if (valueStrArr && valueStrArr.length > 0) {
        var valueArr = valueStrArr[0].split(',');
        valueArr.map((n, i) => {
          if (n) {
            result.push(n);
          }
        })
      }
      return result;
    }

    const resetRangeValue = (abandonValues) => {
      // 老数据中的处理者，可能已经被移除了，需要重置
      if (!currentStep.behavior.selectRange) {
        return;
      }
      var valueStrArr = currentStep.behavior.selectRange.split('|');
      if (valueStrArr && valueStrArr.length > 1) {
        var valueArr = valueStrArr[0].split(',');
        var textArr = valueStrArr[1].split(',');
        var newValue = '';
        var newText = '';
        valueArr.map((n, i) => {
          // 由于split n 可能为空
          if (n && !abandonValues.find(s => s == n)) {
            newValue += n + ',';
            newText += textArr[i] + ',';
          }
        })
        currentStep.behavior.selectRange = newValue + '|' + newText
      }
    }

    const getSelTableHidden = () => {
      var stepHandlerType = currentStep.behavior.handlerType;
      return stepHandlerType != '4';
    }

    const saveSelectData = () => {
      if (currentStep.behavior.handlerType != '4') {
        currentStep.selectDataModel = null;
        return;
      }
      var selectData = personTableRef.props.data;

      var selectjsonObj = [];
      selectData.map((item, index) => {
        var deptIds = [];
        var stepRoomInfo = personTablRoom.find(s => s.userId == item.Value);
        if (stepRoomInfo) {
          deptIds = stepRoomInfo.deptIds;
        }
        var deptIdStr = '';
        if (deptIds.length > 0) {
          deptIds.map((depItem, index) => {
            deptIdStr += depItem + ',';
          });
          if (deptIdStr.length > 0) {
            deptIdStr = deptIdStr.substring(0, deptIdStr.length - 1);
          }
        }
        selectjsonObj.push({
          UserId: item.Value,
          UserName: item.text,
          DeptIds: deptIdStr
        });
      });

      currentStep.selectDataModel = {
        stepId: currentStep.id,
        selectjson: JSON.stringify(selectjsonObj)
      };
    }

    const updatePersonData = (data) => {
      if (data.length == 0) {
        personTableRef.update({ data: [] });
        return;
      }
      data.map((item, index) => {
        var roomInfo = personTablRoom.find(s => s.userId == item.Value);
        if (roomInfo) {
          item.deptIds = roomInfo.deptIds
        }
      })
      personTableRef.update({ data: data });
    }

    const updatePersonRoom = (userId, newValue) => {

      personTablRoom.forEach((item, index, personTablRoom) => {
        if (item.userId === userId) {
          personTablRoom.splice(index, 1);
        }
      });
      personTablRoom.push({ userId: userId, deptIds: newValue });
    }

    const getSelTableCols = () => {
      var result = [];
      result.push(
        {
          field: 'text',
          title: '处理者',
          width: 50,
        }
      )
      if (studySiteFlow) {
        result.push(
          {
            field: 'Value',
            title: '负责科室',
            width: 150,
            cellRender: (obj) => {
              return {
                component: 'TreeSelect',
                disabled: readonly,
                ref: (c) => {
                  // treesel_handlerRangeRef = c
                },
                autoRender: true,
                placeholder: '默认负责所有科室，重新分配请选择',
                searchable: {
                  placeholder: '按姓名搜索',
                },
                allowClear: true,
                onlyleaf: true,
                multiple: true,
                treeDataFields: {
                  key: 'Id',
                  text: 'NodeText',
                },
                nodeCheckable: {
                  cascadeCheckParent: false,
                  cascadeUncheckParent: false,
                },
                required: true,
                value: obj.rowData.deptIds ? obj.rowData.deptIds : [],
                options: workFlowInfo.DepList,
                onCreated: ({ inst }) => {
                },
                onValueChange({ newValue }) {
                  updatePersonRoom(obj.rowData.Value, newValue);
                },
              };
            },
          },
        )
      }
      result.push(
        {
          field: 'Value',
          title: '操作',
          width: 60,
          cellRender: (obj) => {
            return {
              component: 'Button',
              type: 'primary',
              text: '删除',
              disabled: readonly,
              danger: true,
              onClick: () => {
                var rangeValues = treesel_handlerRangeRef.getValue();
                rangeValues.forEach((item, index, rangeValues) => {
                  if (item === obj.rowData.Value) {
                    rangeValues.splice(index, 1);
                  }
                });
                if (rangeValues.length == 0) {
                  treesel_handlerRangeRef.setValue(null);
                } else {
                  treesel_handlerRangeRef.update({ value: rangeValues });
                }

                updateSelectRange(treesel_handlerRangeRef.selectedArr);

                var personValues = personTableRef.props.data;
                personValues.forEach((item, index, personValues) => {
                  if (item.Value === obj.rowData.Value) {
                    personValues.splice(index, 1);
                  }
                });

                updatePersonData(personValues);
              },
            }
          },
        },

      )
      return result;
    }

    const updateSelectRange = (items) => {
      if (!items || items.length == 0) {
        currentStep.behavior.selectRange = '';
      } else {
        var valueStr = '';
        var textStr = '';
        items.map((n, i) => {
          valueStr += n.Value + ',';
          textStr += n.text + ',';
        });
        currentStep.behavior.selectRange = valueStr + '|' + textStr;
      }
    }

    const hiddentWorkTime = () => {
      return currentStep.expiredPrompt != '1'
    }

    const renderStepInfoTab = () => {
      var result = {
        component: 'Form',
        fields: [
          {
            component: 'Textbox',
            label: '步骤名称',
            name: 'base_Name',
            value: currentStep.name,
            disabled: readonly,
            onValueChange: ({ newValue }) => {
              currentStep.name = newValue
            },
          },
          {
            component: 'Select',
            label: '处理者类型',
            name: 'behavior_HandlerType',
            disabled: readonly,
            ref: (c) => {
              sel_handlerTypeRef = c
            },
            value: currentStep.behavior.handlerType,
            options: items,
            onValueChange({ newValue }) {
              currentStep.behavior.handlerType = newValue;
              currentStep.behavior.selectRange = '';
              treesel_handlerRangeRef.setValue(null)
              var hiddenPersonTable = () => {
                personTableRef.update({ hidden: true, data: [] });
              }

              if (newValue == '3' || newValue == '7') {
                treesel_handlerRangeRef.update({ hidden: true });
                hiddenPersonTable();
              } else {
                if (newValue == '4') {
                  personTableRef.update({ hidden: false });
                } else {
                  hiddenPersonTable();
                }
                treesel_handlerRangeRef.update({ hidden: false });
                refreshTreeHanderRange(newValue, treesel_handlerRangeRef);
              }
            },
          },
          {
            component: ProTreeSelect,
            ref: (c) => {
              treesel_handlerRangeRef = c
            },
            label: '处理者范围',
            disabled: readonly,
            readonly: readonly,
            name: 'behavior_SelectRange_text',
            autoRender: false,
            searchable: {
              placeholder: '按姓名搜索',
            },
            allowClear: true,
            onlyleaf: true,
            multiple: true,
            nodeCheckable: {
              cascadeCheckParent: false,
              cascadeUncheckParent: false,
            },
            hidden: currentStep.behavior.handlerType == '3' || currentStep.behavior.handlerType == '7' ? true : false,
            value: selectRangeValue(),
            onCreated: ({ inst }) => {
              var stepHandlerType = currentStep.behavior.handlerType;
              refreshTreeHanderRange(stepHandlerType, inst);
            },
            onRendered: ({ inst, props, isUpdate }) => {
              if (props.abandonValues) {
                resetRangeValue(props.abandonValues);
              }
            },
            onValueChange({ newValue, items }) {
              updateSelectRange(items);
              if (currentStep.behavior.handlerType == '4') {
                updatePersonData(items);
              }
            },
          },
          {
            component: 'Table',
            name: 'divSelectTable',
            disabled: readonly,
            ref: (c) => {
              personTableRef = c
            },
            hidden: getSelTableHidden(),
            attrs: {
              style: {
                'margin-left': '90px',
              }
            },
            autoRender: true,
            columns: getSelTableCols(),
            onCreated: ({ inst, props }) => {
              // getListByFlowId(inst);
            },
            data: [],
          }
        ],
      }

      if (viewBag.Category != "101" && viewBag.Category != "103" && viewBag.Category != '104') {
        result.fields.push({
          component: 'RadioList',
          label: '短信提醒',
          name: 'behavior_HandlerAlert',
          value: currentStep.behavior.handlerAlert,
          disabled: readonly,
          options: [
            {
              text: '是',
              value: '1',
            },
            {
              text: '否',
              value: '0',
            }
          ],
          onValueChange({ newValue }) {
            currentStep.behavior.handlerAlert = newValue;
          }
        });
      }
      result.fields.push(
        {
          component: 'RadioList',
          label: '审批超时提示',
          name: 'ExpiredPrompt',
          disabled: readonly,
          value: currentStep.expiredPrompt ? currentStep.expiredPrompt : '0',
          options: [
            {
              text: '是',
              value: '1',
            },
            {
              text: '否',
              value: '0',
            }
          ],
          onValueChange({ newValue }) {
            currentStep.expiredPrompt = newValue;
            if (newValue == '1') {
              workTime_ref.show();
              expiredPromptDays_ref.show();
            } else {
              workTime_ref.hide();
              currentStep.workTime = '';
              expiredPromptDays_ref.hide();
              currentStep.expiredPromptDays = '';
            }
          }
        },
        {
          component: 'Textbox',
          label: '工时(天)',
          name: 'WorkTime',
          disabled: readonly,
          ref: (c) => {
            workTime_ref = c;
          },
          hidden: hiddentWorkTime(),
          value: currentStep.workTime,
          onValueChange: ({ newValue }) => {
            currentStep.workTime = newValue;
          },
        },
        {
          component: 'Textbox',
          label: '提前多少天提示',
          disabled: readonly,
          name: 'ExpiredPromptDays',
          ref: (c) => {
            expiredPromptDays_ref = c;
          },
          hidden: hiddentWorkTime(),
          value: currentStep.expiredPromptDays,
          onValueChange: ({ newValue }) => {
            currentStep.expiredPromptDays = newValue
          },
        },
        {
          component: 'Select',
          label: '退回类型',
          disabled: readonly,
          name: 'behavior_BackType',
          value: currentStep.behavior.backType,
          options: itemsBack,
          onValueChange({ newValue }) {
            if (newValue == '2') {
              sel_backStepRef.update({ hidden: false });
              currentStep.behavior.backStep = '';
            } else {
              sel_backStepRef.update({ hidden: true });
            }
            currentStep.behavior.backType = newValue;
          },
        },
        {
          component: 'Select',
          label: '退回步骤',
          disabled: readonly,
          hidden: currentStep.behavior.backType == '2' ? false : true,
          ref: (c) => {
            sel_backStepRef = c
          },
          name: 'behavior_BackStep',
          value: currentStep.behavior.backStep,
          options: getBackSteps(),
          onValueChange({ newValue }) {
            currentStep.behavior.backStep = newValue;
          }
        });
      if (viewBag.Category != "101") {
        result.fields.push({
          component: 'Select',
          label: '跳过条件',
          name: 'skipType',
          disabled: readonly,
          value: currentStep.skipType,
          options: [
            {
              text: '不允许跳过',
              value: '0',
            },
            {
              text: '该步骤有审批通过的任务',
              value: '1',
            }
          ],
          onValueChange({ newValue }) {
            currentStep.skipType = newValue;
          }
        });
      }
      result.fields.push(
        {
          component: 'RadioList',
          label: '联级审批',
          disabled: readonly,
          name: 'behavior_IsCascade',
          value: currentStep.behavior.isCascade,
          options: [
            {
              text: '是',
              value: 1,
            },
            {
              text: '否',
              value: 0,
            }
          ],
          onValueChange({ newValue }) {
            currentStep.behavior.isCascade = newValue;
          },
          action: {
            component: 'Button',
            text: '?',
            attrs: {
              style: {
                height: '30px',
                marginTop: '5px',
                marginRight: '600px'
              },
            },
            tooltip: {
              align: 'right',
              children:
                `#前提条件：前一步的操作人和当前步骤的操作人是同一个人，不是同一个人则不会有任何效果；
                <br/>作用：两步审批是否允许一次性操作完成，当选择“是”表示操作前一步时，该步骤也会自动完成，当选择“否”则表示前一步操作完成了，第二步依然需要处理；
                <br/>例如：第一步、第二步都是张三审批，当选择“是”时，张三只要审批一次就可以完成审批任务；当选择“否”时，张三需要审批两次才能完成审批任务。`,
            },
          },
        },
        {
          component: 'RadioList',
          label: '生成当前用户的审批任务',
          name: 'behavior_IsCUserTask',
          disabled: readonly,
          value: currentStep.behavior.isCUserTask,
          options: [
            {
              text: '是',
              value: 1,
            },
            {
              text: '否',
              value: 0,
            }
          ],
          onValueChange({ newValue }) {
            currentStep.behavior.isCUserTask = newValue;
          },
          action: {
            component: 'Button',
            text: '?',
            attrs: {
              style: {
                height: '30px',
                marginTop: '5px',
                marginRight: '600px'
              },
            },
            tooltip: {
              align: 'right',
              children:
                `#前提条件：当前一个步骤的审批人和当前步骤的审批人都有同一个人，如果没有则不会有任何效果；
                <br/>作用：当前一个步骤的审批人审批完成以后，在当前步骤的审批中是否会自动过滤掉当前审批人；
                <br />例如：当前一个步骤是张三审批，审批完后进入下一步，当选择“是”时，下一步的审批人中会有张三审批，当选择“否”时，如果配置了张三审批，则不会生成张三审批的任务。`,
            },
          },
        },
        {
          component: 'Select',
          label: '会签策略',
          name: 'behavior_Countersignature',
          disabled: readonly,
          value: currentStep.behavior.countersignature,
          options: [
            {
              text: '不会签',
              value: '0',
            },
            {
              text: '所有人同意',
              value: '1',
            },
            {
              text: '一个人同意即可',
              value: '2',
            }
          ],
          onValueChange({ newValue }) {
            currentStep.behavior.countersignature = newValue;
          },
          action: {
            component: 'Button',
            text: '?',
            attrs: {
              style: {
                height: '30px',
                marginTop: '5px',
                marginRight: '10px'
              },
            },
            tooltip: {
              align: 'left',
              children:
                `#不会签：只要有一个人审批了，这个步骤就算处理完了，不需要所有人审批，系统默认这种情况；
                <br/>所有人同意：该步骤的所有审批人都要处理完毕后，如果都同意流程会往下走或结束，否则流程会退回；
                <br />一个人同意即可：该步骤的所有审批人都要处理完毕后，该步骤只要有一个人同意，流程就往下走或结束，否则流程会退回；
                <br />第二个选项跟第三个选项都是要等该步骤的审批人都处理完毕后，这个步骤才算结束。`,
            },
          },
        },
        {
          component: 'Select',
          label: '关联表单',
          disabled: readonly,
          name: 'form_forms',
          ref: (c) => {
            formFormsRef = c
          },
          value: getFormValue(),
          options: getFormList(),
          onValueChange({ newValue }) {
            if (!newValue) {
              currentStep.forms = [];
              formSettingHiddenChange();
              return;
            }

            if (!currentStep.forms) {
              currentStep.forms = [];
            }
            var newOption = formFormsRef.props.options.find(s => s.value == newValue);
            currentStep.forms[0] = {
              id: newValue,
              name: newOption.text
            };
            formSettingHiddenChange()
          },
          action: {
            component: 'Button',
            text: '表单设置',
            ref: (c) => {
              formSettingRef = c;
            },
            onClick: () => {
              axios({
                method: 'post',
                url: `/Common/WorkFlow/GetFormStatus`,
                params: {
                  oid: viewBag.oid,
                  formDefId: currentStep.forms[0].id
                },
              }).then(ar => {
                new nomui.Modal({
                  size: 'middle',
                  content: '/webapp/nomui-components/pro-workflow/form/default-formsetting.js',
                  args: { fromData: ar, fieldStatuses: currentStep.fieldStatuses, itemGroupStatuses: currentStep.itemGroupStatuses },
                  handleOk: ({ fieldStatuses, itemGroupStatuses }) => {
                    currentStep.fieldStatuses = fieldStatuses;
                    currentStep.itemGroupStatuses = itemGroupStatuses;
                  },
                })
              })
            },
            type: 'primary',
            size: 'small',
            hidden: formSettingHidden(),
            attrs: {
              style: {
                height: '30px',
                marginTop: '8px',
              },
            },
          },
        });

      return result;
    }

    const formSettingHidden = () => {
      if (currentStep.forms && currentStep.forms.length > 0 && currentStep.forms[0]) {
        return false;
      } else {
        return true;
      }
    }

    const formSettingHiddenChange = () => {
      var isHidden = formSettingHidden();
      if (isHidden) {
        formSettingRef.hide();
      } else {
        formSettingRef.show();
      }
    }

    const renderButtonTab = () => {
      return [
        {
          component: 'Table',
          ref: (c) => {
            tab_buttonRef = c
          },
          columns: [
            {
              field: 'Id',
              title: '',
              width: 60,
              cellRender: (obj) => {
                const { rowData, cellData: Id } = obj;
                var isCheck = false;
                if (currentStep.buttons && currentStep.buttons.find(s => s.id == Id)) {
                  isCheck = true;
                }

                return {
                  component: 'Checkbox',
                  plain: true,
                  value: isCheck,
                  disabled: readonly,
                  onValueChange({ newValue }) {
                    if (!currentStep.buttons) {
                      currentStep.buttons = [];
                    }

                    if (newValue) {
                      if (currentStep.buttons.length == 0
                        || currentStep.buttons.find(s => s.id != rowData.Id)) {
                        currentStep.buttons.push({
                          id: rowData.Id,
                          name: rowData.Title,
                          sort: rowData.Sort
                        });
                      }
                    } else {
                      removeByValue(currentStep.buttons, 'id', rowData.Id);
                    }
                    tab_buttonRef.update({ data: buttonArr });
                  }
                }
              },
            },
            {
              field: 'Title',
              title: '按钮名称',
              width: 150,
              cellRender: (obj) => {
                const { rowData } = obj;
                var isCheck = false;
                if (currentStep.buttons && currentStep.buttons.find(s => s.id == rowData.Id)) {
                  isCheck = true;
                }
                var result = {
                  component: 'Flex',
                  gap: 'medium',
                  cols: [
                    {
                      children: rowData.Title,
                    },
                  ],
                }

                if (isCheck) {
                  result.cols.push({
                    component: 'Icon',
                    type: 'form',
                    disabled: readonly,
                    attrs: {
                      style: {
                        'font-size': '1rem',
                      },
                    },
                    onClick: () => {
                      new nomui.Modal({
                        size: 'small ',
                        content: '/webapp/nomui-components/pro-workflow/form/default-rebuttonname.js',
                        args: { currentStepButtons: currentStep.buttons, currentButton: rowData },
                        handleOk: (item) => {
                          currentStep.buttons.map((n, i) => {
                            if (n.id == item.Id) {
                              n.name = item.Title
                            }
                          })

                          buttonArr.map((n, i) => {
                            if (n.Id == item.Id) {
                              n.Title = item.Title
                            }
                          })

                          tab_buttonRef.update({ data: buttonArr });
                        },
                      })
                    }
                  })
                }

                return result;
              },
            },
            {
              field: 'Note',
              title: '说明',
            },
          ],
          data: buttonArr,
        }
      ]
    }


    const renderEvensTab = () => {
      var fields = [];
      if (viewBag.Category == "99") {
        fields.push({
          component: 'Textbox',
          label: '步骤名称',
          name: 'event_SubmitAfter',
          disabled: readonly,
          value: currentStep.event.submitAfter,
          onValueChange: ({ newValue }) => {
            currentStep.event.submitAfter = newValue
          },
        });
      } else {
        fields.push({
          component: 'Select',
          label: '步骤提交后事件',
          disabled: readonly,
          name: 'event_SubmitAfter',
          value: currentStep.event.submitAfter,
          options: [
            {
              text: '递交伦理申请',
              value: 'CTS.WebSite.Areas.StudySite.Controllers.StudySiteProjectController.DeliveECApplyByFlow'
            },
            {
              text: '递交伦理申请，并微信通知受理者递交纸质资料到伦理',
              value: 'CTS.WebSite.Areas.StudySite.Controllers.StudySiteProjectController.DeliveECApplyAndSendMsgByFlow'
            },
          ],
          onValueChange: ({ newValue }) => {
            currentStep.event.submitAfter = newValue
          },
        });
      }
      fields.push({
        component: 'Textbox',
        label: '步骤退回后事件',
        name: 'event_BackAfter',
        disabled: readonly,
        value: currentStep.event.backAfter,
        onValueChange: ({ newValue }) => {
          currentStep.event.backAfter = newValue
        },
      });
      return {
        component: 'Form',
        fields: fields
      }
    }

    const verification = () => {
      if (!currentStep.name) {
        new nomui.Alert({
          type: 'warning',
          title: '步骤名称不能为空',
        })
        return false;
      }
      if (!currentStep.behavior.handlerType) {
        new nomui.Alert({
          type: 'warning',
          title: '处理类型不能为空',
        })
        return false;
      }
      if (currentStep.behavior.handlerType !== '3'
        && currentStep.behavior.handlerType !== '7' && !currentStep.behavior.selectRange) {
        new nomui.Alert({
          type: 'warning',
          title: '处理范围不能为空',
        })
        return false;
      }
      if (!currentStep.behavior.handlerAlert) {
        new nomui.Alert({
          type: 'warning',
          title: '短信提醒不能为空',
        })
        return false;
      }
      if (currentStep.expiredPrompt == '1') {
        if (!Number(currentStep.workTime)) {
          new nomui.Alert({
            type: 'warning',
            title: '工时不是数值类型',
          })
          return false;
        }
        if (!Number(currentStep.expiredPromptDays)) {
          new nomui.Alert({
            type: 'warning',
            title: '提前天数不是数据类型',
          })
          return false;
        }
      } else {
        currentStep.workTime = '';
        currentStep.expiredPromptDays = '';
      }

      if (!currentStep.behavior.backType) {
        new nomui.Alert({
          type: 'warning',
          title: '退回类型不能为空',
        })
        return false;
      }
      if (currentStep.behavior.backType == '2' && !currentStep.behavior.backStep) {
        new nomui.Alert({
          type: 'warning',
          title: '退回步骤不能为空',
        })
        return false;
      }
      if (currentStep.behavior.isCascade == undefined
        || currentStep.behavior.isCascade == null) {
        new nomui.Alert({
          type: 'warning',
          title: '联级审批不能为空',
        })
        return false;
      }
      if (!currentStep.skipType || (currentStep.skipType != '0' && currentStep.skipType != '1')) {
        new nomui.Alert({
          type: 'warning',
          title: '跳过条件不能为空',
        })
        return false;
      }
      if (currentStep.behavior.isCUserTask == undefined
        || currentStep.behavior.isCUserTask == null) {
        new nomui.Alert({
          type: 'warning',
          title: '生成当前用户的审批任务不能为空',
        })
        return false;
      }
      if (!currentStep.behavior.countersignature) {
        new nomui.Alert({
          type: 'warning',
          title: '会签策略不能为空',
        })
        return false;
      }
      if (!currentStep.buttons || currentStep.buttons.length == 0) {
        new nomui.Alert({
          type: 'warning',
          title: '按钮不能空',
        })
        return false;
      }

      return true;
    }

    const getFooterButtons = () => {
      var result = [];
      if (!readonly) {
        result.push({
          component: 'Button',
          type: 'primary',
          text: '确定',
          onClick: () => {
            if (!verification()) {
              return;
            }

            saveSelectData();
            modal.props.handleOk({ item: currentStep })
            modal.close()
          },
        });
      }
      result.push({
        component: 'Button',
        text: '取消',
        onClick: () => {
          modal.close()
        },
      })
      return result;
    }

    return {
      header: {
        caption: { title: '步骤详情' },
      },
      body: {
        children: {
          children: {
            component: 'Tabs',
            uistyle: 'line',
            //disabledItems: 'info',
            onTabSelectionChange: ({ key }) => {
              // console.log(`选中的key:${key}`)
            },
            tabs: getTabs()
          },
        },
      },
      footer: {
        children: {
          component: 'Cols',
          items: getFooterButtons(),
        },
      },
    }
  }
})
