#!/usr/bin/env bash

yarn install

echo "编译开始..."

yarn run test-build

echo "编译完成..."

echo "上传cdn开始..."

node bin/cdn.js --runMode=test

echo "上传cdn结束..."

#echo "复制文件到远程服务器..."

#scp -r dist/* root@112.124.9.105:/home/3dker/static_www/bops

echo "发布完成..."
