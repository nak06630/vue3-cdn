import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { Config, CognitoIdentityCredentials } from 'aws-sdk'

export default class Cognito {
  configure(config) {
    if (config.userPool) {
      this.userPool = config.userPool
    } else {
      this.userPool = new CognitoUserPool({
        UserPoolId: config.UserPoolId,
        ClientId: config.ClientId
      })
    }
    Config.region = config.region
    Config.credentials = new CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId
    })
    this.options = config
  }

  static install = (Vue, options) => {
    Object.defineProperty(Vue.prototype, '$cognito', {
      get() {
        return this.$root._cognito
      }
    })

    Vue.mixin({
      beforeCreate() {
        if (this.$options.cognito) {
          this._cognito = this.$options.cognito
          this._cognito.configure(options)
        }
      }
    })
  }

  /**
   * singUp(1/2): email, name, password でサインアップ
   */
  signUp(email, name, password) {
    const dataEmail = { Name: 'email', Value: email }
    const dataName = { Name: 'name', Value: name }
    const attributeList = []
    attributeList.push(new CognitoUserAttribute(dataEmail))
    attributeList.push(new CognitoUserAttribute(dataName))
    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
   * singUp(2/2): 確認コードからユーザーを有効化する
   */
  confirmRegistration(email, confirmationCode) {
    const userData = { Username: email, Pool: this.userPool }
    const cognitoUser = new CognitoUser(userData)
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
   * singIn: username, password でログイン
   */
  signIn(username, password) {
    const userData = { Username: username, Pool: this.userPool }
    const cognitoUser = new CognitoUser(userData)
    const authenticationData = { Username: username, Password: password }
    const authenticationDetails = new AuthenticationDetails(authenticationData)
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result)
        },
        onFailure: err => {
          reject(err)
        }
      })
    })
  }

  /**
   * signOut: ログアウト
   */
  signOut() {
    this.userPool.getCurrentUser().signOut()
  }

  /**
   * ログインしているか判定
   */
  isAuthenticated() {
    const cognitoUser = this.userPool.getCurrentUser()
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        reject(cognitoUser)
      }
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
        } else {
          if (!session.isValid()) {
            reject(session)
          } else {
            resolve(session)
          }
        }
      })
    })
  }

  /**
   * パスワード再発行(1/2)
   */
  forgotPassword(username) {
    const userData = { Username: username, Pool: this.userPool }
    const cognitoUser = new CognitoUser(userData)
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: result => {
          resolve(result)
        },
        onFailure: err => {
          reject(err)
        }
      })
    })
  }

  /**
   * パスワード再発行(2/2)
   */
  confirmPassword(username, newPassword, code) {
    const userData = { Username: username, Pool: this.userPool }
    const cognitoUser = new CognitoUser(userData)
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: result => {
          resolve(result)
        },
        onFailure: err => {
          reject(err)
        }
      })
    })
  }

  /**
   * パスワード更新（signInが必要）
   */
  changePassword(oldPassword, newPassword) {
    const cognitoUser = this.userPool.getCurrentUser()
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        reject(cognitoUser)
      }
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
        } else {
          if (!session.isValid()) {
            reject(session)
          } else {
            cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
              if (err) {
                reject(err)
              } else {
                resolve(result)
              }
            })
          }
        }
      })
    })
  }
}
