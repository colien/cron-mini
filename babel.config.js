module.exports = {
  presets : [
    "@babel/env",
      
  ],
  plugins : [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}

/* 
{
  targets: {
    edge: "17",
    firefox: "60",
    chrome: "67",
    safari: "11.1",
    ie : 8
  },
  corejs : {
    version : 3,
    proposals : true
  },
  "useBuiltIns": "usage",
  "modules": "commonjs"
} */