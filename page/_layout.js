define([ 'menu-data.js'], function (menuData) {
  const { items, highlightMap } = menuData()
  let mainMenuRef = null


    return {
        component: 'Layout',
        fit:true,
    
        sider:{
            children:{
              component:'Menu',
              ref:(c)=>{
                mainMenuRef = c
              },
              items:items,
              itemSelectable:true,
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