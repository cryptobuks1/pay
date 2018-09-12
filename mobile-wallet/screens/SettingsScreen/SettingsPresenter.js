import React from 'react';
import { View, StyleSheet, Text, Alert,
    TextInput,
    ScrollView,
    TouchableOpacity, AsyncStorage, Clipboard } from "react-native";
// import PKeyItem from "./PKeyItem";
import axios from 'axios';
//import {encryptKey} from "../../components/CryptoKey";
//const EC = require("elliptic").ec;
//const ec = new EC("secp256k1");

// const URL_UserPatch = "http://clanapi.softchips.info/production-volume";
// const URL_CoinCharge = "http://full.gentrion.net/ac-create";
// const URL_FullBalance = "http://full.gentrion.net/me/balance";
// const AdminEmail = 'ceo@gentrion.net';

export default class SettingsPresenter extends React.Component {
  static navigationOptions = {
    title: '설정',
  };
  state = {
    inputSym: "",
    inputAmount: "",
    volume_sym: "GENT",
    curPW: "",
    newPW: "",
    volume: 0
  };

  componentDidMount = () => {
    this.refreshFullBalance();
  };

  render() {
    const {loginUser} = this.props;
    const {inputSym, inputAmount, volume, curPW, newPW} = this.state;

    if( loginUser === null){
      return <View />;
    }
    
    const bHasMyToken = loginUser.cToken.length > 0 ? true : false;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>토큰 관리</Text>
        </View>
        <View style={styles.inputContainer}>
        {
          bHasMyToken && 
            <View style={styles.inputArea}>
              <Text style={styles.infoTitle}>나의 토큰</Text>
              <Text style={styles.infoData}>{loginUser.cToken[0]}</Text>
            </View>
        }
        {
          !bHasMyToken && 
            <View style={styles.inputArea2}>
              <Text style={styles.infoTitle}>나의 토큰</Text>
              <TextInput
                  style={styles.input}
                  placeholder={"기호 입력   ..예) ABC"}
                  value={inputSym}
                  onChangeText={this._inputToken}
                  placeholderTextColor={"#48F"}
                  returnKeyType={"done"}
                  tintColor={"rgba(180, 180, 180, 1)"}
                  selectionColor={"rgba(180, 180, 180, 1)"}
                  autoCorrect={false}
                  underlineColorAndroid={"transparent"}
              /> 
            </View>
        }
        {
          !bHasMyToken && <Text style={styles.noticeText}>영문 대/소문자 조합,(2~5자)로 입력하세요.</Text>
        }
          <View style={styles.inputArea}>
            <Text style={styles.infoTitle}>총 발행량</Text>
            <Text style={styles.infoData}>{volume}</Text>
          </View>
          <View style={styles.inputArea}>
            <Text style={styles.infoTitle}>수 량</Text>
            <TextInput
              style={styles.input}
              keyboardType={"numeric"}
              placeholder={"0"}
              value={inputAmount}
              onChangeText={this._inputAmount}
              placeholderTextColor={"#48F"}
              returnKeyType={"done"}
              tintColor={"rgba(180, 180, 180, 1)"}
              selectionColor={"rgba(180, 180, 180, 1)"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            /> 
          </View>
        </View>
        <TouchableOpacity onPress={this._createToken} style={styles.tokenButton}>
        {
          bHasMyToken && <Text style={styles.inputAddText}>추가 발행</Text>
        }
        {
          !bHasMyToken && <Text style={styles.inputAddText}>토큰 생성</Text>
        }
        </TouchableOpacity>

        <View style={styles.inputArea}>
          <Text style={styles.tableLine}>{' '}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>PASSWORD 관리</Text>
          <View style={styles.inputArea}>
            <Text style={styles.infoTitleSmall}>현재 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder={""}
              value={curPW}
              onChangeText={this._inputCurPW}
              placeholderTextColor={"#48F"}
              returnKeyType={"done"}
              tintColor={"rgba(180, 180, 180, 1)"}
              selectionColor={"rgba(180, 180, 180, 1)"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            /> 
          </View>
          <View style={styles.inputArea}>
            <Text style={styles.infoTitleSmall}>새로운 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder={""}
              value={newPW}
              onChangeText={this._inputNewPW}
              placeholderTextColor={"#48F"}
              returnKeyType={"done"}
              tintColor={"rgba(180, 180, 180, 1)"}
              selectionColor={"rgba(180, 180, 180, 1)"}
              autoCorrect={false}
              underlineColorAndroid={"transparent"}
            /> 
          </View>
        </View>
        <TouchableOpacity onPress={this._changePW} style={styles.tokenButton}>
          <Text style={styles.inputAddText}>비밀번호 변경</Text>
        </TouchableOpacity>           
        <View style={styles.inputArea}>
          <Text style={styles.tableLine}>{' '}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>기 타</Text>
        </View>
        <TouchableOpacity onPress={this._reqLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>            
        <View style={styles.inputArea}>
          <Text style={styles.tableLine}>{' '}</Text>
        </View>
      </ScrollView>
    );
  }
  
  refreshFullBalance = async () => {
    const {loginUser, config} = this.props;
    if(loginUser === null) return;

    // 계정이 생성한 토큰이 있으면 설정한다. 없으면 리턴
    const tokenSym = loginUser.cToken.length > 0 ? loginUser.cToken[0] : null;
    if(tokenSym === null) return;

    try {
      const response = await axios.get(`${config.walletNode}/production-volume/${tokenSym}`);
      if( response && response.data && response.status === 200 ){
        const {sym, amount} = response.data;
        if( sym != undefined && amount != undefined ){
          this.setState({ 
            volume_sym: sym,
            volume: amount
          });
        }
      }
      if(this.props.loginUser == null) return;
    } catch (e) {
        console.log("refreshFullBalance error : "+e);
    }    
    //setTimeout(this.refreshFullBalance, 3000);
  };

  _inputToken = text => {
    this.setState({
      inputSym: text
    });
  };
  _inputAmount = text => {
    this.setState({
        inputAmount: text
    });
  };
  _inputCurPW = text => {
    this.setState({
      curPW: text
    });
  };
  _inputNewPW = text => {
    this.setState({
      newPW: text
    });
  };
  _changePW = async () => {
    const {loginUser, config} = this.props;
    const {curPW, newPW} = this.state;
    if( curPW.length < 1) {
      Alert.alert('입력 오류','현재 비밀번호를 입력하세요.');
      return;
    }
    if( newPW.length < 8) {
      Alert.alert('입력 오류','최소 8자 이상으로 설정하세요.');
      return;
    }
    try {
      const response = await axios.post(
        `${config.walletNode}/chgpw`,
        { 
          email: loginUser.email, 
          curPW,
          newPW
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if( response && response.data && response.status === 200 ){
        Alert.alert('알림','비밀번호가 변경되었습니다. 재 로그인하세요.');
        this._reqLogout();
      }
    } catch (e) {
      Alert.alert('알림','비밀번호 변경 실패. 입력 자료를 확인하세요.');
    }    

  };

  _emptyButton = () => {console.log("empty");};

  _createToken = async () => {
    const {loginUser, privateKey, config} = this.props;
    if(loginUser === null) return;
    const {inputSym, inputAmount} = this.state;
    const amount = Number(inputAmount);
    const sym = inputSym.trim().length === 0 ? 
      (loginUser.cToken.length === 0 ? '' : loginUser.cToken[0]) : 
      inputSym.trim();
    if(sym.length < 2 || sym.length > 5 || amount < 1) {
      Alert.alert('입력 오류','기호 또는 수량을 확인하세요.');
      return;
    }
    if(/[^a-zA-Z]/.test(sym)){
      Alert.alert('입력 오류','기호 입력을 확인하세요.');
      return;
    }
    try {
      const response = await axios.post(
        `${config.walletNode}/create-token`,
        { 
          email: loginUser.email, 
          sym,
          amount,
          memo: 'production Token',
          key: privateKey
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if( response && response.data && response.status === 200 ){
        loginUser.cToken = [sym];

        setTimeout(this.refreshFullBalance, 1000);
        setTimeout(this.refreshFullBalance, 2000);
        setTimeout(this.refreshFullBalance, 3000);
        Alert.alert('알림','토큰이 정상적으로 생성 되었습니다.');
      }
    } catch (e) {
        console.log("_createToken error : "+e);
        Alert.alert('알림','토큰 생성 요청 실패. 입력 정보 확인하고 다시 시도 하세요.');
    }    
  };

  _reqLogout = async () => {
    this.props.setLoginStatus(false);
    await AsyncStorage.setItem("email", "");
    await AsyncStorage.setItem("pw", "");
    setTimeout(() => {
      const {setLogout} = this.props;
      console.log("_reqLogout...........2");
      setLogout();
    }, 1000);
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#fff'
  },
  inputContainer: {
    marginTop: 5,
    justifyContent: "center",
  },
  inputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 32,
    padding: 5,
    marginBottom: 3,
  },
  inputArea2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 32,
    padding: 5,
    marginBottom: 1,
  },
  infoTitle: {
    width: "35%",
    color: "#235",
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 16,
  },
  infoTitleSmall: {
    width: "35%",
    color: "#235",
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 12,
  },
  infoData: {
    flex: 1,
    width: "40%",
    color: "#235",
    borderBottomColor: "#235",
    borderBottomWidth: 1,
    fontSize: 16
  },

  input: {
    flex: 1,
    width: "40%",
    color: "#48F",
    borderBottomColor: "#48F",
    borderBottomWidth: 1,
    fontSize: 16
  },

  inputAddText: {
    color: "#FFF",
    fontSize: 16
  },
  tableScroll: {
    height: 150,
    backgroundColor: "#ddd"
  },  
  tableLine: {
    flex: 1,
    width: "90%",
    color: "#235",
    borderBottomColor: "#235",
    borderBottomWidth: 1,
    fontSize: 16
  },
  title: {
    marginTop: 10,
    color: "#006099",
    fontSize: 16,
    fontWeight: "200"
  },
  noticeText: {
    color: "#C53",
    fontSize: 12,
    marginLeft: 80,
    marginBottom: 10,
  },
  tokenButton: {
    marginHorizontal: 50,
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: "#48F",
    borderRadius: 5,
    alignItems: "center"
  },
  emptyButton: {
    width: "100%",
    padding: 10
  },
  logoutButton: {
    marginHorizontal: 50,
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: "#990000",
    borderRadius: 5,
    alignItems: "center"
  },
  buttonText: {
    fontSize: 14,
    color: "#fff"
  }
});
