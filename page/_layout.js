define([], function () {

  const refs = {}

  const spellsPriest=[
    {
        "name": "快速01",
        "cost": 125,
        "heal": 224,
        "add": 1*(1.5/3.5),
        "hpm": "1.79"
    },
    {
        "name": "快速02",
        "cost": 155,
        "heal": 297,
        "add": 1*(1.5/3.5),
        "hpm": "1.92"
    },
    {
        "name": "快速03",
        "cost": 185,
        "heal": 372,
        "add": 1*(1.5/3.5),
        "hpm": "2.01"
    },
    {
        "name": "快速04",
        "cost": 215,
        "heal": 453,
        "add": 1*(1.5/3.5),
        "hpm": "2.11"
    },
    {
        "name": "快速05",
        "cost": 265,
        "heal": 583,
        "add": 1*(1.5/3.5),
        "hpm": "2.20"
    },
    {
        "name": "快速06",
        "cost": 315,
        "heal": 722,
        "add": 1*(1.5/3.5),
        "hpm": "2.29"
    },
    {
        "name": "快速07",
        "cost": 380,
        "heal": 901,
        "add": 1*(1.5/3.5),
        "hpm": "2.37"
    },
    {
        "name": "治疗术01",
        "cost": 155,
        "heal": 330,
        "add": 0.85*(3/3.5),
        "hpm": "2.13"
    },
    {
        "name": "治疗术02",
        "cost": 205,
        "heal": 476,
        "add": 1*(3/3.5),
        "hpm": "2.32"
    },
    {
        "name": "治疗术03",
        "cost": 255,
        "heal": 624,
        "add": 1*(3/3.5),
        "hpm": "2.45"
    },
    {
        "name": "治疗术04",
        "cost": 305,
        "heal": 780,
        "add":1*(3/3.5),
        "hpm": "2.56"
    },
    {
        "name": "强效01",
        "cost": 370,
        "heal": 981,
        "add": 1*(3/3.5),
        "hpm": "2.65"
    },
    {
        "name": "强效02",
        "cost": 455,
        "heal": 1248,
        "add": 1*(3/3.5),
        "hpm": "2.74"
    },
    {
        "name": "强效03",
        "cost": 545,
        "heal": 1556,
        "add": 1*(3/3.5),
        "hpm": "2.86"
    },
    {
        "name": "强效04",
        "cost": 655,
        "heal": 1917,
        "add":1*(3/3.5),
        "hpm": "2.93"
    },
    {
        "name": "强效05",
        "cost": 710,
        "heal": 2080,
        "add": 1*(3/3.5),
        "hpm": "2.93"
    },
    {
        "name": "恢复01",
        "cost": 30,
        "heal": 45,
        "add": 0.55,
        "hpm": "1.50"
    },
    {
        "name": "恢复02",
        "cost": 65,
        "heal": 100,
        "add": 0.78,
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

const spellsShaman=[
  {
      "name": "治疗链01",
      "cost": 260,
      "heal": 356,
      "add": 1*(2.5/3.5),
  },
  {
    "name": "治疗链02",
    "cost": 315,
    "heal": 449,
    "add": 1*(2.5/3.5),
},
{
  "name": "治疗链03",
  "cost": 405,
  "heal": 606,
  "add": 1*(2.5/3.5),
},

{
  "name": "次级治疗波01",
  "cost": 105,
  "heal": 182,
  "add": 1*(1.5/3.5),
},
{
  "name": "次级治疗波02",
  "cost": 145,
  "heal": 274,
  "add": 1*(1.5/3.5),
},
{
  "name": "次级治疗波03",
  "cost": 185,
  "heal": 371,
  "add": 1*(1.5/3.5),
},
{
  "name": "次级治疗波04",
  "cost": 235,
  "heal": 500,
  "add": 1*(1.5/3.5),
},
{
  "name": "次级治疗波05",
  "cost": 305,
  "heal": 686,
  "add": 1*(1.5/3.5),
},
{
  "name": "次级治疗波06",
  "cost": 380,
  "heal": 880,
  "add": 1*(1.5/3.5),
},
{
  "name": "治疗波01",
  "cost": 25,
  "heal": 41,
  "add": 0.28*(1.5/3.5),
},
{
  "name": "治疗波02",
  "cost": 45,
  "heal": 76,
  "add": 0.47*(2/3.5),
},
{
  "name": "治疗波03",
  "cost": 80,
  "heal": 149,
  "add": 0.28*(2.5/3.5),
},
{
  "name": "治疗波04",
  "cost": 155,
  "heal": 303,
  "add": 0.92*(3/3.5),
},
{
  "name": "治疗波05",
  "cost": 200,
  "heal": 421,
  "add": 0.1*(3/3.5),
},
{
  "name": "治疗波06",
  "cost": 265,
  "heal": 595,
  "add": 0.1*(3/3.5),
},
{
  "name": "治疗波07",
  "cost": 340,
  "heal": 816,
  "add": 0.1*(3/3.5),
},
{
  "name": "治疗波08",
  "cost": 440,
  "heal": 1115,
  "add": 0.1*(3/3.5),
},
{
  "name": "治疗波09",
  "cost": 560,
  "heal": 1486,
  "add": 0.1*(3/3.5),
},
{
  "name": "治疗波10",
  "cost": 620,
  "heal": 1735,
  "add": 0.1*(3/3.5),
},
  
]

let spells = spellsPriest



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
                    component:'Select',
                    allowClear:false,
                    controlWidth: 'small',
                    ref:(c)=>{
                      refs.classRef = c
                    },
                    value:'1',
                    options:[
                      {
                        text:'牧师',
                        value:'1'
                      },
                      {
                        text:'萨满',
                        value:'2'
                      }
                    ],
                    onValueChange:({newValue})=>{
                      if (newValue==='1') {
                        spells = spellsPriest
                      }
                      if (newValue==='2') {
                        spells = spellsShaman
                      }
                    }
                  },
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
                      sortable:'string',
                      cellRender:({cellData})=>{
                        let c = 'var(--nom-color-warning)'
                        if (cellData.includes('恢复')) {
                          c = 'var(--nom-color-success)'
                        }
                        if (cellData.includes('快速') || cellData.includes('治疗链')) {
                          c = 'var(--nom-color-danger)'
                        }
                        if (cellData.includes('强效') || cellData.includes('次级治疗波')) {
                          c = 'var(--nom-color-info)'
                        }
                        return {
                          attrs:{
                            style:{
                              color:c
                            }
                          },
                          children:cellData
                        }
                      }
                    },
                    {
                      field:'cost',
                      title:'消耗',
                      sortable:'number'
                    },
                    {
                      field:'heal',
                      title:'治疗量',
                      sortable:'number',
                      cellRender:({cellData})=>{
                        return cellData.toFixed(0)
                      }
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