define([
  "dragula",
  "css!/libs/dragula/dragula.min.css",
  "css!/nomui-components/pro-group/index.css",
], function (Dragula) {
  nomui.Icon.add(
    "tasks",
    `<svg t="1681958966318" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3003" width="1em" height="1em" fill="currentColor"><path d="M224 800.256L223.712 224H320v31.68c0 35.456 28.64 64.32 63.872 64.32h256.256A64.16 64.16 0 0 0 704 255.68V224l96-0.256L800.256 800 224 800.256zM640 192.32L640.128 256 384 255.68V192.32L383.872 192 640 192.32zM799.84 160H695.04c-11.072-19.04-31.424-32-54.912-32h-256.256c-23.488 0-43.808 12.928-54.912 32H223.712A63.776 63.776 0 0 0 160 223.744v576.512C160 835.392 188.608 864 223.744 864h576.512A63.84 63.84 0 0 0 864 800.256V223.744A64 64 0 0 0 799.84 160z" p-id="3004"></path><path d="M619.072 429.088l-151.744 165.888-62.112-69.6a32 32 0 1 0-47.744 42.624l85.696 96a32 32 0 0 0 23.68 10.688h0.192c8.96 0 17.536-3.776 23.616-10.4l175.648-192a32 32 0 0 0-47.232-43.2" p-id="3005"></path></svg>`,
    "Uncategorized"
  );

  class ProGroup extends nomui.Component {
    constructor(props, ...mixins) {
      const defaults = {
        data: [
          {
            id: "001",
            name: "需求提案",
            events: [
              {
                id: "00101",
                name: "app原型设计",
                status: "warning",
                checked: false,
                disabled: false,
                date: "2023-01-05",
                tasks: 3,
                eventRender: null,
              },
              {
                id: "00102",
                name: "web原型设计",
                status: "warning",
                checked: false,
                disabled: false,
                date: "2023-01-08",
                tasks: 1,
                eventRender: null,
              },
            ],
          },
          {
            id: "002",
            name: "前期设计",
            events: [
              {
                id: "00102",
                name: "UI设计",
                status: "success",
                checked: false,
                disabled: false,
                date: "2023-01-10",
                tasks: 3,
                eventRender: null,
              },
            ],
          },
        ],
        onEventCreate: null,
        onEventDelete: null,
        onEventClick: null,
        onEventDrag: null,
        titleRender: null,
        eventRender: null,
      };
      super(nomui.Component.extendProps(defaults, props), ...mixins);
    }

    _config() {


      const { data, itemRender } = this.props;

      const defaultRender = itemRender || function ({ itemData }) {
          return {
            children: {
              component: "List",
              align: "start",
              gutter: "sm",

              items: [
                {
                  component: "Flex",
                  align: "center",
                  cols: [
                    {
                      component: "Icon",
                      type: "tasks",
                      classes: {
                        "pro-group-event-icon": true,
                      },
                    },
                    { children: itemData.tasks },
                  ],
                },
                {
                  component: "Flex",
                  align: "center",
                  cols: [
                    {
                      component: "Icon",
                      type: "clock",
                      classes: {
                        "pro-group-event-icon": true,
                      },
                    },
                    { children: itemData.date },
                  ],
                },
              ],
            },
          };
        };



      this.setProps({
        children: {
          component: "List",
          onCreated: ({ inst }) => {
            this.mainList = inst;
          },
          classes: {
            "pro-group-main": true,
          },
          itemRender:({itemData})=>{
            
            return {
              component: "Flex",
              classes: {
                "pro-group-box": true,
              },
              rows: [
                {
                  children: {
                    component: "Flex",
                    gutter: "small",
                    classes: {
                      "pro-group-title": true,
                    },
                    attrs: {
                      style: {
                        padding: "0 .25rem .5rem .25rem",
                      },
                    },
                    cols: [
                      {
                        children: itemData.name,
                      },
                      {
                        classes: {
                          "pro-group-title-count": true,
                        },
                        children: (itemData.events && itemData.events.length) || 0,
                      },
                    ],
                  },
                },
                {
                  component: "List",
                  classes: {
                    "pro-group-box-list": true,
                  },
                  cols: 1,
                  itemRender: ({ itemData }) => {
                    
                    return {
                      component: "Flex",
                      classes: {
                        "pro-group-card": true,
                      },
                      gap: "small",
                      rows: [
                        {
                          align: "start",
    
                          cols: [
                            {
                              classes: {
                                "pro-group-card-line": true,
                              },
                            },
                            {
                              classes: {
                                "pro-group-checkbox": true,
                              },
                              children: {
                                component: "Icon",
                                type: "check",
                              },
                            },
                            {
                              rows: [
                                {
                                  children: itemData.name,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          attrs: {
                            style: {
                              paddingLeft: "22px",
                            },
                          },
                          children: itemData.eventRender?itemData.eventRender({itemData}) :defaultRender({ itemData }),
                        },
                      ],
                    };
                  },
                  data: itemData.events,
                },
              ],
            }
          },
          data:data
        },
      });
    }

    _rendered() {
      this._initDragable();
    }

    _initDragable() {
      const me = this;

      const listArr = [];

      const boxArr = [this.element.querySelector(".pro-group-main ul")];

      const lists = this.element.querySelectorAll(".pro-group-box-list");
      lists.forEach((n) => {
        listArr.push(n.querySelector("ul"));
      });

      this.boxDrag = Dragula({
        containers: boxArr,
        moves: function (el, source, handle, sibling) {
          if (handle.closest(".pro-group-title")) {
            return true;
          }
          return false;
        },
      });

      this.listDrag = Dragula({
        containers: listArr,
        moves: function (el, source, handle, sibling) {
          if (handle.closest(".pro-group-card ")) {
            return true;
          }
          return false;
        },
      });

      this.listDrag.on("drop", function (el, target, source, sibling) {
        me._onEventDrop(el, target, source, sibling);
      });
    }

    _onEventDrop(el, target, source, sibling) {
      this.getData();
    }

    getData() {
      this.mainList
        .getAllItems()[1]
        .element.querySelector(".pro-group-box-list")
        .component.getAllItems();

      const groups = this.mainList.getAllItems();
      debugger;
    }


  }

  return ProGroup;
});
