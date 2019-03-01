class Storage {
  constructor () {
    this.storageProxy = window.sessionStorage
    this.defaultLiftTime = 30 * 24 * 60 * 60 * 1000
    this.keyCache = 'SE_OK_PORTAL_KEY_TIMEOUT_MAP'
  }

  init () {
    if (!this.storageProxy) {
      throw new Error('not override storageProxy property')
    }
  }
  /*
    新增localstorage
    数据格式需要转化成string,所以先要判断数据的类型，所以需要转化成JSON.stringify、JSON.parse
    每一条存储的信息需要
  */
  set (key, value, expire) {
    let _that = this
    key = typeof key !== 'string' ? String(key) : key
    value = this.serializer(value, expire)
    if (!_that.isSupport()) {
      console.error('your brower doesn\'t support localStorage')
      return false
    }
    try {
      _that.unEffectiveItem() // 删除失效的localStorage
      this.storageProxy.setItem(key, value)
      let keyCode = this.storageProxy.getItem(this.keyCache)
      if (keyCode) {
        let keyArr = keyCode.split(',')
        let keySet = new Set(keyArr)
        keySet.add(key)
        this.storageProxy.setItem(this.keyCache, Array.from(keySet).join(','))
      } else {
        this.storageProxy.setItem(this.keyCache, key)
      }
    } catch (e) {
      if (_that.isQuotaExceeded(e)) {
        console.error('Not enough storage is available to complete this operation.')
      }
    }
  }
  get (key) {
    key = typeof key !== 'string' ? String(key) : key
    let cacheItem = this.storageProxy.getItem(key)
    if (cacheItem) {
      try {
        cacheItem = this.unSerializer(this.storageProxy.getItem(key))
      } catch (e) {
        return null
      }
    }
    let _now = new Date().getTime()
    if (cacheItem && _now < new Date(cacheItem.t).getTime()) {
      return cacheItem.v
    } else {
      this.remove(key)
    }
    return null
  }
  getAll () {
    let localStorages = []
    let _that = this
    if (!this.storageProxy && !this.storageProxy.length) return ''
    let keys = Object.keys(this.storageProxy)
    keys.forEach(k => {
      let n = {}
      let cacheItem = _that.unSerializer(_that.storageProxy[k])
      n.id = k
      n.st = cacheItem.st
      n.v = cacheItem.v
      localStorages.push(n)
    })
    return localStorages
  }
  remove (key) {
    key = typeof key !== 'string' ? String(key) : key
    this.storageProxy.removeItem(key)
  }
  unEffectiveItem () {
    let _now = new Date().getTime()
    let _that = this
    if (!_that.storageProxy && !_that.storageProxy.length) return
    let keyCode = this.storageProxy.getItem(this.keyCache)
    let keys = keyCode ? keyCode.split(',') : []
    if (keys && keys.length) {
      keys.forEach(key => {
        let cacheItem = _that.unSerializer(_that.storageProxy[key])
        if (cacheItem && _now > new Date(cacheItem.t).getTime()) _that.remove(key)
      })
    }
  }
  isSupport () {
    let _supported = false
    let _that = this
    if (this.storageProxy && this.storageProxy.setItem) {
      _supported = true
      let _key = '__' + Math.round(Math.random() * 1e7)
      _that.storageProxy.setItem(_key, _that.keyCache)
      _that.storageProxy.removeItem(_key)
    }

    return _supported
  }
  isQuotaExceeded (e) {
    let _isQuotaExceeded = false
    if (e) {
      if (e.code) {
        // storage full
        switch (e.code) {
        case 22:
          _isQuotaExceeded = true
          break
        case 1014:
          /*
                for Firefox
                {
                  code: 1014,
                  name: 'NS_ERROR_DOM_QUOTA_REACHED',
                  message: 'Persistent storage maximum size reached',
                  // …
                }
            */
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            _isQuotaExceeded = true
          }
          break
        }
      } else if (e.number === -2147024882) {
        /*
            lt IE8, there is no code in return message
            {
                number: -2147024882,
                message: 'Not enough storage is available to complete this operation.',
                // …
            }
        */
        _isQuotaExceeded = true
      }
    }

    return _isQuotaExceeded
  }
  serializer (value, expire) {
    let _now = new Date().getTime()
    expire = expire || this.defaultLiftTime
    let _expires = typeof expire === 'number' ? new Date(_now + expire) : (typeof expire === 'string' ? new Date(expire) : new Date())
    let _val = {}
    _val.v = value
    _val.t = _expires
    _val.st = new Date().getTime()
    return this.handleJSON(_val)
  }
  unSerializer (obj) {
    if (!obj) return ''
    return JSON.parse(obj)
  }
  handleJSON (obj) {
    let _type = this.getType(obj)
    let _result = ''
    switch (_type) {
    case 'boolean':
    case 'function':
    case 'undefined':
    case 'null':
      console.error('obj type(boolean | function | undefined | null) is illegal')
      break
    default:
      _result = JSON.stringify(obj)
      break
    }
    return _result
  }
  getType (obj) {
    let map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Data]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }

    if (obj instanceof window.Element) {
      return 'element'
    }

    return map[Object.prototype.toString.call(obj)]
  }
}

export default new Storage()
