define([ 'menu-data.js'], function (menuData) {
  const { items, highlightMap } = menuData()
  
    
    return {
        component: 'Layout',
        fit:true,
    
        sider:{
            children:{
              component:'Menu',
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