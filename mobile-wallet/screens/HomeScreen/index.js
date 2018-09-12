import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import HomePresenter from "./HomePresenter";

function mapStateToProps(state) {
  const { privateKey, publicKey, 
    balance, scannerMode, 
    loginUser, loginStatus,
    config } = state;
  return {
    privateKey, 
    publicKey, 
    balance,
    scannerMode,
    loginUser,
    loginStatus,
    config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setBalance: bindActionCreators(socActions.setBalance, dispatch),
    setLoginUser: bindActionCreators(socActions.setLoginUser, dispatch),
    setScannerMode: bindActionCreators(socActions.setScannerMode, dispatch),
    setPrivateKey: bindActionCreators(socActions.setPrivateKey, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePresenter);
