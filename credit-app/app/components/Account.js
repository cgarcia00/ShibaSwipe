/*
This file handles signin/signout/signup
*/

import {
  StyleSheet,
  Text,
  Button,
  View,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { createContext, useContext, useEffect, useState } from "react";
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { Icons, Themes } from "../../assets/Themes";
import Header from "./Header";
import UserData from "./UserData";
import sampleAccounts from "./sampleAccounts";
import { useNavigation } from "@react-navigation/native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const supabase = createClient(
  "https://rmhogcrxfpwwzeejlimk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaG9nY3J4ZnB3d3plZWpsaW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1NjI3NjUsImV4cCI6MjAxNzEzODc2NX0.1SJp7YQ-MCzV4svZgLye5oODmuh5lLrwY7qVaGug-Y8"
);

const SignUp = () => {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const nav = useNavigation();

  const { userData, setUserData } = useContext(UserData);

  function getRandomElement(arr) {
    if (arr.length === 0) {
      return null; // Return null or throw an error if the array is empty
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  // Signs Up user
  // Errors from Supabase are sent out as Alerts
  async function authUser(userEmail, userPassword, status) {
    if (status === "Sign Up") {
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
      });
      const { error_insert } = await supabase.from("UserData").insert({
        id: userEmail,
        // user gets random transactions
        user_transactions: getRandomElement(sampleAccounts),
      });
      if (error === null) {
        setUserData(data);
        nav.navigate("Home");
      } else {
        Alert.alert(error.message);
      }
    } else if (status == "Login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });
      if (error === null) {
        setUserData(data);
        nav.navigate("Home");
      } else {
        Alert.alert(error.message);
      }
    }
  }

  async function signOut() {
    const { data, error } = await supabase.auth.signOut();
    setUserData(null);
    setStatus("");
  }

  // Conditional rendering based on sign in status
  if (userData !== null) {
    return (
      <View style={[styles.submitButton, { marginTop: "10%" }]}>
        <Button title="Sign Out" color={Themes.light.white} onPress={signOut} />
      </View>
    );
  } else if (status === "Sign Up" || status === "Login") {
    return (
      <View style={styles.signUp}>
        <Text style={styles.darkText}> {status}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.darkText}>Email:{"        "}</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={userEmail}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.darkText}>Password:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={userPassword}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.submitButton}>
          <Button
            title="Submit"
            color={Themes.light.white}
            onPress={() => authUser(userEmail, userPassword, status)}
          />
        </View>
        <View style={styles.submitButton}>
          <Button
            title="Back"
            color={Themes.light.white}
            onPress={() => setStatus("")}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ marginTop: 30 }}>
        <View style={styles.submitButton}>
          <Button
            title="Login"
            color={Themes.light.white}
            onPress={() => setStatus("Login")}
          />
        </View>
        <View style={styles.submitButton}>
          <Button
            title="Sign Up"
            color={Themes.light.white}
            onPress={() => setStatus("Sign Up")}
          />
        </View>
      </View>
    );
  }
};

const Account = () => {
  return (
    <View style={styles.container}>
      <Header />
      <SignUp />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Themes.light.bg,
  },
  signUp: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
  },
  textContainer: {
    flexDirection: "row",
    paddingLeft: "6%",
    alignItems: "center",
    backgroundColor: Themes.light.bgSecondary,
    width: windowWidth * 0.8,
    borderRadius: 13,
    margin: "5%",
  },
  input: {
    height: windowHeight * 0.05,
    backgroundColor: Themes.light.white,
    margin: 12,
    borderWidth: 1,
    borderColor: Themes.light.gray,
    padding: 10,
    width: windowWidth * 0.5,
    borderRadius: 4,
    fontFamily: "Roboto",
    color: "black",
    fontSize: windowHeight * 0.018,
    marginVertical: "1%",
  },
  darkText: {
    fontFamily: "Roboto-Bold",
    color: "black",
    fontSize: windowHeight * 0.018,
    marginVertical: "1%",
  },
  submitButton: {
    height: windowHeight * 0.05,
    width: windowHeight * 0.2,
    backgroundColor: Themes.light.bgThird,
    borderRadius: 4,
    marginVertical: "2%",
    justifyContent: "center",
  },
});

export default Account;
