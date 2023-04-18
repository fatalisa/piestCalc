define(['nomui-components/pro-group/index.js','css!page/style.css'], function (ProGroup,style) {
  
  let avatarRef = null
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
          component:ProGroup
        }
      },

  

    }
  })
  