/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 生成随机数的功能函数
 * @Date: 2019-03-01 11:06:58
 * @LastEditTime: 2019-03-01 11:07:12
 */

/**
  * @description 生成随机数的功能函数
  * @param {Number} len
  * @param {Number} radix
  */
export function uuid (len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
