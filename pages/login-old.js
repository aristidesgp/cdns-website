import { Component } from "react"

import "../styles/pages/login.css"

import HeadMetadata from "../components/headMetadata.js"
import GoogleAnalytics from "../components/googleAnalytics.js"

import createNewUser from "../api/users/createNewUser.js"
import loginUser from "../api/users/loginUser.js"
import authUser from "../api/users/authUser.js"
import removeUserCookieData from "../api/users/removeUserCookieData.js"

export default class extends Component {
  static async getInitialProps ({req, res, query}) {
    const authResult = await authUser(req)

    if (authResult.success) {
      res.writeHead(302, {
        Location: "/"
      })

      res.end()
    }

    return {
      goto: query.goto ? decodeURIComponent(query.goto) : ""
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,

      // login
      loginUsernameInputValue: "",
      loginPasswordInputValue: "",
      loginCredentialError: false,
      loginSubmitError: false,
      bannedError: false,

      //create account
      createAccountUsernameInputValue: "",
      createAcountPasswordInputValue: "",
      createAccountUsernameExistsError: false,
      createAccountUsernameLengthError: false,
      createAccountPasswordLengthError: false,
      createAccountSubmitError: false
    }
  }

  componentDidMount() {
    removeUserCookieData()
  }

  updateLoginUsernameInputValue = (event) => {
    this.setState({loginUsernameInputValue: event.target.value})
  }

  updateLoginPasswordInputValue = (event) => {
    this.setState({loginPasswordInputValue: event.target.value})
  }

  updateCreateAccountUsernameInputValue = (event) => {
    this.setState({createAccountUsernameInputValue: event.target.value})
  }

  updateCreateAccountPasswordInputValue = (event) => {
    this.setState({createAcountPasswordInputValue: event.target.value})
  }

  submitLogin = () => {
    if (this.state.loading) return

    const username = this.state.loginUsernameInputValue
    const password = this.state.loginPasswordInputValue

    if (username.length === 0 || password.length === 0) {
      this.setState({
        loginCredentialError: true,
        loginSubmitError: false,
        bannedError: false
      })
    } else {
      this.setState({loading: true})

      const self = this

      loginUser(username, password, function(response) {
        if (response.credentialError) {
          self.setState({
            loading: false,
            loginCredentialError: true,
            loginSubmitError: false,
            bannedError: false
          })
        } else if (response.bannedError) {
          self.setState({
            loading: false,
            loginCredentialError: false,
            loginSubmitError: false,
            bannedError: true
          })
        } else if (response.submitError || !response.success) {
          self.setState({
            loading: false,
            loginCredentialError: false,
            loginSubmitError: true,
            bannedError: false
          })
        } else {
          window.location.href = `/${self.props.goto}`
        }
      })
    }
  }

  submitCreateAccount = () => {
    if (this.state.loading) return

    const username = this.state.createAccountUsernameInputValue
    const password = this.state.createAcountPasswordInputValue

    if (username.length < 2 || username.length > 15) {
      this.setState({
        createAccountUsernameExistsError: false,
        createAccountUsernameLengthError: true,
        createAccountPasswordLengthError: false,
        createAccountSubmitError: false
      })
    } else if (password.length < 8) {
      this.setState({
        createAccountUsernameExistsError: false,
        createAccountUsernameLengthError: false,
        createAccountPasswordLengthError: true,
        createAccountSubmitError: false
      })
    } else {
      this.setState({loading: true})

      const self = this

      createNewUser(username, password, function(response) {
        if (response.usernameLengthError) {
          self.setState({
            loading: false,
            createAccountUsernameExistsError: false,
            createAccountUsernameLengthError: true,
            createAccountPasswordLengthError: false,
            createAccountSubmitError: false
          })
        } else if (response.passwordLengthError) {
          self.setState({
            loading: false,
            createAccountUsernameExistsError: false,
            createAccountUsernameLengthError: false,
            createAccountPasswordLengthError: true,
            createAccountSubmitError: false
          })
        } else if (response.alreadyExistsError) {
          self.setState({
            loading: false,
            createAccountUsernameExistsError: true,
            createAccountUsernameLengthError: false,
            createAccountPasswordLengthError: false,
            createAccountSubmitError: false
          })
        } else if (response.submitError || !response.success) {
          self.setState({
            loading: false,
            createAccountUsernameExistsError: false,
            createAccountUsernameLengthError: false,
            createAccountPasswordLengthError: false,
            createAccountSubmitError: true
          })
        } else {
          window.location.href = `/${self.props.goto}`
        }
      })
    }
  }

  render() {
    return (
      <div className="login-wrapper">
        <HeadMetadata
          title="Login | Hacker News"
        />
        <GoogleAnalytics />
        {
          this.state.loginCredentialError ?
          <div className="login-error-msg">
            <span>Bad login.</span>
          </div> : null
        }
        {
          this.state.loginSubmitError ?
          <div className="login-error-msg">
            <span>An error occurred.</span>
          </div> : null
        }
        {
          this.state.bannedError ?
          <div className="login-error-msg">
            <span>User is banned.</span>
          </div> : null
        }
        <div className="login-header">
          <span>Login</span>
        </div>
        <div className="login-input-item">
          <div className="login-input-item-label">
            <span>username:</span>
          </div>
          <div className="login-input-item-input">
            <input
              type="text"
              value={this.state.loginUsernameInputValue}
              onChange={this.updateLoginUsernameInputValue}
            />
          </div>
        </div>
        <div className="login-input-item">
          <div className="login-input-item-label">
            <span>password:</span>
          </div>
          <div className="login-input-item-input">
            <input
              type="password"
              value={this.state.loginPasswordInputValue}
              onChange={this.updateLoginPasswordInputValue}
            />
          </div>
        </div>
        <div className="login-submit-btn">
          <input
            type="submit"
            value="login"
            onClick={() => this.submitLogin()}
          />
        </div>
        <div className="login-input-item-forgot-text">
          <span>
            <a href="/forgot">Forgot your Password?</a>
          </span>
        </div>
        {
          this.state.createAccountUsernameExistsError ?
          <div className="login-error-msg">
            <span>That username is taken.</span>
          </div> : null
        }
        {
          this.state.createAccountUsernameLengthError ?
          <div className="login-error-msg">
            <span>Username must be between 2 and 15 characters long.</span>
          </div> : null
        }
        {
          this.state.createAccountPasswordLengthError ?
          <div className="login-error-msg">
            <span>Passwords should be at least 8 characters.</span>
          </div> : null
        }
        {
          this.state.createAccountSubmitError ?
          <div className="login-error-msg">
            <span>An error occurred.</span>
          </div> : null
        }
        <div className="login-header">
          <span>Create Account</span>
        </div>
        <div className="login-input-item">
          <div className="login-input-item-label">
            <span>username:</span>
          </div>
          <div className="login-input-item-input">
            <input
              type="text"
              value={this.state.createAccountUsernameInputValue}
              onChange={this.updateCreateAccountUsernameInputValue}
            />
          </div>
        </div>
        <div className="login-input-item">
          <div className="login-input-item-label">
            <span>password:</span>
          </div>
          <div className="login-input-item-input">
            <input
              type="password"
              value={this.state.createAcountPasswordInputValue}
              onChange={this.updateCreateAccountPasswordInputValue}
            />
          </div>
        </div>
        <div className="login-submit-btn">
          <input
            type="submit"
            value="create account"
            onClick={() => this.submitCreateAccount()}
          />
        </div>
      </div>
    )
  }
}
