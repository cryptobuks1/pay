import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Platform
} from "react-native";
import axios from 'axios';

const { height, width } = Dimensions.get("window");
//const remote = 'https://url.io/theme/maingnd.jpg';

export default class FindPresenter extends React.Component {
  state = {
    email: ""
  };
    
  componentDidMount = () => {
  };

  render() {
      const { email, inEmail, onNewPW, changeLogin } = this.state;

      const bActive = this.isEmail(email);

      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.title}>비밀번호 찾기</Text>
          <Text style={styles.infoText}>서비스 가입시 이메일 정보를 입력하세요.</Text>
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
            <Text style={styles.errorMsg}>{' '}</Text>

            {
                bActive ? (
                    <TouchableOpacity onPress={this._reqNewPW} style={styles.loginButton}>
                    <Text style={styles.buttonText}>임시 비밀번호 발급</Text>
                  </TouchableOpacity>            
                ) : (
                    <TouchableOpacity onPress={this._reqEmpty} style={styles.unButton}>
                    <Text style={styles.buttonText}>임시 비밀번호 발급</Text>
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

  _inEmail = text => {
    this.setState({
      email: text
    });
  };
    
  _reqEmpty = () => {
  };
  _changeLogin = () => {
    const {setFindPWMode} = this.props;
    setFindPWMode(false);
  };

  isEmail = (str) => {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return reg_email.test(str);
  }; 

  _reqNewPW = async () => {
    const {email} = this.state;
    const {config} = this.props;

    if(!this.isEmail(email)) {
      Alert.alert('입력 오류','이메일 형식 오류');
      return;
    }

    try {
        const response = await axios.post(
          `${config.walletNode}/newpw`,
          { email, title: '젠트리온 임시 비밀번호 발급' },
          { headers: { "Content-Type": "application/json" } }
        );
        if( response && response.data && response.status === 200 ){
            Alert.alert('알림','이메일로 임시 비밀번호가 발급 되었습니다.');
            this._changeLogin();
        }
      } catch (e) {
        Alert.alert('오류','임시 비밀번호 발급 실패');
    }    
  };

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
  