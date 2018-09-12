import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from "react-native";
export default class SignupCompletedScreen extends React.Component {

    render() {

      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.title}>회원가입을 축하합니다.</Text>
          <Text style={styles.subject}>로그인창으로 이동합니다.</Text>
        </View>
      );
    }

 }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#235",
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      color: "#cde",
      fontSize: 30,
      fontWeight: "200"
    },
    subject: {
      paddingVertical: 15,
      alignItems: "center",
      fontSize: 20,
      color: '#cde',
    }
  });
  