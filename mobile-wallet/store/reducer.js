// Imports

// Actions

const REFRESH_COUNT = "REFRESH_COUNT";
const SET_LOGIN_USER = "SET_LOGIN_USER";
const SET_SIGNUP_MODE = "SET_SIGNUP_MODE";
const SET_PRIVATE_KEY = "SET_PRIVATE_KEY";
const SET_PUBLIC_KEY = "SET_PUBLIC_KEY";
const SET_BALANCE = "SET_BALANCE";
const SET_SEND_HISTORY = "SET_SEND_HISTORY";
const SET_RECV_HISTORY = "SET_RECV_HISTORY";
const SET_AUTO_LOGIN = "SET_AUTO_LOGIN";
const SET_SCANNER_MODE = "SET_SCANNER_MODE";
const SET_LOGIN_STATUS = "SET_LOGIN_STATUS";
const SET_LOGOUT = "SET_LOGOUT";
const SET_CONFIG = "SET_CONFIG";
const SET_FINDPW_MODE = "SET_FINDPW_MODE";

// Action Creators
function refreshCount() {
  return {
    type: REFRESH_COUNT
  };
}
  
function setLoginUser(data) {
  return {
    type: SET_LOGIN_USER,
    payload: data
  };
}
function setSignupMode(data) {
    return {
      type: SET_SIGNUP_MODE,
      payload: data
    };
  }
function setPrivateKey(data) {
  return {
    type: SET_PRIVATE_KEY,
    payload: data
  };
}
function setPublicKey(data) {
    return {
      type: SET_PUBLIC_KEY,
      payload: data
    };
  }
function setBalance(data) {
  return {
    type: SET_BALANCE,
    payload: data
  };
}
function setSendHistory(data) {
  return {
    type: SET_SEND_HISTORY,
    payload: data
  };
}
function setRecvHistory(data) {
  return {
    type: SET_RECV_HISTORY,
    payload: data
  };
}
function setAutoLogin(data) {
  return {
    type: SET_AUTO_LOGIN,
    payload: data
  };
}
function setScannerMode(data) {
  return {
    type: SET_SCANNER_MODE,
    payload: data
  };
}
function setLoginStatus(data) {
  return {
    type: SET_LOGIN_STATUS,
    payload: data
  };
}
function setLogout() {
  return {
    type: SET_LOGOUT
  };
}
function setConfig(data) {
  return {
    type: SET_CONFIG,
    payload: data
  };
}
function setFindPWMode(data) {
  return {
    type: SET_FINDPW_MODE,
    payload: data
  };
}

// Reducer
const initialState = {
  refreshCount: 0,
  loginUser: null,
  bSignupMode: false,
  privateKey: "",
  publicKey: "",
  balance: [],
  sends: [],
  recvs: [],
  scannerMode: false,
  autoLogin: true,
  loginStatus: false,
  config: null,
  bFindPWMode: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case REFRESH_COUNT:
      return applyRefreshCount(state, action);
    case SET_LOGIN_USER:
      return applySetLoginUser(state, action);
    case SET_SIGNUP_MODE:
      return applySetSignupMode(state, action);
    case SET_PRIVATE_KEY:
      return applySetPrivateKey(state, action);
    case SET_PUBLIC_KEY:
      return applySetPublicKey(state, action);
    case SET_BALANCE:
      return applySetBalance(state, action);
    case SET_SEND_HISTORY:
      return applySendHistory(state, action);
    case SET_RECV_HISTORY:
      return applyRecvHistory(state, action);
    case SET_AUTO_LOGIN:
      return applyAutoLogin(state, action);
    case SET_SCANNER_MODE:
      return applyScannerMode(state, action);
    case SET_LOGIN_STATUS:
      return applyLoginStatus(state, action);
    case SET_LOGOUT:
      return applySetLogout(state, action);
    case SET_CONFIG:
      return applySetConfig(state, action);
    case SET_FINDPW_MODE:
    return applySetFindPWMode(state, action);
    default:
      return state;
  }
}

// Reducer Functions
function applyRefreshCount(state, action) {
    const { refreshCount } = state;
    return {
      ...state,
      refreshCount: refreshCount + 1
    };
  }
  
function applySetLoginUser(state, action) {
  const {user} = action.payload;
  return {
    ...state,
    loginUser: user
  };
}
function applySetSignupMode(state, action) {
    return {
      ...state,
      bSignupMode: action.payload
    };
  }
function applySetPrivateKey(state, action) {
     return {
    ...state,
    privateKey: action.payload
  };
}
function applySetPublicKey(state, action) {
  return {
    ...state,
    publicKey: action.payload
  };
}
function applySetBalance(state, action) {
  return {
   ...state,
   balance: action.payload
  };
}
function applySendHistory(state, action) {
  return {
   ...state,
   sends: action.payload
  };
}
function applyRecvHistory(state, action) {
  return {
   ...state,
   recvs: action.payload
  };
}
function applyAutoLogin(state, action) {
  return {
   ...state,
   autoLogin: action.payload
  };
}
function applyLoginStatus(state, action) {
  return {
   ...state,
   loginStatus: action.payload
  };
}
function applyScannerMode(state, action) {
  return {
   ...state,
   scannerMode: action.payload
  };
}
function applySetLogout(state, action) {
  return {
    ...state,
    refreshCount: 0,
    bSignupMode: false,
    privateKey: "",
    publicKey: "",
    balance: [],
    sends: [],
    recvs: [],
    scannerMode: false,
    loginUser: null,
  };
}
function applySetConfig(state, action) {
  return {
    ...state,
    config: action.payload
  };
}
function applySetFindPWMode(state, action) {
  return {
    ...state,
    bFindPWMode: action.payload
  };
}


// Exports
const actionCreators = {
  refreshCount,
  setLoginUser,
  setSignupMode,
  setPrivateKey,
  setPublicKey,
  setBalance,
  setSendHistory,
  setRecvHistory,
  setAutoLogin,
  setScannerMode,
  setLoginStatus,
  setLogout,
  setConfig,
  setFindPWMode
};
export { actionCreators };

// Default
export default reducer;
