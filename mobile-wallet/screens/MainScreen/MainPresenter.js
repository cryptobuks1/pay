import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from '../../navigation/AppNavigator';

import LoginScreen from '../LoginScreen';
import SignupScreen from '../SignupScreen';
import FindScreen from '../FindScreen';

export default class MainPresenter extends React.Component {

  componentDidMount = () => {
    // console.log("store 11 : "+store.getState());
  };
  
  render() {
    const {loginUser, bSignupMode, bFindPWMode} = this.props;

    // console.log("loginUser : "+loginUser);
    if(bSignupMode) {
      return (
        <SignupScreen />
      );
    }

    if(bFindPWMode) {
      return <FindScreen />;
    }

    if(loginUser === null) {
      return (
        <LoginScreen />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
