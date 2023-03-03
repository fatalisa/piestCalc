define([], function () {
  let service = null;

  VNextMenu = function () {
    service = this;
    this.data = {};
    this._itemList = [];
  };

  // 判断是否已存在item
  function isDuplicate(group, key) {
    if (service._itemList[group].includes(key)) {
      return true;
    }
    return false;
  }

  // 获取item & 修改item值（可选）
  function getItem({ group, arr, name, data }) {
    if (!arr) {
      arr = service.data[group];
    }
    let obj = null;
    function findArr(item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].name && item[i].name === name) {
          obj = item[i];
          if (data) {
            item[i] = Object.assign({}, item[i], data);
          }
          break;
        } else if (item[i].children) {
          item[i].children.forEach((n) => {
            findArr(n);
          });
        }
      }
    }
    findArr(arr);
    return obj;
  }

  // 数组插入项
  function appendToArray(arr, index, value) {
    arr.splice(index, 0, value);
    return arr;
  }

  // 数组删除项
  function removeFromArray(arr, index) {
    arr.splice(index, 1);
    return arr;
  }

  // 数组指定item的子集插入子项
  function appendChild(group, param) {
    const { data } = service;
    function findArr(item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].name && item[i].name === param.parentName) {
          if (!item[i].children) {
            item[i].children = [];
          }
          item[i].children.push(param);
          break;
        } else if (item[i].children) {
          item[i].children.forEach((n) => {
            findArr(n);
          });
        }
      }
    }
    findArr(data[group]);
  }

  // 数组指定item后面添加对象
  function after(param) {
    const { data } = service;
    function findArr(item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].name && item[i].name === param.parentName) {
          appendToArray(item, i + 1, param);
          break;
        } else if (item[i].children) {
          item[i].children.forEach((n) => {
            findArr(n);
          });
        }
      }
    }
    findArr(data);
  }

  // 添加项
  function addItem(group, item) {
    if (item.parentName) {
      appendChild(group, item);
    } else {
      service.data[group].push(item);
    }
    service._itemList[group].push(item.name);
  }

  // 排序
  function sortArray(group) {
    function sortTree(arr) {
      arr = arr.sort((a, b) => {
        return a.order - b.order;
      });
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          sortTree(arr[i].children);
        }
      }
    }

    sortTree(service.data[group]);
  }

  // 编辑项
  function editItem(group, item) {
    getItem({ group: group, name: item.name, data: item });
  }

  function addSingle(group, item) {
    if (isDuplicate(group, item.name)) {
      console.warn("操作终止，因为存在同名菜单，请修改名称后重试！");
      return;
    }
    addItem(group, item);
  }

  VNextMenu.prototype.getData = function (group) {
    return this.data[group] || [];
  };

  VNextMenu.prototype.add = function (group, list) {
    if (!service.data[group]) {
      service.data[group] = [];
    }
    if (!service._itemList[group]) {
      service._itemList[group] = [];
    }

    list.forEach((n) => {
      addSingle(group, n);
    });
    sortArray(group);
  };

  VNextMenu.prototype.remove = function () {};

  VNextMenu.prototype.replace = function (group, item) {
    editItem(group, item);
    sortArray(group);
  };

  if (!window.MenuService) {
    window.MenuService = new VNextMenu();
  }

  return window.MenuService;
});
