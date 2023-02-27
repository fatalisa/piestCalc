define([], function () {
    return (modal) => {
        const { args } = modal.props
        const { fromData, fieldStatuses, itemGroupStatuses } = args
        var from_fileRef, form_groupRef;
        var fileSourceData, groupSourceData;




        const initData = () => {
            fileSourceData = [];
            fromData.formControlDefs.map((item, index) => {
                var itemOID = item.ItemOID;
                var defaultStatus = '0';
                var defaulCheck = '1';
                if (fieldStatuses && fieldStatuses.length > 0) {
                    var info = fieldStatuses.find(s => s.field == itemOID);
                    if (info) {
                        defaultStatus = info.status;
                        defaulCheck = info.check;
                    }
                }

                fileSourceData.push({
                    formName: fromData.FormName,
                    fieldName: item.ItemName,
                    field: item.ItemOID,
                    status: defaultStatus,
                    check: defaulCheck
                });
            })

            groupSourceData = [];
            if (fromData.ItemGroup && fromData.ItemGroup.length > 0) {
                var itemGroups = fromData.ItemGroup.split(',');
                itemGroups.map((n, i) => {
                    var defaultStatus = '0';
                    if (itemGroupStatuses && itemGroupStatuses.length > 0) {
                        var info = itemGroupStatuses.find(s => s.itemGroup == n);
                        if (info) {
                            defaultStatus = info.status;
                        }
                    }
                    groupSourceData.push({
                        formName: fromData.FormName,
                        itemGroup: n,
                        status: defaultStatus
                    });
                });
            }
        }

        initData();

        return {
            header: {
                caption: { title: '表单设置' },
            },
            body: {
                children: [
                    {
                        tag: 'p',
                        children: '表单字段：',
                    },
                    {
                        component: 'Table',
                        ref: (c) => {
                            from_fileRef = c
                        },
                        autoRender: true,
                        data: fileSourceData,
                        columns: [
                            {
                                field: 'formName',
                                title: '表单',
                            },
                            {
                                field: 'field',
                                title: '字段',
                                cellRender: ({ rowData }) => {
                                    var content = `${rowData.fieldName ?? ''}（${rowData.field}）`
                                    return {
                                        tag: 'div',
                                        styles: {
                                            text: 'left',
                                        },
                                        children: content,
                                    }
                                },
                            },
                            {
                                field: 'status',
                                title: '状态',
                                width: 100,
                                cellRender: ({ rowData, cellData: status }) => {
                                    var field = rowData.field;
                                    return {
                                        component: 'Select',
                                        plain: true,
                                        value: status,
                                        options: [
                                            {
                                                text: '编辑',
                                                value: '0',
                                            },
                                            {
                                                text: '只读',
                                                value: '1',
                                            },
                                            {
                                                text: '隐藏',
                                                value: '2',
                                            }
                                        ],
                                        onValueChange({ newValue }) {
                                            fileSourceData.some(n => {
                                                if (n.field == field) {
                                                    n.status = newValue;
                                                    return true;
                                                }
                                            })
                                        }
                                    }
                                },
                            },
                            {
                                field: 'check',
                                title: '数据检查',
                                width: 130,
                                cellRender: ({ rowData, cellData: check }) => {
                                    var field = rowData.field;
                                    return {
                                        component: 'Select',
                                        plain: true,
                                        value: check,
                                        options: [
                                            {
                                                text: '允许为空',
                                                value: '1',
                                            },
                                            {
                                                text: '不允许为空',
                                                value: '2',
                                            }
                                        ],
                                        onValueChange({ newValue }) {
                                            fileSourceData.some(n => {
                                                if (n.field == field) {
                                                    n.check = newValue;
                                                    return true;
                                                }
                                            })
                                        }
                                    }
                                },
                            },
                        ],

                    },
                    {
                        tag: 'p',
                        children: '表单控件组：',
                    },
                    {
                        component: 'Table',
                        autoRender: true,
                        data: groupSourceData,
                        ref: (c) => {
                            form_groupRef = c
                        },
                        columns: [
                            {
                                field: 'formName',
                                title: '表单',
                            },
                            {
                                field: 'itemGroup',
                                title: '组',
                            },
                            {
                                field: 'status',
                                title: '状态',
                                width: 100,
                                cellRender: ({ rowData, cellData: status }) => {
                                    var itemGroup = rowData.itemGroup;
                                    return {
                                        component: 'Select',
                                        plain: true,
                                        value: status,
                                        options: [
                                            {
                                                text: '编辑',
                                                value: '0',
                                            },
                                            {
                                                text: '只读',
                                                value: '1',
                                            },
                                            {
                                                text: '隐藏',
                                                value: '2',
                                            }
                                        ],
                                        onValueChange({ newValue }) {
                                            groupSourceData.some(n => {
                                                if (n.itemGroup == itemGroup) {
                                                    n.status = newValue;
                                                    return true;
                                                }
                                            })
                                        }
                                    }
                                },
                            },
                        ]
                    }
                ]
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
                                var newfieldStatuses = [];
                                var newitemGroupStatuses = [];
                                fileSourceData.map((n, i) => {
                                    newfieldStatuses.push({
                                        field: n.field,
                                        status: n.status,
                                        check: n.check
                                    })
                                });
                                groupSourceData.map((n, i) => {
                                    newitemGroupStatuses.push({
                                        itemGroup: n.itemGroup,
                                        status: n.status
                                    })
                                });
                                modal.props.handleOk({ fieldStatuses: newfieldStatuses, itemGroupStatuses: newitemGroupStatuses })
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