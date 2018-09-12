import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import PropTypes from "prop-types";

export default class PKeyItem extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    index: PropTypes.number.isRequired, 
    pkey: PropTypes.string.isRequired,
    focus: PropTypes.bool.isRequired,
    changeKey: PropTypes.func.isRequired,
    deleteKey: PropTypes.func.isRequired
  };
  render() {
    const { index, pkey, focus } = this.props;
    const btn = index > 0 ? true : false;
    return (
      <View style={focus ? styles.containerFocus : styles.container}>
        <View style={styles.column}>
          <TouchableOpacity style={styles.oneArea} onPress={this._detailView}>
            <Text numberOfLines ={1} style={styles.keyText}>{pkey}</Text>
          </TouchableOpacity>
          {
            btn && (
              <TouchableOpacity style={styles.twoArea} onPress={this._deleteView}>
                <Text style={styles.btnText}>{'X'}</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    );
  }

  _detailView = () => {
    const { pkey, changeKey } = this.props;
    changeKey(pkey);
  };
  _deleteView = () => {
    const { pkey, deleteKey } = this.props;
    deleteKey(pkey);
  };
}

// width: width - 50,
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  containerFocus: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomColor: "#bbb",
    backgroundColor: "#ccc",
    borderBottomWidth: 1,
  },
  oneArea: {
    width: "90%",
    alignItems: "center",
  },
  twoArea: {
    width: "10%",
    alignItems: "center",
  },
  keyText: {
    color: "#46a",
    fontSize: 12,
    textAlign: "left"
  },
  btnText: {
    color: "#235",
    fontSize: 12,
    textAlign: "center"
  },
  column: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});
