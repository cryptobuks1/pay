import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import LinksPresenter from "./LinksPresenter";

function mapStateToProps(state) {
  const { publicKey, sends, recvs, scannerMode, loginUser, 
    config, loginStatus } = state;
  return {
    publicKey,  
    sends, 
    recvs,
    scannerMode,
    loginUser,
    loginStatus,
    config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSendHistory: bindActionCreators(socActions.setSendHistory, dispatch),
    setScannerMode: bindActionCreators(socActions.setScannerMode, dispatch),
    setRecvHistory: bindActionCreators(socActions.setRecvHistory, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksPresenter);
