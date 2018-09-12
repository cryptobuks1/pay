import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Clipboard,
  LayoutAnimation,
  Alert,
  View,
  Image,
  Picker
} from 'react-native';
import { BarCodeScanner, Permissions, LinearGradient, Icon } from 'expo';
import axios from 'axios';

export default class HomePresenter extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    sym: "GENT",
    sendEmail: "",
    sendAddress: "",
    sendAmount: "",
    sendMemo: " ",
    errorMsg: " ",
    hasCameraPermission: null,
    lastScannedUrl: null,
    didBlurSubscription: null
  };

  componentWillMount() {
    this._requestCameraPermission();
  }

  componentDidMount = () => {
    if( this.props.loginStatus ){
      this._refreshBalance();
    }
    this._loopCheck();
  };

  componentWillReceiveProps(nextProps) {
    const currentProps = this.props;
    if (!currentProps.loginStatus && nextProps.loginStatus) {
      setTimeout(() => {
        this._refreshBalance();
      }, 1000);
    }
  }

  componentWillUnmount = async () => {
    const {didBlurSubscription} = this.state;
    if(didBlurSubscription){
      await didBlurSubscription.remove();
    }
  };

  _loopCheck = () => {
    this.setState({
      didBlurSubscription: this.props.navigation.addListener(
        'didBlur',
        payload => {
          const {setScannerMode} = this.props;
          setScannerMode(false);
        }
       )
    });
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };
  //      
  _handleBarCodeRead = async (result) => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();

      const reqID = result.data;
      const {setScannerMode, config} = this.props;
      setScannerMode(false);

      try {
        const response = await axios.post(
          `${config.walletNode}/qr-find`, //URL_QR_info,
          { _id: reqID },
          { headers: { "Content-Type": "application/json" } }
        );

        if( response && response.data && response.status < 400 ) {
            const {email, address, sym, amount, memo} = response.data;
            // if( email && address && sym && amount && memo ) {
              const { balance } = this.props;
              const finx = balance.findIndex(item => item.sym === sym);
              this.setState({
                sendEmail: email,
                sendAddress: address,
                sym: (finx < 0 ? "GENT" : sym),
                sendAmount: amount.toString(),
                sendMemo: memo
              });
              return;
            //}
        }
      } catch (e) {
        console.log("_handleBarCodeRead error : "+e);
      }
      Alert.alert('오류','QR 코드 정보가 잘못되었습니다.');
    }
  };

  _refreshBalance = async () => {
    const {loginUser, loginStatus, config} = this.props;
    if( loginUser === null || !loginStatus ){
      return;
    }

    try {
      const response = await axios.post(
        `${config.walletNode}/balance`, //URL_UserBalance,
        { address: loginUser.address },
        { headers: { "Content-Type": "application/json" } }
      );
      //const response = await axios.get(URL_UserBalance + privateKey);
      if( response && response.data && response.status === 200 ){
          const { setBalance } = this.props;
          const {balance} = response.data;
          // console.log("balance : " + balance);
          if( balance != null && balance != undefined ){
            setBalance(balance);
          }
          // this.setState({ errorMsg: " " });
      }
      if(this.props.loginUser == null) return;
      if(!this.props.loginStatus) return;
    } catch (e) {
        console.log("_refreshBalance error : "+e);
    }    
    setTimeout(this._refreshBalance, 1000);
  };

  render() {
    const {sendEmail, sendAddress, sym, sendAmount, sendMemo, errorMsg, hasCameraPermission} = this.state;
    const {publicKey, balance, scannerMode, loginUser} = this.props;

    if( loginUser === null ) {
      return <View />;
    }

    const sendCurAddress = sendAddress.length > 0 ? sendAddress : sendEmail;

    const bSend = (sendAddress.length > 5) && (sendAmount.length>0) ? true : false;
    const bScanner = (hasCameraPermission && hasCameraPermission === true) ? true : false;
    const nickName = loginUser ? loginUser.nick : '***';

    const tokens = balance.length === 0 ? [{sym: 'GENT', amount: 0}] : balance;
    const listAmounts = tokens.map(token => {
      return <Picker.Item key={token.sym} label={token.amount + ' ' + token.sym} value={token.sym} />;
    });
    
    if(scannerMode) {
      return (
        <View style={styles.scannerContainer}>
        <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />
      </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <Text style={styles.developmentModeText}>실생활에 사용되는 암호화폐</Text>
            <Text style={styles.getStartedText}>젠트리온 페이</Text>
          </View>

          <LinearGradient
            colors={['#228cd9', '#2266cc', '#1144aa']}
            style={styles.infoContainer}>
            <View style={styles.infoRowItems}>
              <Text style={styles.infoTitle}>Gentrion PAY</Text>
              <Image
                source={require("../../assets/images/mark-card.png")}
                style={styles.infoCardImg}
                resizeMode={"contain"}
              />
            </View>
            <Text 
              selectable={true} 
              onPress={this.setClipboardEmail}
              style={styles.infoText}>{'이메일: '+loginUser.email}</Text>
            <Text 
              selectable={true} 
              onPress={this.setClipboardPublickey}
              style={styles.infoText}>{'지갑주소: '+publicKey}</Text>
            <View style={styles.infoRowItems}>
              <Text style={styles.infoNick}>{nickName}</Text>
              <Picker
                selectedValue={this.state.sym}
                onValueChange={sym => this.setState({ sym })}
                style={{ width: 200, color: '#FF8' }}
                itemStyle={{ backgroundColor: 'lightgrey' }}
                mode="dropdown">
                {listAmounts}
              </Picker>
            </View>
          </LinearGradient>

          <View style={styles.sendContainer}>
            <Text style={styles.inputMemo}>{' '}</Text>
            <View style={styles.infoRowItems}>
              <TextInput
                style={styles.input}
                placeholder={"이메일 또는 지갑주소"}
                value={sendCurAddress}
                onChangeText={this._inAddress}
                placeholderTextColor={"#235"}
                returnKeyType={"done"}
                tintColor={"rgba(180, 180, 180, 1)"}
                selectionColor={"rgba(180, 180, 180, 1)"}
                autoCorrect={false}
                underlineColorAndroid={"transparent"}
              />
              <View style={styles.inputScanImgArea}>
              {
                bScanner && (
                  <TouchableOpacity onPress={this._qrScanner}>
                    <Image
                      source={require("../../assets/images/btn-scan.png")}
                      style={styles.inputScanImg}
                      resizeMode={"contain"}
                    />
                  </TouchableOpacity>)
              }
              </View>
            </View>
            <View style={styles.infoRowItems}>
              <TextInput
                style={styles.input}
                keyboardType={"numeric"}
                placeholder={"금액"}
                value={sendAmount}
                onChangeText={this._inAmount}
                placeholderTextColor={"#235"}
                returnKeyType={"done"}
                tintColor={"rgba(180, 180, 180, 1)"}
                selectionColor={"rgba(180, 180, 180, 1)"}
                autoCorrect={false}
                underlineColorAndroid={"transparent"}
              />
              <Text style={styles.inputAmountInfo}>{sym}</Text>
            </View>
            <View style={styles.infoRowItems}>
              <TextInput
                style={styles.input}
                placeholder={"메모"}
                value={sendMemo.trim()}
                onChangeText={this._inMemo}
                placeholderTextColor={"#235"}
                returnKeyType={"done"}
                tintColor={"rgba(180, 180, 180, 1)"}
                selectionColor={"rgba(180, 180, 180, 1)"}
                autoCorrect={false}
                underlineColorAndroid={"transparent"}
              />
            </View>
            <View style={styles.buttonArea}>
            {
              bSend ? (
                <TouchableOpacity onPress={this._sendCoin}>
                  <Icon.Ionicons
                      name={'ios-arrow-dropright-circle'}
                      size={46}
                      style={styles.sendFullButton}
                      color={'#26b2ff'}
                    />
                  <Text style={styles.buttonText}>이체 / 결제</Text>
                </TouchableOpacity>            
              ) : (
                <TouchableOpacity onPress={this._emptyButton}>
                  <Icon.Ionicons
                    name={'ios-arrow-dropright'}
                    size={46}
                    style={styles.sendFullButton}
                    color={'#ccc'}
                  />
                  <Text style={styles.buttonText}>이체 / 결제</Text>
                </TouchableOpacity>            
              )  
            }
            </View>
          </View>
          <Text style={styles.errorMsg}>{errorMsg}</Text>
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
            <Text style={styles.tabBarInfoText}>2018(c). 젠틀마스 ver.2.4.3</Text>
        </View>
      </View>
    );
  }
  setClipboardPublickey = async () => {
    const {publicKey} = this.props;
    await Clipboard.setString(publicKey);
    Alert.alert('알림','지갑주소를 클립보드에 복사했습니다.');
  };
  setClipboardEmail = async () => {
    const {loginUser} = this.props;
    await Clipboard.setString(loginUser.email);
    Alert.alert('알림','이메일 주소를 클립보드에 복사했습니다.');
  };
  getTokenAmount = (sym) => {
    const {balance} = this.props;
    const tinx = balance.findIndex(item => item.sym === sym);
    if( tinx < 0) return 0;
    return balance[tinx].amount;
  }

  _inAddress = text => {
    this.setState({
        sendAddress: text
    });
  };
  _inAmount = text => {
    this.setState({
        sendAmount: text
    });
  };
  _inMemo = text => {
    this.setState({
        sendMemo: text
    });
  };

  _sendCoin = async () => {
    const {privateKey, publicKey, loginUser, config} = this.props;
    const {sendAddress, sym, sendAmount, sendMemo} = this.state;
    const iAmount = Number(sendAmount);
    if( publicKey === sendAddress ||
      iAmount <= 0 ||
      this.getTokenAmount(sym) < iAmount ||
      loginUser.email === sendAddress
    ) {
      Alert.alert('입력 오류','주소 또는 수량을 확인하세요.');
      return;
    }
    if(loginUser.status === 'block') {
      Alert.alert('알 림','본 계정은 거래가 차단되었습니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${config.walletNode}/create-transaction`, //URL_CoinSend,
        { 
          sender: publicKey, 
          recv: sendAddress, 
          sym, 
          amount: iAmount, 
          memo: sendMemo, 
          key: privateKey
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if( response && response.data && response.status === 200 ){
        this.setState({
          sendEmail: "",
          sendAddress: "",
          sendAmount: "",
          sendMemo: " ",
          errorMsg: " "
        });  
        Alert.alert('알림','정상적으로 거래(이체) 되었습니다.');
      }
    } catch (e) {
        console.log("_sendCoin error : "+e);
        Alert.alert('알림','보내기 실패. 입력 정보 확인하고 다시 시도 하세요.');
    }    
  };
  _emptyButton = () => {
    Alert.alert('입력 확인','주소 또는 수량을 확인하세요.');
  };

  _qrScanner = () => {
    console.log("_qrScanner...");
    const {setScannerMode} = this.props;
    setScannerMode(true);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  errorMsg: {
    fontSize: 14,
    color: '#D35',
    marginBottom: 5,
    alignItems: "center"
  },    
  buttonArea: {
    flex: 1,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendFullButton: {
    marginHorizontal: 40,
    paddingVertical: 2,
    alignItems: "center"
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    color: "#235",
  },    
  sendContainer: {
    marginTop: 1,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingTop: 1,
    paddingHorizontal: 10,
    paddingBottom: 2,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  inputMemo: {
    color: "#cc0066",
    fontSize: 14
  },
  input: {
    flex: 1,
    marginBottom: 15,
    color: "#235",
    borderBottomColor: "#235",
    borderBottomWidth: 1,
    fontSize: 16
  },
  inputScanImgArea: {
    marginBottom: 20
  },
  inputScanImg: {
    width: 30,
    height: 30
  },
  inputAmountInfo: {
    marginBottom: 20,
    color: "#235",
    fontSize: 14
  },
  infoContainer: {
    marginVertical: 8,
    marginHorizontal: 20,
    padding: 15,
    justifyContent: "center",
    borderRadius: 15
  },
  infoRowItems: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerBgColor: {
    color: "#fff"
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#fff",
    textAlign: 'left',
    paddingLeft: 3
  },
  infoCardImg: {
    width: 50,
    height: 35
  },
  infoText: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#ddd",
    textAlign: 'left',
  },
  infoNick: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
    textAlign: 'left',
    paddingLeft: 5
  },
  infoAmount: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
    paddingRight: 5
  },
  developmentModeText: {
    color: "#235",
    fontSize: 12,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 50,
  },
  getStartedContainer: {
    alignItems: 'center',
    margin: 10,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 20,
    color: "#235",
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  tabBarInfoText: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
});
