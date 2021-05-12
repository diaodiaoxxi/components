#!/bin/bash
# last-update:2020/12/09

# 组件名称
NAME=$1

# 模块所在目录，便于后面模块创建进来
DIR_NAME=$(cd "$(dirname "${BASH_SOURCE[0]}")/../packages" && pwd)

re="[[:space:]]+"

# 检测创建模块是否符合格式要求
if [ "$#" -ne 1 ] || [[ $NAME =~ $re ]] || [ "$NAME" == "" ]; then
  echo "用法：yarn run create ${NAME} 后面不能有空格"
  exit 1
fi

FILE_DIR="$DIR_NAME/$NAME"
PREFIX="hui"

# 检测文件是否是目录
if [ -d "$FILE_DIR" ]; then
  echo "$NAME 目录已经存在，请换个名字"
  exit 1
fi

# 序列化组件名称
NORMALIZED_NAME=""
for i in $(echo $NAME | sed 's/[_|-]\([a-z]\)/\ \1/;s/^\([a-z]\)/\ \1/'); do
  C=$(echo "${i:0:1}" | tr "[:lower:]" "[:upper:]")
  NORMALIZED_NAME="$NORMALIZED_NAME${C}${i:1}"
done

mkdir -p "$FILE_DIR"
mkdir -p "$FILE_DIR/src"
mkdir -p "$FILE_DIR/src/style"
mkdir -p "$FILE_DIR/__tests__"

# index 文件
cat <<EOF >"$FILE_DIR/index.js"
import ${NORMALIZED_NAME} from './src/${NORMALIZED_NAME}'

${NORMALIZED_NAME}.install = (Vue) => {
  Vue.component(${NORMALIZED_NAME}.name, ${NORMALIZED_NAME})
}

export default ${NORMALIZED_NAME}
EOF

# vue 文件
cat > $FILE_DIR/src/$NORMALIZED_NAME.vue <<EOF
<template>
  <div>
  </div>
</template>
<script>

export default {
  name: '${NORMALIZED_NAME}',
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>
EOF

# style 文件
cat > $FILE_DIR/src/style/index.scss <<EOF
// ${NAME}.scss
EOF

# jest 文件
cat > $FILE_DIR/__tests__/$NAME.spec.js <<EOF
import $NORMALIZED_NAME from "../src/$NORMALIZED_NAME.vue"

const AXIOM = "$PREFIX is the best UI"

describe('$NORMALIZED_NAME.vue', () => {
  test('render test', () => {
    const wrapper = mount($NORMALIZED_NAME, {
      slots: {
        default: AXIOM,
      }
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
EOF

# package.json
cat > $FILE_DIR/package.json <<EOF
{
  "name": "@${PREFIX}/${NAME}",
  "version": "1.0.0",
  "description": "> TODO: description",
  "keywords": ["${PREFIX}","${NAME}","@${PREFIX}/${NAME}"],
  "author": "hundsun",
  "license": "ISC",
  "main": "dist/${NAME}.js",
  "directories": {
    "test": "__tests__"
  },
  "files": [
    "dist"
  ],
  "publishConfig": {
    "registry": "http://192.168.102.232:6060/repository/rd_center/"
  },
  "scripts": {
    "build": "hui-build",
    "build:lib": "node build/lib.js",
    "test": "echo \"Error: run tests from root\" && exit 1"
  },
  "dependencies": {
    "@hui/scss-utils": "^1.0.3",
    "@hui/shared-utils": "^1.0.2"
  }
}
EOF

# README.md
cat > $FILE_DIR/README.md <<EOF
# ${NAME}

> TODO: description

## Usage

// TODO: DEMONSTRATE API
EOF