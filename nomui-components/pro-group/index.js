define(["css!/nomui-components/pro-group/index.css"], function () {
  class ProGroup extends nomui.Component {
    constructor(props, ...mixins) {
      const defaults = {
        data: [{ id: "001", name: "需求提案", events: [
            {
                id:'00101',
                name:'app原型设计',
                status:'warning',
                checked:false,
                disabled:false,
                date:'2023-01-05',
                tasks:3,
                eventRender:null,
            },
            {
              id:'00102',
              name:'web原型设计',
              status:'warning',
              checked:false,
              disabled:false,
              date:'2023-01-08',
              tasks:1,
              eventRender:null,
          }
        ] },
        { id: "002", name: "前期设计", events: [
          {
              id:'00102',
              name:'UI设计',
              status:'success',
              checked:false,
              disabled:false,
              date:'2023-01-10',
              tasks:3,
              eventRender:null,
          }
      ] }],
        onEventCreate: null,
        onEventDelete: null,
        onEventClick: null,
        onEventDrag: null,
        titleRender:null,
        eventRender:null
      };
      super(nomui.Component.extendProps(defaults, props), ...mixins);
    }

    _config() {
        const groups = this._getGroupData()
      this.setProps({
        children:{
            component:'List',
            sortable: true,
            items:groups
        }
      })
    }

    _getGroupData() {
        const {data,itemRender} = this.props

        const defaultRender = itemRender || function ({itemData})  {
          
          return {
            children: {
              component:'Flex',
              align:'start',

              cols:[
                {
                  classes:{
                    'pro-group-checkbox':true
                  },
                  children:{
                    component:'Icon',
                    type:'check'
                  }
               
                },
                {
                  rows:[
                    {
                      children:itemData.name
                    }
                  ]
                }

              ]
            }
          }
          
         
        }

        const list = data.map(n=>{
          return {
            component:'Flex',
            rows:[
              {
                children:n.name
              },
              {
                component:'List',
                cols:1,
                itemRender:defaultRender,
             
                data:n.events
              }
            ]
          }
        })
        return list

    }

    _getGroupItems(arr) {
      if (!arr.length) return []
      const data = arr.map()
    }
  }

  return ProGroup;
});
