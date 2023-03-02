define([ 'menu-data.js'], function (menuData) {
  const { items, highlightMap } = menuData()
  let mainMenuRef = null


    return {
        component: 'Layout',
        fit:true,
    
        sider:{
            children:{
              component:'Menu',
              compact:true,
              ref:(c)=>{
                mainMenuRef = c
              },
              items:items
            }
        },

        body: {
          children: {
            component: 'Router',
            defaultPath: 'home',
          },
        },
      }
})