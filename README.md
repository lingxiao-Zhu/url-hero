# alto

URL URL 链式处理工具库

## 安装

`yarn add alto`

## 使用

```javascript
import U from 'alto'

U('/order/dm?abid=111') // 初始化URL，abid=111会作为query初始值
    .curryQuery() // 携带所有参数
    .addQuery('abid', '222')
    .addQueryStr('c=1&d=2&vvvv=1')
    .deleteQuery('abid')
    .setHash('#thisishash')
    .toString(),
```

## 发布

`npm run pub`
