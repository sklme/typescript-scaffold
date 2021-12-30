#!/bin/bash
echo '开始狗叫lib'
npm run build 

echo '构建完成，开始发布'
npm publish --access public