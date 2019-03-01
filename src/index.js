/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 采取Oauth2的方式，将登录状态存储在vuex中，并实现sso登录。
 * @Date: 2019-02-28 14:53:27
 * @LastEditTime: 2019-03-01 10:29:27
 */

import * as http from './http'
import * as route from './route'
import * as auth from './store'

export {
  auth,
  http,
  route
}
