define([], function () {
  let service = null;

  MenuService = function () {
    service = this
    this.data = [];
    this._itemList = []
  };

  


  function isReplace(key) {
    if (service._itemList.includes(key)) {
      return true
    }
    return false
  }

  function findItem() {
    return null
  }

  function addSingle(param) {
    const {name,parentName,path,order} = param
    if (isReplace(name)) {
      debugger

    }
    else {
      service.data.push(param)
      service._itemList.push(name)

    }

  } 

  MenuService.prototype.getData = function () {
    return this.data
  };

  MenuService.prototype.add = function (list) {
    list.forEach(n=>{
      addSingle(n)
    })
  };

  MenuService.prototype.remove = function () {};

  MenuService.prototype.replace = function () {};


  return MenuService ;
});
