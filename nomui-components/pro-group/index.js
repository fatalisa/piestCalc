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
            component:'Flex',
            cols:groups
        }
      })
    }

    _getGroupData() {
        
    }
  }

  return ProGroup;
});
