/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description:  请求拦截器
 * @Date: 2019-02-28 15:48:28
 * @LastEditTime: 2019-03-01 15:36:59
 */
import {
  Base64
} from 'js-base64'

import {
  query,
  uuid,
  storage
} from '../utils'

/**
 * 请求拦截需要提供两个功能
 * 1. 当 accessToken 存在 ‘store’ 中时，需要将其加入到请求头 header 中
 * 2. 当 accessToken 存在‘ store’ 中时, 且请求路径是‘ tokenUri’, 表示是请求接口， 需要将‘ client_id’ 和‘ clientSecret’ 加入到请求头中
 * 3. 当 accessToken 不存在 ‘store’ 中时， 需要将‘ client_id’ 和‘ clientSecret’ 加入到请求头中
 */
/**
 * @description 设置请求拦截器
 * @param {*} config axios的config
 * @param {*} authorization 配置文件
 * @param {*} auth 登录相关的状态
 */
export function requestInterceptor (config, authorization, auth) {
  const {
    accessToken,
    refreshToken,
    authState,
    code
  } = auth
  let count = storage.get('se_ok_portal_http_count')
  if (accessToken && refreshToken) {
    if (config.url && config.url.indexOf(authorization.tokenUri) !== -1) {
      config.headers.Authorization = 'Basic ' + Base64.encode(authorization.client_id + ':' + authorization.clientSecret)
    } else {
      config.headers.Authorization = 'Bearer ' + accessToken
    }
  } else {
    let state = authState || query.getQuery('state')
    let authCode = code || query.getQuery('code')
    if (authCode && state) {
      config.headers.Authorization = 'Basic ' + Base64.encode(authorization.client_id + ':' + authorization.clientSecret)
    } else {
      // 需要去重新认证
      if (count && parseInt(count) > 0) {
        storage.set('se_ok_portal_http_count', 1)
        let msg = {
          client_id: authorization.client_id,
          redirect_uri: encodeURIComponent(window.location.href),
          state: uuid.uuid(6, 16)
        }
        window.location.href = authorization.authorizeUri + '?client_id=' + msg.client_id + '&redirect_uri=' + msg.redirect_uri + '&response_type=code&scope=read&state=' + msg.state
      }
    }
  }
  return config
}

/**
 * 请求返回错误拦截器，该拦截器， 需要拦截两种状态
 * 1. 返回 ‘status’ 表示为 ‘accessToken’ 为失效状态，此时我们需要主动发请求，去刷新‘token’
 * 2. 返回 ‘status’ 表示为 未登录时，需要跳转到登录界面
 */
/**
 * @description 请求返回错误拦截器
 * @param {*} error 请求返回信息
 * @param {*} authorization 配置文件
 */
export function responseErrorInterceptor (error, authorization, requestInstance, auth, cb) {
  const {
    refreshToken,
    authState,
    code
  } = auth
  let count = storage.get('se_ok_portal_res_count')
  if (error && error.response) {
    switch (error.response.status) {
    // ‘accessToken’ 为失效状态, 刷新‘token’
    case 401:
      // TODO:
      if (refreshToken && !count) {
        storage.set('se_ok_portal_res_count', 1)
        requestInstance.post(authorization.tokenUri + '?grant_type=refresh_token' + '&refresh_token=' + encodeURIComponent(refreshToken) + '&scope=read', '', {
          headers: {
            Authorization: 'Basic ' + Base64.encode(authorization.client_id + ':' + authorization.clientSecret)
          }
        }).then(res => {
          const accessToken = res && res.data && res.data.access_token
          const refreshToken = res && res.data && res.data.refresh_token
          /**
           * 通过回调函数进行设置access_token 、 refresh_token、state、code
           * 因为在包中无法进行设置
           */
          cb(accessToken, refreshToken, authState, code)
        })
      }
      break
    default:
      break
    }
  }
}
