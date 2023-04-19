define(['dragula',"css!/libs/dragula/dragula.min.css","css!/nomui-components/pro-group/index.css"], function (Dragula) {

window.Dragula = Dragula
  
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
            onCreated:({inst})=>{
              this.mainList = inst
            },
            // sortable: true,
            items:groups
        }
      })
    }

    _rendered() {
      this._initDragable()
    }

    _initDragable() {
      const containers = []
      const list = this.element.querySelectorAll('.pro-drag-container')
      list.forEach(n=>{
        containers.push(n.querySelector('ul'))
      })

  

      Dragula({
        containers:containers,
        // isContainer: function (el) {
        //   return false; // only elements in drake.containers will be taken into account
        // },
        // moves: function (el, source, handle, sibling) {
        //   return true; // elements are always draggable by default
        // },
        // accepts: function (el, target, source, sibling) {
        //   return true; // elements can be dropped in any of the `containers` by default
        // },
        // invalid: function (el, handle) {
        //   return false; // don't prevent any drags from initiating by default
        // },
        // direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
        // copy: false,                       // elements are moved by default, not copied
        // copySortSource: false,             // elements in copy-source containers can be reordered
        // revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
        // removeOnSpill: false,              // spilling will `.remove` the element, if this is true
        // mirrorContainer: document.body,    // set the element that gets mirror elements appended
        // ignoreInputTextSelection: true,     // allows users to select input text, see details below
        // slideFactorX: 0,               // allows users to select the amount of movement on the X axis before it is considered a drag instead of a click
        // slideFactorY: 0,               // allows users to select the amount of movement on the Y axis before it is considered a drag instead of a click
      })
    }

    _getGroupData() {
        const {data,itemRender} = this.props

        const defaultRender = itemRender || function (args)  {
          
          const {itemData} = args
          
          return {
            children: {
              component:'Flex',
              align:'start',

              cols:[
                {
                  classes:{
                    'pro-group-checkbox':true,
                  
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
                // sortable:true,
                classes:{
                  'pro-drag-container':true,
                  'container':true
                },
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
