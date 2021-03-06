const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:["./client-side/index.js"],
  // Where files should be sent once they are bundled
 output: {

   path: path.join(__dirname, '/dist'),
   filename: 'index.bundle.js'
 },
  // webpack 5 comes with devServer which loads in development mode
 devServer: {
   port: 3000,
   watchContentBase: true,
   historyApiFallback: true,
   disableHostCheck:true,
   proxy: {
    '/api': {
        target: 'http://localhost:8080/',
        secure: false
    },
    '/peerjs': {
      target: 'http://localhost:8080/',
      secure: false
    }
  }
},
  // Rules of how webpack will take our files, complie & bundle them for the browser 
 module: {
   rules: [
     {
       test: /\.(js|jsx)$/,
       exclude: /nodeModules/,
       use: {
         loader: 'babel-loader'
       }
     },
     {
       test: /\.css$/,
       use: ['style-loader', 'css-loader']
     },
     {
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
   ]
  },
]
 },
 plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
}