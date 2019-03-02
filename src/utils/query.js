/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 提供处理 url 相关的函数
 * @Date: 2019-03-01 11:07:37
 * @LastEditTime: 2019-03-02 09:09:45
 */

/**
  * @description 截取 url 中的 query 值
  * @param {String} name
  */
export function getQuery (name) {
  /* eslint no-useless-escape: "off" */
  let result = window.location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}

/**
 * @description 删除 url 中指定的query值
 * @param {Array} paramKey
 */
export function delParam (paramKey) {
  let url = window.location.href
  let urlParam = window.location.search.substr(1)
  let beforeUrl = url.substr(0, url.indexOf('?')) || url
  let nextUrl = ''

  let arr = []
  if (urlParam !== '') {
    let urlParamArr = urlParam.split('&')
    for (let i = 0; i < urlParamArr.length; i++) {
      let paramArr = urlParamArr[i].split('=')
      if (!paramKey.includes(paramArr[0])) {
        arr.push(urlParamArr[i])
      }
    }
  }
  if (arr.length > 0) {
    nextUrl = '?' + arr.join('&')
  }
  url = beforeUrl + nextUrl
  return url
}
