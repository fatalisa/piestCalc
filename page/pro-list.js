define(['pro-list'], function (ProList) {


    const dataSource = [
      {
        name: '语雀的天空',
        image: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        author: '张三',
        desc: '我是一条测试的描述',
        url: 'http://xysis.wetrial.vip:8008/',
      },
      {
        name: 'NomUI',
        author: '李四',
        desc: '我是一条测试的描述',
        url: 'http://xysis.wetrial.vip:8008/',
      },
      {
        name: '湖南微试云',
        image: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        author: '王五',
        desc: '我是一条测试的描述',
        url: 'http://xysis.wetrial.vip:8008/',
      },
      {
        name: '上山打老虎',
        image: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        author: '赵六',
        desc: '我是一条测试的描述',
        url: 'http://xysis.wetrial.vip:8008/',
      },
    ]

  
    return {
      children:{
        component:'Flex',
        gutter:'medium',
        rows: [
            {
              component: 'Panel',
              header: {
                caption: {
                  title: '普通应用',
                },
              },
              body: {
                children: {
                  component: ProList,
                  data: dataSource,
                  hover: false,
                  title: 'name',
                  description: 'desc',
                  siderRender: (item) => {
                    return {
                      component: 'Avatar',
                      text: item.author,
                      src: item.image,
                    }
                  },
                  subTitleRender: (item) => {
                    return {
                      component: 'Cols',
                      gutter: 'sm',
                      items: [
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: 'NomUI',
                          color: 'olive',
                        },
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: '前端技术',
                        },
                      ],
                    }
                  },
                  actionsRender: (item) => {
                    return {
                      component: 'Toolbar',
                      type: 'link',
                      items: [
                        {
                          text: '按钮1',
                        },
                        {
                          text: '按钮2',
                        },
                        {
                          text: '按钮3',
                        },
                        {
                          text: '按钮4',
                        },
                      ],
                    }
                  },
                },
              },
            },

            {
              component: 'Panel',
              header: {
                caption: {
                  title: '行点击事件',
                },
              },
              body: {
                children: [
                  {
                    component: ProList,
                    data: dataSource,
                    title: 'name',
                    description: 'desc',
                    siderRender: (item) => {
                      return {
                        component: 'Avatar',
                        text: item.author,
                        src: item.image,
                      }
                    },
                    subTitleRender: (item) => {
                      return {
                        component: 'Cols',
                        gutter: 'sm',
                        items: [
                          {
                            component: 'Tag',
                            size: 'xs',
                            text: 'NomUI',
                            color: 'olive',
                          },
                          {
                            component: 'Tag',
                            size: 'xs',
                            text: '前端技术',
                          },
                        ],
                      }
                    },

                    onItemClick: (args) => {
                      console.log(args)
                    },
                  },
                  {
                    attrs: {
                      style: {
                        padding: '15px',
                        color: '#fa0',
                      },
                    },
                    children: `只有当没配置actionsRender、并配置了onItemClick的时候，此配置项才会正常起作用。 注意：即使你配置了actionsRender，组件本身的onClick事件仍然会运行，但是此时输出的是整个ProList的点击事件，没有用处。`,
                  },
                ],
              },
            },

            {
              component: 'Panel',
              header: {
                caption: {
                  title: '工具栏悬停显示',
                },
              },
              body: {
                children: {
                  component: ProList,
                  data: dataSource,
                  title: 'name',
                  description: 'desc',
                  showActions: 'hover',
                  siderRender: (item) => {
                    return {
                      component: 'Avatar',
                      text: item.author,
                      src: item.image,
                    }
                  },
                  subTitleRender: (item) => {
                    return {
                      component: 'Cols',
                      gutter: 'sm',
                      items: [
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: 'NomUI',
                          color: 'olive',
                        },
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: '前端技术',
                        },
                      ],
                    }
                  },
                  actionsRender: (item) => {
                    return {
                      component: 'Toolbar',
                      type: 'link',
                      items: [
                        {
                          text: '按钮1',
                        },
                        {
                          text: '按钮2',
                        },
                        {
                          text: '按钮3',
                        },
                        {
                          text: '按钮4',
                        },
                      ],
                    }
                  },
                },
              },
            },
            {
              component: 'Panel',
              header: {
                caption: {
                  title: '间距',
                },
              },
              body: {
                children: {
                  component: ProList,
                  data: dataSource,
                  title: 'name',
                  description: 'desc',
                  gutter: 'sm',

                  siderRender: (item) => {
                    return {
                      component: 'Avatar',
                      text: item.author,
                      src: item.image,
                    }
                  },
                  subTitleRender: (item) => {
                    return {
                      component: 'Cols',
                      gutter: 'sm',
                      items: [
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: 'NomUI',
                          color: 'olive',
                        },
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: '前端技术',
                        },
                      ],
                    }
                  },
                  actionsRender: (item) => {
                    return {
                      component: 'Toolbar',
                      type: 'link',
                      items: [
                        {
                          text: '按钮1',
                        },
                        {
                          text: '按钮2',
                        },
                        {
                          text: '按钮3',
                        },
                        {
                          text: '按钮4',
                        },
                      ],
                    }
                  },
                },
              },
            },
            {
              component: 'Panel',
              header: {
                caption: {
                  title: '分割线',
                },
              },
              body: {
                children: {
                  component: ProList,
                  data: dataSource,
                  title: 'name',
                  description: 'desc',
                  line: 'cross',

                  siderRender: (item) => {
                    return {
                      component: 'Avatar',
                      text: item.author,
                      src: item.image,
                    }
                  },
                  subTitleRender: (item) => {
                    return {
                      component: 'Cols',
                      gutter: 'sm',
                      items: [
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: 'NomUI',
                          color: 'olive',
                        },
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: '前端技术',
                        },
                      ],
                    }
                  },
                  actionsRender: (item) => {
                    return {
                      component: 'Toolbar',
                      type: 'link',
                      items: [
                        {
                          text: '按钮1',
                        },
                        {
                          text: '按钮2',
                        },
                        {
                          text: '按钮3',
                        },
                        {
                          text: '按钮4',
                        },
                      ],
                    }
                  },
                },
              },
            },
            {
              component: 'Panel',
              header: {
                caption: {
                  title: '自定义title与description',
                },
              },
              body: {
                children: {
                  component: ProList,
                  data: dataSource,
                  title: (item) => {
                    return {
                      tag: 'a',
                      children: `[技术文档]${item.name}`,
                      attrs: {
                        target: '_blank',
                        href: item.url,
                      },
                    }
                  },
                  description: (item) => {
                    return `${item.desc} (${new Date().format('yyyy-MM-dd')})`
                  },
                  line: 'cross',
                  showActions: 'always',
                  actionsRender: (item) => {
                    return {
                      component: 'Toolbar',
                      type: 'link',
                      items: [
                        {
                          text: '按钮1',
                        },
                        {
                          text: '按钮2',
                        },
                        {
                          text: '按钮3',
                        },
                        {
                          text: '按钮4',
                        },
                      ],
                    }
                  },
                },
              },
            },
            {
              component: 'Panel',
              header: {
                caption: {
                  title: '多列布局',
                },
              },
              body: {
                children: {
                  component: ProList,
                  data: dataSource,
                  cols: 3,
                  title: 'name',
                  description: 'desc',
                  siderRender: (item) => {
                    return {
                      component: 'Avatar',
                      text: item.author,
                      src: item.image,
                    }
                  },
                  subTitleRender: (item) => {
                    return {
                      component: 'Cols',
                      gutter: 'sm',
                      items: [
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: 'NomUI',
                          color: 'olive',
                        },
                        {
                          component: 'Tag',
                          size: 'xs',
                          text: '前端技术',
                        },
                      ],
                    }
                  },
                },
              },
            },
          ]
      }
     
     
    }
  })
  

