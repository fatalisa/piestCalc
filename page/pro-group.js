define(['nomui-components/pro-group/index.js','css!page/style.css'], function (ProGroup) {
  
 



  asyncDeleteUser =()=>{
    new Promise((resolve)=>{
      resolve({
       
        success:false
      })
    }).then(res=>{
      
      if(res.success) {
        new nomui.Alert({
          title: '删除成功',
        })
      }
      else {
        new nomui.Alert({
          title: '操作失败',
        })
      }
     
    })


  }


  
    return {
      component: 'Layout',


      body: {
        children: {
          component:ProGroup,
          eventToolRender:({item,itemData})=>{
            
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

          }
        }
      },

  

    }
  })
  