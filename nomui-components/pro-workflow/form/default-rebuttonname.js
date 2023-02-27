define([], function () {
    return (modal) => {
        const { args } = modal.props
        const { currentButton,readonly } = args

        return {
            header: {
                caption: { title: '重命名' },
            },
            body: {
                children: {
                    component: 'Textbox',
                    label: '按钮名称',
                    name: 'rebutton_name',
                    required: true,
                    value: currentButton.Title,
                    onValueChange: ({ newValue }) => {
                        currentButton.Title = newValue
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
                                if (!currentButton.Title) {
                                    new nomui.Alert({
                                        type: 'warning',
                                        title: '警告',
                                        description: '按钮名称不能为空!',
                                    })
                                } else {
                                    modal.props.handleOk(currentButton)
                                    modal.close()
                                }
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