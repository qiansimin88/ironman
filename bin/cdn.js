#! /usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin');

const runMode = argv.runMode || 'develop';
const config = require(`../scaffold/config/${runMode}.config`);

const { ossConfig } = config;


const {
    accessKeyId, accessKeySecret, bucket, preFlag
} = ossConfig;

const oss = new AliyunossWebpackPlugin({
    buildPath: './dist/**',
    region: 'oss-cn-hangzhou',
    accessKeyId,
    accessKeySecret,
    bucket,
    generateObjectPath: (fileName, file) => {
        const fN = file.replace('./dist', preFlag);
        return fN;
    }
});
oss.apply();
