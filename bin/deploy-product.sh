#!/usr/bin/env bash

yarn install

echo "编译开始..."

yarn run prod-build

echo "编译完成..."

echo "上传cdn开始..."

node bin/cdn.js --runMode=production

echo "上传cdn结束..."


echo "发布完成..."
