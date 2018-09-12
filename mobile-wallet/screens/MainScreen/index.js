import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import MainPresenter from "./MainPresenter";

function mapStateToProps(state) {
  const { refreshCount, loginUser, bSignupMode, bFindPWMode } = state;
  return {
    refreshCount,
    loginUser,
    bSignupMode,
    bFindPWMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshCount: bindActionCreators(socActions.refreshCount, dispatch),
    setSignupMode: bindActionCreators(socActions.setSignupMode, dispatch),
    setFindPWMode: bindActionCreators(socActions.setFindPWMode, dispatch),
    setLoginUser: bindActionCreators(socActions.setLoginUser, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPresenter);
