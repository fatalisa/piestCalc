define(['nomui-components/kanban/index.js','css!page/style.css'], function (Kanban) {
  
 

  let groupRef = null

  const data  = [
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
  ]

  const data2 = [
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
    {
      id: '003',
      name: '开发',
      events: [
        {
          id: '00302',
          name: '后端开发',
          status: 'success',
          checked: false,
          disabled: false,
          date: '2023-01-10',
          tasks: 3,
          eventRender: null,
        },
      ],
    },
  ]



  
    return {
      component: 'Layout',


      body: {
        children: {
          component:'Layout',
             
          header:{
          
            children:{
              component:'Flex',
              cols:[
                {
                  component:'Button',
                  text:'getData',
                  onClick:()=>{
                    new nomui.Alert({
                      title:'当前数据为',
                      description:JSON.stringify(groupRef.getData())
                    })
                  }
                },
                {
                  component:'Button',
                  text:'setData',
                  onClick:()=>{
                    groupRef.update({data:data2})
                  }
                }
              ]
            }
       
        },

          body:{
            children: {
              component:Kanban,
              ref:(c)=>{
                groupRef = c
              },
              data:data,
              eventToolRender:({item,itemData})=>{
                return [
                  {
                    text:itemData.disabled?'启用':'禁用',
                    onClick:()=>{
                      if (itemData.disabled) {
                        item.enable()
                        item.update({data:{
                          disabled:false
                        }})
                      }
                      else {
                        item.disable()
                        item.update({data:{
                          disabled:true
                        }})
                      }
                    }
                  }
                ]
    
              },
              onEventClick:({item,itemData,setData,removeEvent})=>{
                // 可以直接对sender,item进行操作，也可以使用setData函数对组件进行更新,使用removeEvent()删除任务
                let textRef = null
                new nomui.Modal({
                  content: {
                    header: {
                      caption: {
                        title: '修改信息',
                      },
                    },
                    body: {
                      children:{
                        component:'Textbox',
                        placeholder:'请输入任务名称',
                        value:itemData.name,
                        ref:(c)=>{
                          textRef = c
                        }
                      }
                    },
                  },
                  onOk: ({ sender }) => {
                   
                    const newData = Object.assign(itemData,{name:textRef.getValue()})
                    setData(newData) // 更新数据
                    sender.close()
                  },
                })
    
              },
              onEventDrop:({sender})=>{
                console.log(sender.getData())
              },
              onEventCreate:(args)=>{
                console.log(args)
              },
              onEventDelete:(args)=>{
                console.log(args)
              },
              onChange:(args)=>{
                console.log(args)
              }
    
            }
          },
      
        }
      },

  

    }
  })
  