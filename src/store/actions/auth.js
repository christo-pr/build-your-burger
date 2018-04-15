import * as authTypes from './actionsTypes';
import axios from 'axios';

export const authStart = (name) => {
  return {
    type: authTypes.AUTH_START
  }
}

export const authSuccess = (authData) => {
  return {
    type: authTypes.AUTH_SUCCESS,
    token: authData.idToken,
    userId: authData.localId
  }
}

export const authFail = (error) => {
  return {
    type: authTypes.AUTH_FAIL,
    error
  }
}

export const authLogout = () => {
  localStorage.clear();
  return {
    type: authTypes.AUTH_LOGOUT
  }
}

export const setAuthRedirectPath = (url) => {
  return {
    type: authTypes.SET_AUTH_REDIRECT_URL,
    url
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(authLogout())
    }, expirationTime * 1000);
  }
}

export const auth = (email, password, isSignIn) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true
    }
    let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDWl2hOkkS_s70fqMOKgD3-yaBcn99RPcM';
    if (isSignIn) {
      authUrl = ' https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDWl2hOkkS_s70fqMOKgD3-yaBcn99RPcM';
    }
    axios.post(authUrl, authData)
      .then( res => {
        console.log('res: ', res);
        const expDate = new Date(new Date().getTime() + res.data.expiresIn * 1000)
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('expirationDate', expDate);
        localStorage.setItem('userId', res.data.localId);
        dispatch(authSuccess(res.data));
        dispatch(checkAuthTimeout(res.data.expiresIn));
      })
      .catch( e => {
        console.log('e: ', e.response);
        const err = e.response.data.error
        dispatch(authFail(err));
      })
  }
}

export const checkAuthState = () => {
  return dispatch => {
    const data = {
      idToken: localStorage.getItem('token'),
      localId: localStorage.getItem('userId')
    }
    if (!data.idToken) {
      dispatch(authLogout())
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if(expirationDate > new Date()) {
        dispatch(dispatch(authSuccess(data)));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
}