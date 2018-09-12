import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Linking,
  Image,
  Platform
} from "react-native";
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import SignupCompletedScreen from "../SignupCompletedScreen";

const { height, width } = Dimensions.get("window");
//const remote = 'https://url/theme/maingnd.jpg';

export default class SignupPresenter extends React.Component {
  state = {
    email: "",
    pw: "",
    reConfirm: "",
    nick: "",
    errorMsg: " ",
    showInfo: false
  };
    
  componentDidMount = () => {
    this._init();
  };
    _init = () => {
      this.setState({ 
        email: "", 
        pw: "",
        reConfirm: "",
        nick: "",
        errorMsg: "",
        showInfo: false,
        checked: false
      });
    };

    render() {
      const { email, pw, reConfirm, nick, errorMsg, showInfo, checked } = this.state;

      if(showInfo) {
          return (<SignupCompletedScreen />);
      }

      const bActive = (email && pw && nick) && 
        (email.length>5 && pw.length>7 && nick.length>2) &&
        (pw === reConfirm) &&
        checked ? true : false;

      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.title}>회원 가입</Text>
          <Text style={styles.infoText}>서비스 가입을 위한 정보를 입력하세요.</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              keyboardType={"email-address"}
              placeholder={"이메일"}
              value={email}
              onChangeText={this._inEmail}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder={"비밀번호(8자이상)"}
              value={pw}
              onChangeText={this._inPassword}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder={"비밀번호 재확인"}
              value={reConfirm}
              onChangeText={this._inConfirm}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            />
            <TextInput
              style={styles.input}
              placeholder={"닉네임(3자이상)"}
              value={nick}
              onChangeText={this._inNick}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            />
            <Text style={styles.errorMsg}>{errorMsg}</Text>

            <View style={styles.checkContainer}>
              <View style={styles.checkArea}>
                <View style={styles.checkPart1}>
                  <CheckBox
                    title=" "
                    onPress={this.pressCheck}
                    checked={checked}
                  />
                </View>
                <View style={styles.checkPart2}>
                  <Text style={styles.txtService} onPress={this._openService}>이용약관에 동의하고,</Text>
                  <Text style={styles.txtPrivate} onPress={this._openPrivate}>개인정보보호정책을 승인합니다.</Text>
                </View>
              </View>
            </View>

            {
                bActive ? (
                    <TouchableOpacity onPress={this._reqSignup} style={styles.loginButton}>
                    <Text style={styles.buttonText}>가 입</Text>
                  </TouchableOpacity>            
                ) : (
                    <TouchableOpacity onPress={this._reqEmpty} style={styles.unButton}>
                    <Text style={styles.buttonText}>가 입</Text>
                  </TouchableOpacity>            
                )
            }
            <TouchableOpacity onPress={this._changeLogin} style={styles.signup}>
              <Text style={styles.signupText}>로그인</Text>
            </TouchableOpacity>            
          </View>
        </View>
      );
    }

  pressCheck = () => {
    const {checked} = this.state;
    this.setState({ checked: !checked });
  };
  _openService = () => {
    Linking.openURL('https://google.com');
  };
  _openPrivate = () => {
    Linking.openURL('https://google.com');
  };

  // 회원가입 요청
  _reqSignup = async () => {
    const {email, pw, nick} = this.state;
    const {config} = this.props;

    try {
        const response = await axios.post(
          `${config.walletNode}/signup`, //  URL_UserSignup, 
            { email, pw, nick, level: "user" },
            { headers: { "Content-Type": "application/json" } }
          );
        if( response && response.data && response.status === 200 ){
            // 
            this.setState({ errorMsg: " ", showInfo: true });
            setTimeout( () => {
              const {setSignupMode} = this.props;
              this.setState({ showInfo: false });
              setSignupMode(false);
            }, 2000);
            // return true;
        }
      } catch (e) {
        if(e.response) {
          // console.log('e.response : ' + JSON.stringify(e.response));
          this.setState({ errorMsg: e.response.data ? 
            (e.response.data.error ? e.response.data.error : e.response.data) : 
            'error :' + e.response.status 
          });
        } else {
          console.log('e.response : ' + e.message);
          this.setState({ errorMsg: '회원 가입 실패' });
        }
      }    
      // return false;
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
    _inConfirm = text => {
      this.setState({
        reConfirm: text
      });
    };
    _inNick = text => {
      this.setState({
        nick: text
      });
    };
    
    _reqEmpty = () => {
    };
    _changeLogin = () => {
      const {setSignupMode} = this.props;
      setSignupMode(false);
    }
 }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#26b2ff",
      alignItems: "center"
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
    title: {
      color: "#fff",
      fontSize: 30,
      marginTop: 70,
      fontWeight: "200",
      marginBottom: 30
    },
    checkContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      justifyContent: "center",
    },
    checkArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 5,
      marginBottom: 20,
    },
    checkPart1: {
      width: "20%",
      backgroundColor: "#fff",
    },
    checkPart2: {
      flex: 1,
      width: "80%",
    },
  
    txtService: {
      color: "#48F",
      fontSize: 16,
      textDecorationLine: "underline"
    },
    txtPrivate: {
      color: "#48F",
      fontSize: 16,
      textDecorationLine: "underline"
    },
    infoText: {
      padding: 5,
      color: "#fff",
      fontSize: 14,
      textAlign: 'center',
    },
    card: {
      backgroundColor: "#fff",
      flex: 1,
      width: width - 25,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 10,
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
      paddingTop: 20,
      paddingHorizontal: 16,
      borderBottomColor: "#bbb",
      borderBottomWidth: 1,
      fontSize: 20
    },
    errorMsg: {
      fontSize: 16,
      color: '#D35',
      padding: 10,
      alignItems: "center"
    },    
    loginButton: {
      marginTop: 10,
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
    signup: {
      paddingTop: 40,
      alignItems: "center"
    },
    signupText: {
      fontSize: 16,
      color: '#235',
      textDecorationLine: "underline"
    }
  });
  