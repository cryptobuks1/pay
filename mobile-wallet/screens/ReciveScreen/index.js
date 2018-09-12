import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import RecivePresenter from "./RecivePresenter";

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
    setScannerMode: bindActionCreators(socActions.setScannerMode, dispatch),
    setPublicKey: bindActionCreators(socActions.setPublicKey, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecivePresenter);
