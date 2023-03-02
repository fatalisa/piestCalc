define([], function () {
  MenuService = function () {
    this.data = [];
  };

  MenuService.prototype.getData = function () {
    return this.data
  };

  MenuService.prototype.add = function (param) {
    const {name,path,parentMenu,icon,order,permission} = param
    this.data.push(param)

  };

  MenuService.prototype.remove = function () {};

  MenuService.prototype.replace = function () {};


  return MenuService ;
});
