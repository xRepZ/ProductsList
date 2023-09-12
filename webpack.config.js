const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { createProxyMiddleware } = require('http-proxy-middleware')


module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
        ],
    },
    mode: 'development',
    devServer: {
        port: 9000,
        hot: true,
        static: {
          directory: path.join(__dirname, './dist'),
        },
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: 'Hot Module Replacement',
        }),
        new VueLoaderPlugin(),
    ]
}
