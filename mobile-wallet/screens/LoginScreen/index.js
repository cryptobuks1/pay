import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import LoginPresenter from "./LoginPresenter";

function mapStateToProps(state) {
  const { refreshCount, loginUser, autoLogin, config } = state;
  return {
    refreshCount,
    loginUser,
    autoLogin,
    config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshCount: bindActionCreators(socActions.refreshCount, dispatch),
    setSignupMode: bindActionCreators(socActions.setSignupMode, dispatch),
    setFindPWMode: bindActionCreators(socActions.setFindPWMode, dispatch),
    setLoginUser: bindActionCreators(socActions.setLoginUser, dispatch),
    setConfig: bindActionCreators(socActions.setConfig, dispatch),
    setBalance: bindActionCreators(socActions.setBalance, dispatch),
    setPublicKey: bindActionCreators(socActions.setPublicKey, dispatch),
    setAutoLogin: bindActionCreators(socActions.setAutoLogin, dispatch),
    setPrivateKey: bindActionCreators(socActions.setPrivateKey, dispatch),
    setLoginStatus: bindActionCreators(socActions.setLoginStatus, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPresenter);
