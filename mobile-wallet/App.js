process.env.TZ = 'Asia/Seoul';
// set url of super-node
process.env.CONFIG = {
  walletNode: 'http://localhost:2019',
  androidWallet: 1000,
  notice: '',
  exit: ''
};

import React from 'react';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./store/reducer";

import MainScreen from './screens/MainScreen';
import axios from 'axios';

let store = createStore(reducer);
// console.log("store : "+ JSON.stringify(store.getState()));

const appAndroidVersion = 1000;
const appiOSVersion = 1000;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <MainScreen />
        </Provider>
      );
    }
  }
  _loadConfig = async () => {
    try {
      const response = await axios.get(`http://localhost:2019/sys-config`);
      if( response && response.data && response.status < 400 ) {
        process.env.CONFIG = response.data;
        process.env.CONFIG.appAndroidVersion = appAndroidVersion;
        process.env.CONFIG.appiOSVersion = appiOSVersion;
        return true;
      }
    } catch (e) {
      console.log('_loadConfig : ' + e);
    }    
  };

  _loadResourcesAsync = async () => {
    await this._loadConfig();

    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

