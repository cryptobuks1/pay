import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import FindPresenter from "./FindPresenter";

function mapStateToProps(state) {
  const { bFindPWMode, config } = state;
  return {
    bFindPWMode,
    config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setFindPWMode: bindActionCreators(socActions.setFindPWMode, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPresenter);
