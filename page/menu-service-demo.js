define(['menu-service'], function (MenuS) {

  
    return {
      children:{
        component:'List',
        items:[
            {
                component:'Button',
                text:'getData',
                onClick:()=>{
                    new nomui.Alert({
                        description:JSON.stringify(MenuS.getData('main'))
                    })
               
                }
            },
            {
                component:'Button',
                text:'添加项',
                onClick:()=>{
                    MenuS.add('main',[
                        {
                            name:'menu3',
                            parentName:null,
                            path:'!menu3',
                            order:3,
                            invisible:true
                        },{
                        name:'menu1',
                        parentName:null,
                        path:'!menu1',
                        order:1,
                    },
                    {
                        name:'menu2',
                        parentName:null,
                        path:'!menu2',
                        order:2,
                    },
                    ])
                }
            },
            {
                component:'Button',
                text:'添加子项',
                onClick:()=>{
                    MenuS.add('main',[{
                        name:'menu1Child4',
                        parentName:'menu1',
                        path:'!menu1Child',
                        order:4,
                    },
                    {
                        name:'menu1Child1',
                        parentName:'menu1',
                        path:'!menu1Child',
                        order:1,
                    },
                    {
                        name:'menu1ChildN',
                        parentName:'menu1',
                        path:'!menu1Child',
                
                    },
                    {
                        name:'menu1Child3',
                        parentName:'menu1',
                        path:'!menu1Child',
                        order:3,
                    },
                  ])
                }
            },
            {
                component:'Button',
                text:'覆盖菜单',
                onClick:()=>{
                    MenuS.replace('main',{
                        name:'menu3',
                        path:'!menu3New',
                        order:4,
                        permission:'VNext'
                    }
                  )
                }
            },
            

        ]
      }
     
     
    }
  })
  