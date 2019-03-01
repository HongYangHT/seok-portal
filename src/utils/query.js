/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 提供处理 url 相关的函数
 * @Date: 2019-03-01 11:07:37
 * @LastEditTime: 2019-03-01 16:37:19
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
