var webpack = require("webpack");

var uglify = new webpack.optimize.UglifyJsPlugin({});

module.exports = {
    entry: {
        all: "./public/javascripts/src/App.jsx",
        one: "./public/javascripts/src/One.jsx"
    },
    output: {
        filename: "./public/javascripts/browserify/[name].entry.js"
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: "babel?presets[]=react&presets=es2015"
            }
        ]
    },
    plugins: [uglify]
};
