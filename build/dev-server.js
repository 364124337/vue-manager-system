require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

var vuetableData = require('../vuetable.json');
var datasourceData = require('../datasource.json');

var apiRoutes = express.Router();

apiRoutes.get('/vuetable', function (req, res) {
  res.json({
    error: 0,
    data: vuetableData
  })
})

apiRoutes.get('/datasource', function (req, res) {
  res.json({
    "pagination": {
      "total": 15,
      "per_page": 15,
      "current_page": 1,
      "last_page": 1,
      "from": 1,
      "to": 15
    },
    "data": [{
      "id": 1,
      "name": "段娜",
      "email": "g.rgiuory@kctbut.mw",
      "ip": "68.28.4.232"
    },
    {
      "id": 2,
      "name": "蔡洋",
      "email": "y.mwjjoje@lpkshev.tg",
      "ip": "22.126.12.189"
    },
    {
      "id": 3,
      "name": "陈敏",
      "email": "e.voaiiuo@mvng.sn",
      "ip": "227.89.13.37"
    },
    {
      "id": 4,
      "name": "朱平",
      "email": "e.lduuf@nkfypn.az",
      "ip": "9.39.240.243"
    },
    {
      "id": 5,
      "name": "侯平",
      "email": "t.czqjyndts@jmwenklns.md",
      "ip": "178.162.29.113"
    },
    {
      "id": 6,
      "name": "常超",
      "email": "d.dhysgem@uxpcutmlk.tt",
      "ip": "192.50.103.170"
    },
    {
      "id": 7,
      "name": "许平",
      "email": "g.fiqdonvbc@wanepptw.tv",
      "ip": "73.20.99.60"
    },
    {
      "id": 8,
      "name": "毛超",
      "email": "w.unyyejh@qus.gt",
      "ip": "10.88.135.123"
    },
    {
      "id": 9,
      "name": "周磊",
      "email": "e.qbejguqqg@ejpxhltoak.gw",
      "ip": "244.221.237.210"
    },
    {
      "id": 10,
      "name": "胡秀英",
      "email": "s.dszo@uxaojtj.sy",
      "ip": "86.199.17.210"
    }
    ]
  }
  )
})


app.use('/api', apiRoutes);


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => { }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
