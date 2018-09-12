import React from 'react';
import { ScrollView, StyleSheet,
    Text,
    Dimensions,
    View } from 'react-native';
import LinkItem from "./LinkItem";
import axios from 'axios';

const { width } = Dimensions.get("window");

export default class LinksPresenter extends React.Component {
  static navigationOptions = {
    title: '거래내역',
  };

  state = {
    // callHistory: true,
    sendIndex: 0,
    recvIndex: 0
  };
  
  componentDidMount = () => {
    if( this.props.loginStatus ){
      this.props.setSendHistory([]);
      this.props.setRecvHistory([]);
      this._refreshHistory();
    }
  };
  componentWillUnmount = () => {
    // this.setState({
    //     callHistory: false
    // });
  };
  componentWillReceiveProps(nextProps) {
    const currentProps = this.props;
    if (!currentProps.loginStatus && nextProps.loginStatus) {
      setTimeout(() => {
        this.props.setSendHistory([]);
        this.props.setRecvHistory([]);
        this._refreshHistory();
      }, 1000);
    } else {
    }
  }

  _refreshHistory = async () => {
    const {loginUser, loginStatus} = this.props;
    if(loginUser === null || !loginStatus) return;

    await this._getSendHistory();
    await this._getRecvHistory();

    setTimeout(this._refreshHistory, 3000);
  }

  _sumHistory = (his) => {
    let _sum = 0;
    if(his){
      his.forEach(item => {
        _sum += item.amount;
      });
    }
    return _sum;
  }

  render() {
    const {sends, recvs } = this.props;

    return (
      <View contentContainerStyle={styles.container}>
        <View style={styles.vpart}>
          <Text style={styles.title}>{`이체/결제 기록`}</Text>
          <View style={styles.column}>
            <Text style={styles.timeArea}>일시</Text>
            <Text style={styles.idArea}>I D</Text>
            <Text style={styles.amountArea}>TOKEN</Text>
          </View>
          <View style={styles.tableScroll}>
            <ScrollView contentContainerStyle={styles.tableCard}>
              {sends.map(send => 
                    <LinkItem
                      key={send.id}
                      {...send}
                    />
                  )}
            </ScrollView>
          </View>
        </View>
        <View style={styles.vpart}>
          <Text style={styles.title}>{`입금 기록`}</Text>
          <View style={styles.column}>
          <Text style={styles.timeArea}>일시</Text>
            <Text style={styles.idArea}>I D</Text>
            <Text style={styles.amountArea}>TOKEN</Text>
          </View>
          <View style={styles.tableScroll}>
            <ScrollView contentContainerStyle={styles.tableCard}>
              {recvs.map(recv => 
                    <LinkItem
                      key={recv.id}
                      {...recv}
                    />
                  )}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  _getSendHistory = async () => {
    const {publicKey, setSendHistory, config} = this.props;
    const {sendIndex} = this.state;

    try {
      const response = await axios.post(
        `${config.walletNode}/sent-history`, //URL_SendHistorys,
        { address: publicKey, index: sendIndex },
        { headers: { "Content-Type": "application/json" } }
      );
      if( response && response.data && response.status === 200 ){
        const {txs, lastIndex} = response.data;
        if(this.props.loginUser == null) return;
        if(!this.props.loginStatus) return;
        this.setState({
          sendIndex: lastIndex
        });     
        if (txs !== null && txs !== undefined) {
          if( txs.length > 0){
            const {sends} = this.props;
            setSendHistory(sends.concat(txs));
          }
        }
      }
    } catch (e) {
      console.log("_getSendHistory error : "+e);
    }    
  };
  
  _getRecvHistory = async () => {
    const {publicKey, setRecvHistory, config} = this.props;
    const {recvIndex} = this.state;

    try {
      const response = await axios.post(
        `${config.walletNode}/recv-history`, //URL_RecvHistorys,
        { address: publicKey, index: recvIndex },
        { headers: { "Content-Type": "application/json" } }
      );
      //const response = await axios.get(URL_RecvHistorys + privateKey);
      if( response && response.data && response.status === 200 ){
        const {txs, lastIndex} = response.data;
        if(this.props.loginUser == null) return;
        if(!this.props.loginStatus) return;
        this.setState({
          recvIndex: lastIndex
        });     
        if (txs !== null && txs !== undefined) {
          if( txs.length > 0){
            const {recvs} = this.props;
            setRecvHistory(recvs.concat(txs));
          }
        }
      }
    } catch (e) {
      console.log("_getRecvHistory error : "+e);
    }    
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
  },
  vpart: {
    height: "50%",
  },
  title: {
    width: width,
    paddingVertical: 4,
    color: "#fff",
    fontSize: 12,
    backgroundColor: '#0099cc',
    alignItems: "center",
    textAlign: "center"
  },
  tableCard: {
  },
  tableScroll: {
    height: "100%",
    backgroundColor: "#fff"
  },
  amountArea: {
    color: "#0099cc",
    width: "15%",
    fontSize: 12,
    alignItems: "center",
    textAlign: "center"
  },
  idArea: {
    color: "#0099cc",
    width: "63%",
    fontSize: 12,
    alignItems: "center",
    textAlign: "center"
  },
  timeArea: {
    color: "#0099cc",
    width: "22%",
    fontSize: 12,
    alignItems: "center",
    textAlign: "center"
  },
  column: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomColor: "#0099cc",
    borderBottomWidth: 1,
    backgroundColor: "#aaeeff",
    flexDirection: "row",
    alignItems: "center"
  }

});
