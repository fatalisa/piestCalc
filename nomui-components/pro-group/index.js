define(['css!/nomui-components/pro-group/index.css'], function () {

  
    class ProGroup extends nomui.Component {
        constructor(props, ...mixins) {
          const defaults = {
            data:[
                {id:'001',
                name:'需求提案',
                events:[]
            },
            ],
            onEventCreate:null,
            onEventDelete:null,
            onEventClick:null,
            onEventDrag:null,
          }
          super(nomui.Component.extendProps(defaults, props), ...mixins)
        }
    
        _config() {
         debugger
        }
      }
    
      return ProGroup
  })
  