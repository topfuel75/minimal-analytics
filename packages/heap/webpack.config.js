"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const path = __importStar(require("path"));
const model_1 = require("./src/model");
const outputFiles = [
    { target: 'es2018', filename: '[name].js' },
];
const defaultConfig = {
    entry: {
        index: path.join(__dirname, './src/index.ts'),
    },
    externals: [(0, webpack_node_externals_1.default)({ allowlist: ['@minimal-analytics/shared'] })],
    context: path.join(__dirname, './src'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        globalObject: 'this',
        chunkFormat: 'commonjs',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', 'json'],
    },
    node: {
        __filename: true,
        __dirname: true,
    },
    stats: {
        colors: true,
        timings: true,
    },
};
const config = ({ mode }) => outputFiles.map(({ target, filename, ...config }) => ({
    ...defaultConfig,
    mode,
    target,
    devtool: mode === 'development' ? 'eval-source-map' : void 0,
    cache: mode === 'development',
    output: {
        ...defaultConfig.output,
        filename,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                target,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        ...(target === 'es5' && { presets: ['@babel/preset-env'] }),
                    },
                },
            },
        ],
    },
    performance: {
        hints: mode === 'development' ? 'warning' : void 0,
    },
    plugins: [
        new webpack_1.DefinePlugin({
            __DEV__: mode === 'development',
        }),
    ],
    optimization: {
        usedExports: true,
        minimizer: [
            new terser_webpack_plugin_1.default({
                parallel: true,
                terserOptions: {
                    mangle: {
                        properties: {
                            reserved: [
                                'minimalAnalytics',
                                'trackingId',
                                'autoTrack',
                                'analyticsEndpoint',
                                ...Object.keys(model_1.param),
                            ],
                        },
                    },
                },
            }),
        ],
    },
    ...config,
}));
module.exports = config;
//# sourceMappingURL=webpack.config.js.map