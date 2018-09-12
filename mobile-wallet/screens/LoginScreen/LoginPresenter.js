import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  BackHandler,
  AsyncStorage  
} from "react-native";
import { AppLoading, WebBrowser } from "expo";
import axios from 'axios';

const { height, width } = Dimensions.get("window");
//const remote = 'https://url/theme/maingnd.jpg';

export default class LoginPresenter extends React.Component {
    state = {
      email: "",
      pw: "",
      errorMsg: " "
    };
    
    componentDidMount = () => {
      const {setConfig} = this.props;

      const config = process.env.CONFIG;
      setConfig(config);

      if(Platform.OS === 'android') {
        const ver = Number(config.androidWallet);
        if(config.appAndroidVersion < ver) {
          Alert.alert(
            '알림',
            '최신 버전으로 업데이트 하세요.',
            [
              {
                text: '이동', 
                onPress: async () => {
                  await WebBrowser.openBrowserAsync('https://play.google.com/store/apps/details?id=com.gentrion.mwallet');
                  BackHandler.exitApp();
              }},
            ],
            { cancelable: false }
          );
          return;
        }
      }

      if( config.exit && config.exit.length > 0 ) {
        Alert.alert(
          '공 지',
          config.exit,
          [
            {text: '종료', onPress: () => BackHandler.exitApp()},
          ],
          { cancelable: false }
        );
      } else if(config.notice && config.notice.length > 0) {
        Alert.alert(
          '공 지',
          config.notice,
          [
            {text: '확인', onPress: () => this._loadLoginInfo()},
          ],
          { cancelable: false }
        );
      } else {
        this._loadLoginInfo()
      }
    };

    render() {
      const { email, pw, errorMsg } = this.state;
      const {autoLogin} = this.props;

      if (autoLogin) {
        return <AppLoading />;
      }
      const ccEmail = email.trim();
      const ccPw = pw.trim();
      const bActive = (email && pw) && (ccEmail.length>5 && ccPw.length>7) ? true : false;

      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.getStartedContainer}>
            <Text style={styles.developmentModeText}>암호화폐 결제 솔루션</Text>
            <Text style={styles.getStartedText}>젠트리온 페이</Text>
            <Text style={styles.getStartedText}>모바일 지갑</Text>
          </View>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              keyboardType={"email-address"}
              placeholder={"아이디(이메일)"}
              value={ccEmail}
              onChangeText={this._inEmail}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder={"비밀번호"}
              value={ccPw}
              onChangeText={this._inPassword}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            />
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            {
                bActive ? (
                    <TouchableOpacity onPress={this._reqLogin} style={styles.loginButton}>
                    <Text style={styles.buttonText}>로 그 인</Text>
                  </TouchableOpacity>            
                ) : (
                    <TouchableOpacity onPress={this._reqEmpty} style={styles.unButton}>
                    <Text style={styles.buttonText}>로 그 인</Text>
                  </TouchableOpacity>            
                )
            }
            <TouchableOpacity onPress={this._changeFindPW} style={styles.findpw}>
              <Text style={styles.signupText}>비밀번호 찾기</Text>
            </TouchableOpacity>            
            <TouchableOpacity onPress={this._changeSignup} style={styles.signup}>
              <Text style={styles.signupText}>회원가입</Text>
            </TouchableOpacity>            
            <Text style={styles.signupInfoText}>암호화폐를 실생활에서 사용하여 보세요.</Text>
          </View>
        </View>
      );
    }
    // 저장된 로그인 정보 load
    _loadLoginInfo = async () => {
      const {setAutoLogin} = this.props;

      try {
        const email = await AsyncStorage.getItem("email");
        const pw = await AsyncStorage.getItem("pw");
        if( email && pw ) {
          this.setState({ email, pw });
          const bReturn = await this._login();
          setAutoLogin(false);
          return;
        }
      } catch (err) {
        console.log("_loadLoginInfo : "+err);
      }
      this.setState({
        email: "", 
        pw: ""
      });
      setAutoLogin(false);
    };

  isEmail = (str) => {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return reg_email.test(str);
  }; 
    // 로그인
  _login = async () => {
    const {email, pw} = this.state;
    const {config} = this.props;

    if(!this.isEmail(email)) {
      this.setState({ errorMsg: '이메일 형식 오류' });
      return false;
    }
    //console.log('config.walletNode : ' + config.walletNode);
    try {
      const response = await axios.post(
        `${config.walletNode}/login`,
        { email, pw },
        { headers: { "Content-Type": "application/json" } }
      );
      if( response && response.data && response.status === 200 ) { // response && response.data &&
        this.props.setLoginUser({user: response.data.account, msg: "login"});
        this.props.setBalance(response.data.account.amounts);
        this.props.setPrivateKey(response.data.key);
        this.props.setPublicKey(response.data.account.address);
        this.props.setLoginStatus(true);
        return true;
      }
    } catch (e) {
      if(e.response) {
        this.setState({ errorMsg: e.response.data ? 
          (e.response.data.error ? e.response.data.error : e.response.data) : 
          'error :' + e.response.status 
        });
      } else {
        this.setState({ errorMsg: '로그인 실패' });
      }
    }    
    return false;
  };
  
  _saveLoginInfo = async () => {
    const { email, pw } = this.state;
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("pw", pw);
  };

  _inEmail = text => {
    this.setState({
      email: text
    });
  };
  _inPassword = text => {
    this.setState({
      pw: text
    });
  };

  _reqLogin = async () => {
    const { email, pw } = this.state;
    if( !email || !pw) return;
    const bReturn = await this._login();
    if(bReturn) {
      this._saveLoginInfo();
    }
  };
  _reqEmpty = () => {
  };
  _changeSignup = () => {
    const {setSignupMode} = this.props;
    this.setState({ email: "", pw: "" });
    setSignupMode(true);
  };
  _changeFindPW = () => {
    const {setFindPWMode} = this.props;
    this.setState({ email: "", pw: "" });
    setFindPWMode(true);
  };
 }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#26b2ff",
      alignItems: "center",
      justifyContent: 'center'
    },
    vbgnd: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      height: height,
    },    
    imgSt: {
      flex: 1,
      width: width,
      height: height,
      justifyContent: 'center'
    },    
    getStartedContainer: {
      alignItems: 'center',
      marginTop: 70,
      marginBottom: 60
    },
    developmentModeText: {
      marginBottom: 0,
      color: "#fff",
      fontSize: 12,
      textAlign: 'center',
    },
    getStartedText: {
      fontSize: 20,
      color: "#fff",
      textAlign: 'center',
    },
    title: {
      color: "#fff",
      fontSize: 30,
      marginTop: 70,
      fontWeight: "200",
      marginBottom: 60
    },
    card: {
      backgroundColor: "#f0f0f0",
      flex: 1,
      width: width - 25,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      ...Platform.select({
        ios: {
          shadowColor: "rgb(50, 50, 50)",
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowOffset: {
            height: -1,
            width: 0
          }
        },
        android: {
          elevation: 3
        }
      })
    },
    input: {
      padding: 20,
      borderBottomColor: "#bbb",
      borderBottomWidth: 1,
      fontSize: 20
    },
    errorMsg: {
      fontSize: 16,
      color: '#D35',
      marginBottom: 20,
      alignItems: "center"
    },    
    loginButton: {
      paddingVertical: 15,
      backgroundColor: "#48F",
      alignItems: "center"
    },
    unButton: {
      paddingVertical: 15,
      backgroundColor: "#888",
      alignItems: "center"
    },
    buttonText: {
      fontSize: 20,
      color: '#fff',
    },    
    findpw: {
      paddingTop: 20,
      alignItems: "center"
    },
    signup: {
      paddingTop: 40,
      alignItems: "center"
    },
    signupInfoText: {
      marginBottom: 0,
      color: "#aaa",
      fontSize: 14,
      textAlign: 'center',
    },
    signupText: {
      fontSize: 16,
      color: '#235',
      textDecorationLine: "underline"
    }
  });
  