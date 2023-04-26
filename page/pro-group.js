define(['nomui-components/pro-group/index.js','css!page/style.css'], function (ProGroup) {
  
 

  let groupRef = null




  
    return {
      component: 'Layout',


      body: {
        children: {
          component:'Layout',
             
          header:{
          
            children:{
              component:'Button',
              text:'getData',
              onClick:()=>{
                new nomui.Alert({
                  title:'当前数据为',
                  description:JSON.stringify(groupRef.getData())
                })
              }
            }
       
        },

          body:{
            children: {
              component:ProGroup,
              ref:(c)=>{
                groupRef = c
              },
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
  