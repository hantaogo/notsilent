import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RefreshTokenKey = 'Admin-Refresh-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires = undefined) {
  if (expires !== undefined) {
    return Cookies.set(TokenKey, token, {
      expires
    })
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(refreshToken, expires = undefined) {
  if (expires !== undefined) {
    return Cookies.set(RefreshTokenKey, refreshToken, {
      expires
    })
  } else {
    return Cookies.set(RefreshTokenKey, refreshToken)
  }
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}
