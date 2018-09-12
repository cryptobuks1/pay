import React from 'react';
import { View, StyleSheet, Text, Alert,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Clipboard,
    Picker } from "react-native";
import QRCode from 'react-native-qrcode';
import axios from 'axios';

// const URL_QR_register = "http://clanapi.softchips.info/api/clan/qr/register";

export default class RecivePresenter extends React.Component {
  static navigationOptions = {
    title: 'QR 코드',
  };

  state = {
    qrdata: null,
    sym: 'GENT',
    amount: "0",
    memo: ""
  };

  componentDidMount = () => {
    const {loginUser} = this.props;
    if( loginUser) {
      this.setState({
        memo: loginUser.nick
      });
    }
    this._refreshQRdata();
  };

  _refreshQRdata = async () => {
    const {publicKey} = this.props;
    const {sym, amount} = this.state;
    if( !publicKey) return;

    const szKey = publicKey + "_" + amount + '_'+sym;

    const qrID = await AsyncStorage.getItem(szKey);
    if( qrID && qrID.length > 10) {
      this.setState({
        qrdata: qrID
      });
      return;
    }

    this.createQRCode();
  };

  render() {
    const {qrdata, amount, memo} = this.state;
    const {publicKey, balance} = this.props;

    const tokens = balance.length === 0 ? [{sym: 'GENT', amount: 0}] : balance;
    const listSymbols = tokens.map(token => {
      return <Picker.Item key={token.sym} label={token.sym} value={token.sym} />;
    });
    // <Text style={styles.inputAmountCnc}>GENT</Text>

    return (
      <View style={styles.container}>
        <View style={styles.infoAddress}>
          <Text style={styles.title}>지갑주소</Text>
          <Text 
            selectable={true} 
            onPress={this.setClipboardContent}
            style={styles.addressText}
          >{publicKey}</Text>
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.title}>{" "}</Text>
          <View style={styles.inputArea}>
            <Text style={styles.pickerInfo}>토 큰</Text>
            <Picker
              selectedValue={this.state.sym}
              onValueChange={sym => this.setState({ sym })}
              style={styles.pickerAm}
              mode="dropdown">
              {listSymbols}
            </Picker>
          </View>
          <Text style={styles.title}>{" "}</Text>
          <View style={styles.inputArea}>
            <Text style={styles.inputAmountInfo}>금 액</Text>
            <TextInput
                  style={styles.inputAm}
                  keyboardType={"numeric"}
                  placeholder={"금액"}
                  value={amount}
                  onChangeText={this._inAmount}
                  placeholderTextColor={"#235"}
                  returnKeyType={"done"}
                  tintColor={"rgba(180, 180, 180, 1)"}
                  selectionColor={"rgba(180, 180, 180, 1)"}
                  autoCorrect={false}
                  underlineColorAndroid={"transparent"}
                />
          </View>
          <Text style={styles.title}>{" "}</Text>
          <View style={styles.inputArea}>
            <Text style={styles.inputAmountInfo}>내 용</Text>
            <TextInput
                  style={styles.inputAm}
                  placeholder={"내용"}
                  value={memo}
                  onChangeText={this._inputMemo}
                  placeholderTextColor={"#235"}
                  returnKeyType={"done"}
                  tintColor={"rgba(180, 180, 180, 1)"}
                  selectionColor={"rgba(180, 180, 180, 1)"}
                  autoCorrect={false}
                  underlineColorAndroid={"transparent"}
                />
            <Text style={styles.inputAmountCnc}>{" "}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={this.createQRCode} style={styles.buttonArea}>
          <Text style={styles.buttonText}>QR 코드 생성</Text>
        </TouchableOpacity>            
        {
          qrdata && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeTitle}>아래의 QR코드에 주소,금액 정보가 포함되어 있습니다.</Text>
              <QRCode
                value={qrdata}
                size={180}
                bgColor='black'
                fgColor='white'/>
            </View>
          )
        }
        {
          !qrdata && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeTitle}>위의 버튼을 클릭하여 QR 코드를 생성하세요.</Text>
            </View>
          )
        }
      </View>
    );
  }
  setClipboardContent = async () => {
    const {publicKey} = this.props;
    await Clipboard.setString(publicKey);
    Alert.alert('알림','주소를 클립보드에 복사했습니다.');
  };
  createQRCode = async () => {
    const {sym, amount, memo} = this.state;
    const {publicKey, config} = this.props;

    const szKey = publicKey + "_" + amount + '_'+sym;
    // const savedID = await AsyncStorage.getItem(szKey);
    // if(savedID && savedID.length > 10) {
    //   try {
    //     await axios.get(`${config.walletNode}/qr-remove/${savedID}`);
    //   } catch(e) {
    //   }
    //   await AsyncStorage.setItem(szKey, "");
    //   this.setState({
    //     qrdata: null
    //   });
    // }
    // email, address, sym, amount, memo
    try {
      const response = await axios.post(
        `${config.walletNode}/qr-register`, //URL_QR_register,
        { 
          email: '', 
          address: publicKey, 
          sym, 
          amount: Number(amount),
          memo 
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if( response && response.data && response.status === 200 ){
        if( response.data && response.data._id){
            const { _id } = response.data;
            await AsyncStorage.setItem(szKey, _id);
            this.setState({
              qrdata: _id
            });
        }
      }
    } catch(e) {
      console.log("createQRCode error : "+e);
    }
  };

  _inAmount = text => {
    this.setState({
        amount: text
    });
  };
  _inputMemo = text => {
    this.setState({
        memo: text
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  infoAddress: {
    marginTop: 10,
    padding: 15,
  },
  title: {
    color: "#006099",
    fontSize: 16,
    fontWeight: "200"
  },
  addressText: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#0099cc",
    color: "white",
    borderRadius: 5,
    fontSize: 12,
    textAlign: "center"
  },
  inputContainer: {
    justifyContent: "center",
    marginBottom: 12,
  },
  inputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputAmountInfo: {
    width: "35%",
    color: "#235",
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 16,
    height: 30,
    paddingTop: 10,
  },
  pickerInfo: {
    width: "35%",
    color: "#235",
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 16,
  },
  pickerAm: {
    width: "40%",
    height: 30,
    color: "#48F",
    borderBottomColor: "#235",
    borderBottomWidth: 1,
  },
  inputAm: {
    width: "40%",
    color: "#48F",
    borderBottomColor: "#235",
    borderBottomWidth: 1,
    fontSize: 16,
    height: 30,
    paddingTop: 10,
  },
  inputAmountCnc: {
    width: "30%",
    color: "#235",
    paddingLeft: 10,
    fontSize: 14
  },
  buttonArea: {
    marginHorizontal: 80,
    marginTop: 20,
    paddingVertical: 5,
    backgroundColor: "#48F",
    borderRadius: 5,
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    color: "#fff"
  },  
  codeContainer: {
    alignItems: 'center',
    justifyContent: "center",
  },
  codeTitle: {
    color: "#ff0066",
    paddingVertical: 10,
    fontSize: 12,
    textAlign: 'center',
  }
});
  