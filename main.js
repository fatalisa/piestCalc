'use strict'
  ; (function (win) {
    requirejs.onError = function (err) {
      console.log(err)
      console.log('modules: ' + err.requireModules)
    }

    requirejs.config({

      map: {
        '*': {
          css: 'libs/require-css.min.js',
        },
      },
      baseUrl: '/',
      waitSeconds: 15, //超时时间
      paths: {
        "pro-group":'/nomui-components/pro-group/index',
        "pro-workflow":'/nomui-components/pro-workflow/index',
        "pro-list":'/nomui-components/pro-list/index',
      },
      shim: {
       
      },
    })

    require([], function () {



      win.nomapp = new nomui.App({
        viewsDir: 'page',
        // defaultPath: '!dashboard/org',
        defaultPath: '_layout',
        isFixedLayout: false,

      })

    })

  })(window)
