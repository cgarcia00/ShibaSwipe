import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import Icons from "../../assets/Icons";
import UserData from "./UserData";
import { useContext } from "react";
import { Themes } from "../../assets/Themes";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Header = () => {
  const { userData, setUserData } = useContext(UserData);
  const nav = useNavigation();
  return (
    <>
      <Text style={styles.userEmail} onPress={() => nav.navigate("Account")}>
        {userData !== null ? userData.user.email : "Sign In"}
      </Text>
      <Image source={Icons.shibaLogo} style={styles.headerIcon} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  headerIcon: {
    height: windowHeight * 0.08,
    resizeMode: "contain",
  },
  userEmail: {
    fontFamily: "Roboto-Bold",
    color: Themes.light.black,
    fontSize: windowHeight * 0.015,
    marginLeft: windowWidth * 0.6,
    marginTop: "6%",
  },
});

export default Header;
