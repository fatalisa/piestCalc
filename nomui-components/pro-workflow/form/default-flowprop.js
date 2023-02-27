define([], function () {
    return (modal) => {
        const { args } = modal.props
        const { workFlowInfo, inst } = args
        var flowProp_database = inst.props.data.database;
        var readonly = inst.props.readonly;
        if (!flowProp_database) {
            flowProp_database = {
                table: '',
                primaryKey: ''
            };
        }
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
                                component: 'Cascader',
                                placeholder: '主表/主键',
                                name: 'cascaderMasterTable',
                                disabled:readonly,
                                fieldsMapping: {
                                    key: 'Id',
                                    label: 'Name',
                                    value: 'Name',
                                    children: 'Childs',
                                },
                                value: [flowProp_database.table, flowProp_database.primaryKey],
                                onCreated: ({ inst }) => {
                                    axios.get(`/Common/WorkFlow/MasterTables?oid=${viewBag.oid}`)
                                        .then((ar) => {
                                            if (ar.Success) {
                                                inst.update({ options: ar.Data.Tables });
                                            }
                                        })
                                },
                                onValueChange: ({ newValue }) => {
                                    if (newValue.length == 2) {
                                        flowProp_database.table = newValue[0];
                                        flowProp_database.primaryKey = newValue[1];
                                    }
                                },
                            },
                        ],
                    },
                    {
                        children: `#<p>不设置主表，则无法设置SQL条件</p>`,
                    },
                ],
            }
        }

        return {
            header: {
                caption: { title: '流程属性设置' },
            },
            body: {
                children: {
                    children: {
                        component: 'Tabs',
                        uistyle: 'line',
                        tabs: [
                            {
                                key: 'baseinfo',
                                item: { text: '基本信息' },
                                panel: {
                                    children: renderTab1(),
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
                            disabled:readonly,
                            onClick: () => {
                                modal.props.handleOk({ item: flowProp_database })
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