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
          onEventClick:(args)=>{
            return Object.assign(args.itemData,{name:'一个新名字'})
          }
        }
      },

  

    }
  })
  