import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import SettingsPresenter from "./SettingsPresenter";

function mapStateToProps(state) {
  const { privateKey, publicKey, balance, loginUser, config } = state;
  return {
    privateKey,
    publicKey,
    balance,
    loginUser,
    config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLoginUser: bindActionCreators(socActions.setLoginUser, dispatch),
    setScannerMode: bindActionCreators(socActions.setScannerMode, dispatch),
    setPublicKey: bindActionCreators(socActions.setPublicKey, dispatch),
    setPrivateKey: bindActionCreators(socActions.setPrivateKey, dispatch),
    setLoginStatus: bindActionCreators(socActions.setLoginStatus, dispatch),
    setLogout: bindActionCreators(socActions.setLogout, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPresenter);
