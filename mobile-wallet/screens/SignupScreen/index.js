import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as socActions } from "../../store/reducer";
import SignupPresenter from "./SignupPresenter";

function mapStateToProps(state) {
  const { bSignupMode, config } = state;
  return {
    bSignupMode,
    config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSignupMode: bindActionCreators(socActions.setSignupMode, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPresenter);
