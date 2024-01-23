define([], function () {

  const refs = {}

  const spells=[
    {
        "name": "快速01",
        "cost": 125,
        "heal": 224,
        "add": 0.45,
        "hpm": "1.79"
    },
    {
        "name": "快速02",
        "cost": 155,
        "heal": 297,
        "add": 0.45,
        "hpm": "1.92"
    },
    {
        "name": "快速03",
        "cost": 185,
        "heal": 372,
        "add": 0.45,
        "hpm": "2.01"
    },
    {
        "name": "快速04",
        "cost": 215,
        "heal": 453,
        "add": 0.45,
        "hpm": "2.11"
    },
    {
        "name": "快速05",
        "cost": 265,
        "heal": 583,
        "add": 0.45,
        "hpm": "2.20"
    },
    {
        "name": "快速06",
        "cost": 315,
        "heal": 722,
        "add": 0.45,
        "hpm": "2.29"
    },
    {
        "name": "快速07",
        "cost": 380,
        "heal": 901,
        "add": 0.45,
        "hpm": "2.37"
    },
    {
        "name": "治疗术01",
        "cost": 155,
        "heal": 330,
        "add": 0.85,
        "hpm": "2.13"
    },
    {
        "name": "治疗术02",
        "cost": 205,
        "heal": 476,
        "add": 0.85,
        "hpm": "2.32"
    },
    {
        "name": "治疗术03",
        "cost": 255,
        "heal": 624,
        "add": 0.85,
        "hpm": "2.45"
    },
    {
        "name": "治疗术04",
        "cost": 305,
        "heal": 780,
        "add": 0.85,
        "hpm": "2.56"
    },
    {
        "name": "强效01",
        "cost": 370,
        "heal": 981,
        "add": 0.85,
        "hpm": "2.65"
    },
    {
        "name": "强效02",
        "cost": 455,
        "heal": 1248,
        "add": 0.85,
        "hpm": "2.74"
    },
    {
        "name": "强效03",
        "cost": 545,
        "heal": 1556,
        "add": 0.85,
        "hpm": "2.86"
    },
    {
        "name": "强效04",
        "cost": 655,
        "heal": 1917,
        "add": 0.85,
        "hpm": "2.93"
    },
    {
        "name": "强效05",
        "cost": 710,
        "heal": 2080,
        "add": 0.85,
        "hpm": "2.93"
    },
    {
        "name": "恢复01",
        "cost": 30,
        "heal": 45,
        "add": 1,
        "hpm": "1.50"
    },
    {
        "name": "恢复02",
        "cost": 65,
        "heal": 100,
        "add": 1,
        "hpm": "1.54"
    },
    {
        "name": "恢复03",
        "cost": 105,
        "heal": 175,
        "add": 1,
        "hpm": "1.67"
    },
    {
        "name": "恢复04",
        "cost": 140,
        "heal": 245,
        "add": 1,
        "hpm": "1.75"
    },
    {
        "name": "恢复05",
        "cost": 170,
        "heal": 315,
        "add": 1,
        "hpm": "1.85"
    },
    {
        "name": "恢复06",
        "cost": 205,
        "heal": 400,
        "add": 1,
        "hpm": "1.95"
    },
    {
        "name": "恢复07",
        "cost": 250,
        "heal": 510,
        "add": 1,
        "hpm": "2.04"
    },
    {
        "name": "恢复08",
        "cost": 305,
        "heal": 650,
        "add": 1,
        "hpm": "2.13"
    },
    {
        "name": "恢复09",
        "cost": 365,
        "heal": 810,
        "add": 1,
        "hpm": "2.22"
    },
    {
        "name": "恢复10",
        "cost": 410,
        "heal": 970,
        "add": 1,
        "hpm": "2.37"
    }
]



const countHeal=(power)=> {
    if (!power) {
        power=0
    }
    
    const arr = spells.map(n=>{
        const realHeal = n.heal + power*n.add
        return {
            name:n.name,
            cost:n.cost,
            heal:realHeal,
            hpm:(realHeal/n.cost).toFixed(2)
        }
    })

    return arr

}


const handleCalc = ()=>{
  const val = parseInt(refs.text.getValue())
  const result = countHeal(val)
  refs.table.update({data:result})
}

    return {
        component: 'Layout',
        body: {
          children:{
      
            attrs:{
              style:{
                padding:'2rem',
                textAlign:'center',
              },
             
            },
            children:{
              component:'Flex',
              attrs:{
                style:{
                  width:'500px'
                }
              },
              rows:[
               {
                align:'center',
                cols:[
                  {
                    component:'Textbox',
                    ref:(c)=>{
                      refs.text = c
                    },
                    placeholder:'请输入你的治疗强度加成'
                  },
                  {
                    component:'Button',
                    text:'计算',
                    onClick:()=>{
                      handleCalc()
                    }
                  }
                ]

               },
                {
                  component:'Grid',
                  ref:(c)=>{
                    refs.table = c
                  },
                  data:spells,
                  columns:[
                    {
                      field:'name',
                      title:'技能名称',
                      sortable:'string'
                    },
                    {
                      field:'cost',
                      title:'消耗',
                      sortable:'number'
                    },
                    {
                      field:'heal',
                      title:'治疗量',
                      sortable:'number'
                    },
                    {
                      field:'hpm',
                      title:'hpm',
                      sortable:'number'
                    },
                  ]
                }
              ]
            }
          }
        },
       
      }
})