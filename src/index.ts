import qs from 'qs';

// 私有属性
const _host = Symbol.for('Alto_Host');
const _hash = Symbol.for('Alto_Hash');
const _query = Symbol.for('Alto_Query');

// 适配器类型声明
type IAdapter = Record<string, (() => string) | string>;

/**
 * 解析目标地址并初始化query和hash
 *
 * @param url 目标地址，可能会携带query和hash
 * @private
 */
function _parse(this: Alto, url: string): void {
  const [host, queryWithHash] = url.trim().split('?');
  this[_host] = host;
  if (queryWithHash) {
    const [query, hash] = queryWithHash.split('#');
    this.addQueryStr(query);
    this.setHash(hash);
  }
}

/**
 * 通过链式调用来构造URL
 */
class Alto {
  private [_host]?: string; // 目标地址，域名+路径

  private [_query]: Record<string, string>;

  private [_hash]?: string; // 含 `#`

  /**
   * 初始化对象
   *
   * @param url
   */
  constructor(url?: string) {
    if (!(this instanceof Alto)) return new Alto(url);

    this[_query] = {};
    this[_host] = '';
    this[_hash] = '';
    this.setUrl(url);
  }

  /**
   * 解析query字符串，返回对象，兼容第一个字符为 `&`或者`?`
   *
   * @static
   * @param {string} queryStr query字符串
   * @returns {object} query对象
   * @example
   *
   * Alto.parseQuery('a=1&b=2')
   *
   * {
   *   a:1,
   *   b:2
   * }
   */
  static parseQuery(queryStr: string): Record<string, string> {
    const newStr = queryStr.substr(queryStr.startsWith('&') ? 1 : 0);
    return qs.parse(newStr, {ignoreQueryPrefix: true});
  }

  /**
   * 获取当前url中的query对象
   * @returns {object} query对象
   */
  static getQueryObj(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    return Alto.parseQuery(window.location.search);
  }

  /**
   * 携带当前url全部的query，接受一个参数：适配器，用于处理特殊参数。
   * 比如当前url中的参数是page_id，但是需要改成from_pageId进行传递。
   *
   * @param {object} adapter 适配器
   * @example
   *
   * curryQuery({
   *   'pageId': 'from_pageId'
   * })
   */
  curryAllQuery(adapter?: IAdapter): Alto {
    if (typeof window === 'undefined') return this;
    this.addQueryStr(window.location.search, adapter);
    return this;
  }

  /**
   * 解析query字符串，并添加到_query中。
   * 兼容前缀是否含 `?` 或 `&`
   *
   * @param {string} queryStr
   * @param {object} adapter 适配器
   */
  addQueryStr(queryStr?: string, adapter?: IAdapter): Alto {
    if (!queryStr) return this;
    const queryObj = Alto.parseQuery(queryStr);
    this.addQueryObj(queryObj, adapter);
    return this;
  }

  /**
   * 添加query对象
   *
   * @param {object} queryObj
   * @param {object} adapter 适配器
   */
  addQueryObj(queryObj: Record<string, string> = {}, adapter?: IAdapter): Alto {
    Object.keys(queryObj).forEach(oldKey => {
      let newKey = oldKey;
      if (adapter && adapter[oldKey]) {
        const aKey = adapter[oldKey];
        newKey = typeof aKey === 'function' ? aKey() : aKey;
      }
      return this.addQuery(newKey, queryObj[oldKey]);
    });
    return this;
  }

  /**
   * 添加单个query，如果value为空，则不添加
   *
   * @param {string} key
   * @param {string} value
   * @param {boolean} override 是否覆盖已存在的query值。默认true
   * @example
   *
   * addQuery('pageId', '12345')
   */
  addQuery(key: string, value?: string, override = true): Alto {
    if (key && value) this[_query][key] = override ? value : this[_query][key] || value;
    return this;
  }

  /**
   * 支持后置设置目标url，而不是在构造函数就传入。
   *
   * @param {string} url 目标地址，可以包含query和hash作为初始值
   */
  setUrl(url?: string): Alto {
    url && _parse.call(this, url);
    return this;
  }

  /**
   * 设置hash值
   *
   * @param {string} hash 兼容前缀是否含 `#`
   */
  setHash(hash?: string): Alto {
    hash && (this[_hash] = hash.startsWith('#') ? `${hash}` : `#${hash}`);
    return this;
  }

  /**
   * 删除某个query
   *
   * @param {string} key
   */
  deleteQuery(key?: string): Alto {
    key && delete this[_query][`${key}`];
    return this;
  }

  /**
   * 序列化query、host和hash，拼接返回完整的目标url。
   * 返回的值又可以用于Alto的构造函数入参
   *
   * @returns {string} 返回完整的目标url
   */
  toString(): string {
    const queryStr = qs.stringify(this[_query]);
    return `${this[_host]}?${queryStr}${this[_hash]}`;
  }

  /**
   * 执行跳转操作
   */
  go(): void {
    if (typeof window !== 'undefined') {
      window.location.href = this.toString();
    }
  }
}

export default Alto;
