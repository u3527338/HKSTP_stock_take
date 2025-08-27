const path = require("path");
const fs = require("fs");

const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, "dist");

const root = "./src";
const folders = ["index", "function"];
var pathList = [];
var filePathsObject = {};

function recursiveGetFiles(src = root, isChildren = false) {
  const target = folders.map((folder) => `${root}/${folder}`);
  if (
    !target.filter((t) => src.startsWith(t) || t.startsWith(src)).length &&
    src !== root
  )
    return;
  if (isChildren) {
    pathList.push(src);
    return;
  }
  var files = fs.readdirSync(src);
  files.map((file) => {
    recursiveGetFiles(`${src}/${file}`, file.includes("."));
  });
}

function convert() {
  recursiveGetFiles();
  pathList.forEach((path) => {
    const key = path
      .split("/")
      .slice(2)
      .join("_")
      .toLowerCase()
      .replace(".tsx", "");
    filePathsObject[key] = path;
  });
}

convert();
module.exports = {
  mode: "production", //"production", "development"
  entry: filePathsObject,
  devtool: "none",
  output: {
    library: "codeInModules",
    libraryTarget: "assign",
    path: BUILD_PATH,
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx|\.ts$/,
        exclude: /^node_modules$/,
        use: "ts-loader",
      },
      {
        test: /\.jsx|\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["env", "react"],
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader",
        options: {
          name: "/src/icons/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {},
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
