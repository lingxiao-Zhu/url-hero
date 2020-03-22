# url-hero

URL 链式处理工具库

## 安装

`yarn add url-hero`

## 使用

```javascript
import U from 'url-hero';

// 对象方法
// 初始化URL，abid=111和hash=123会作为query初始值
U('/order/dm?abid=111#123')
  .curryQuery() // 携带所有参数
  .addQuery('abid', '222')
  .addQueryObj({
    ab: '11',
    bb: '22',
  })
  .addQueryStr('c=1&d=2&vvvv=1')
  .deleteQuery('abid')
  .setHash('#thisishash')
  .toString();

/**
 * 生成当前window.location.href的query对象。
 * @static
 * @returns {object} query对象
 */
U.getQueryObj();

/**
 * 解析query字符串，返回对象，兼容第一个字符为 `&`或者`?`
 *
 * @static
 * @param {string} queryStr query字符串
 * @returns {object} query对象
 * @example
 *
 * U.parseQuery('a=1&b=2')
 *
 * {
 *   a:1,
 *   b:2
 * }
 */
U.parseQuery('a=1&b=2');
```
