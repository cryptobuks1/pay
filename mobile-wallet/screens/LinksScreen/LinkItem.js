import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import PropTypes from "prop-types";
import moment from 'moment';
import 'moment-timezone';

export default class LinkItem extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    sym: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired
  };
  _makeSexyDate = seconds => {
    const date = moment(seconds*1000);
    const localDate = date.tz('Asia/Seoul').format('YYYY/MM/DD HH:mm:ss');// new Date();
    return localDate;//.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  render() {
    const { id, sym, amount, timestamp } = this.props;
    const stime = this._makeSexyDate(timestamp);
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.column} onPress={this._detailView}>
        <Text style={styles.timeArea}>{stime}</Text>
          <Text style={styles.idArea}>{id}</Text>
          <Text style={styles.amountArea}>{amount+' '+sym}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _detailView = () => {
    const { id, sym, amount, timestamp, from, to } = this.props;
    const stime = this._makeSexyDate(timestamp);
    const tokenAmount = amount + ' ' + sym;
    const msg = `ID: ${id}\n\nfrom: ${from}\n\nto: ${to}\n\namount: ${tokenAmount}\n\ntime: ${stime}`;
    Alert.alert('상세정보',msg);
  };
}

// width: width - 50,
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: "#bbeeff",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  amountArea: {
    color: "#235",
    width: "15%",
    fontSize: 12,
    alignItems: "center",
    textAlign: "center"
  },
  idArea: {
    color: "#0099cc",
    width: "63%",
    fontSize: 12,
    alignItems: "center"
  },
  timeArea: {
    color: "#46a",
    width: "22%",
    fontSize: 10,
    alignItems: "center",
    textAlign: "center"
  },
  column: {
    flexDirection: "row",
    alignItems: "center"
  }
});
