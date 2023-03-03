define([], function () {
  let service = null;
  

  VNextMenu = function () {
    service = this
    this.data = [];
    this._itemList = []
  };

  


  // 判断是否已存在item
  function isDuplicate(key) {
    if (service._itemList.includes(key)) {
      return true
    }
    return false
  }
  

  // 获取item & 修改item值（可选）
  function getItem({ arr, name, data }) {
    if (!arr) {
      arr = service.data
    }
    let obj = null
    function findArr (item)  {
      for (let i = 0; i < item.length; i++) {
        if (item[i].name && item[i].name === name) {
          obj = item[i]
          if (data) {
            item[i] = Object.assign({}, item[i], data)
          }
          break
        } else if (item[i].children) {
          item[i].children.forEach((n) => {
            findArr(n)
          })
        }
      }
    }
    findArr(arr)
    return obj
  }

  // 数组插入项
  function appendToArray(arr, index, value) {
    arr.splice(index, 0, value)
    return arr
  }

  // 数组删除项
  function removeFromArray(arr, index) {
    arr.splice(index, 1)
    return arr
  }

  // 数组指定item的子集插入子项
  function appendChild(param) {
    const { data } = service
    function findArr (item){
      for (let i = 0; i < item.length; i++) {
        if (item[i].name && item[i].name === param.parentName) {
          
          if (!item[i].children) {
            item[i].children = []
          }
          item[i].children.push(param)
          break
        } else if (item[i].children) {
          item[i].children.forEach((n) => {
            findArr(n)
          })
        }
      }
    }
    findArr(data)
  }

    // 数组指定item后面添加对象
    function after(param) {
      const { data } = service
      function findArr (item){
        for (let i = 0; i < item.length; i++) {
          if (item[i].name && item[i].name === param.parentName) {
            appendToArray(item, i + 1, param)
            break
          } else if (item[i].children) {
            item[i].children.forEach((n) => {
              findArr(n)
            })
          }
        }
      }
      findArr(data)
    }

  // 添加项
  function addItem(item) {
    if (item.parentName) {
      
      appendChild(item)
    }
    else {
      service.data.push(item)
    }
    service._itemList.push(item.name)
  }

  // 编辑项
  function editItem(item) {
    getItem({name:item.name,data:item})
  }

  function addSingle(param) {
    const {name} = param
    if (isDuplicate(name)) {
      console.warn('已存在同名菜单，请修改名称！')
      return
    }
    addItem(param)
  } 

  VNextMenu.prototype.getData = function () {
    return this.data
  };

  VNextMenu.prototype.add = function (list) {
    list.forEach(n=>{
      addSingle(n)
    })
  };

  VNextMenu.prototype.remove = function () {};

  VNextMenu.prototype.replace = function () {};

  if (!window.MenuService) {
    window.MenuService = new VNextMenu()
  }
  
  return  window.MenuService;
});
