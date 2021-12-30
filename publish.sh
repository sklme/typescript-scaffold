#!/bin/bash
echo '开始构建lib...'
npm run build 

echo '构建完成，开始发布...'
npm publish --access public