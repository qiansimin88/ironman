#!/usr/bin/env bash

yarn install

echo "编译开始..."

yarn run dev-build

echo "编译完成..."


echo "上传cdn开始..."

node bin/cdn.js --runMode=develop

echo "上传cdn结束..."

#echo "复制文件到远程服务器..."

#scp -r dist/* root@118.31.238.217:/home/3dzao/www/bops

echo "发布完成..."
