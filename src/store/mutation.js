/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 设置mutations
 * @Date: 2019-03-01 14:09:15
 * @LastEditTime: 2019-03-01 14:18:45
 */
import * as constants from './constants.js'

export default {
  [constants.SET_STATE] (state, payload) {
    state.authState = payload
  },
  [constants.SET_CODE] (state, payload) {
    state.code = payload
  },
  [constants.SET_ACCESS_TOKEN] (state, payload) {
    state.accessToken = payload
  },
  [constants.SET_REFRESH_TOKEN] (state, payload) {
    state.refreshToken = payload
  },
  [constants.SET_AUTH_STATE] (state, payload) {
    let {
      accessToken,
      refreshToken,
      authState,
      code
    } = payload
    state.authState = authState
    state.code = code
    state.accessToken = accessToken
    state.refreshToken = refreshToken
  }
}
