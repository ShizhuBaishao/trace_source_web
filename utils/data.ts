interface IUserInfo {
  signUserId: string
  address: string
  nodeType: string
  isRegister: string
}

export function saveUserInfo(userInfo: IUserInfo) {
  localStorage.setItem('signUserId', userInfo.signUserId)
  localStorage.setItem('address', userInfo.address)
  localStorage.setItem('nodeType', userInfo.nodeType)
  localStorage.setItem('isRegister', userInfo.isRegister)
}
