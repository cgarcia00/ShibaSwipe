/*
  Creates a page where users can buy boba
*/
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import UserData from "./UserData";
import { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { Themes, Icons } from "../../assets/Themes";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ShibaBoba = () => {
  const [eventPing, updateFunction] = useState(true);
  const { userData, setUserData, ping, setPing } = useContext(UserData);
  const nav = useNavigation();

  const [accountInfo, setAccountInfo] = useState({
    creditLimit: 1,
    availableCredit: 0,
    payableBalance: 0,
    pendingEvents: [],
    settledEvents: [],
  });
  const email = userData !== null ? userData.user.email : "null";
  const url = "http://cgarciaalcazar20.pythonanywhere.com/account/" + email;

  // Fetches account info
  async function getAccountInfo() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Sends the payment data payload to the flask backend
  async function pay(cost) {
    // The new txnId and eventTime need some extra work to be figured out
    let transactionId = 1;
    for (let idx in accountInfo.pendingEvents) {
      const item = accountInfo.pendingEvents[idx];
      if (item.txnId.substring(0, 1) === "t") {
        transactionId = Math.max(
          transactionId,
          Number(item.txnId.substring(1))
        );
        break;
      }
    }
    for (let idx in accountInfo.settledEvents) {
      const item = accountInfo.settledEvents[idx];
      if (item.txnId.substring(0, 1) === "t") {
        transactionId = Math.max(
          transactionId,
          Number(item.txnId.substring(1))
        );
        break;
      }
    }
    const eventTime1 =
      accountInfo.settledEvents.length > 0
        ? accountInfo.settledEvents[0].eventTime
        : 1;
    const eventTime2 =
      accountInfo.pendingEvents.length > 0
        ? accountInfo.pendingEvents[0].eventTime
        : 1;

    const data = {
      eventType: "TXN_AUTHED",
      eventTime: Math.max(eventTime1, eventTime2) + 1,
      txnId: "t" + (transactionId + 1),
      amount: cost,
      name: "Shiba Boba",
      type: "Food",
      time: Date.now(),
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(updateFunction(!eventPing));
  }

  // Sets the accountInfo on render and if there is an eventPing
  useEffect(() => {
    setPing(!ping);
    setTimeout(() => getAccountInfo().then(setAccountInfo), 200);
  }, [eventPing, userData]);

  const showConfirmDialog = (amount) => {
    // error checking
    if (accountInfo.availableCredit < amount) {
      alert("Transaction Declined. Not enough credit.");
      return;
    }
    return Alert.alert(
      "Confirm Payment",
      "Press yes to confirm your purchase of $" + String(amount) + ".",
      [
        {
          text: "Yes",
          onPress: () => {
            pay(amount);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  if (userData !== null) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.titleText}>Shiba Boba</Text>
        <ScrollView>
          <View style={styles.drink}>
            <Image source={Icons.shibaClassic} style={styles.drinkImage} />
            <View style={styles.drinkInfo}>
              <Text style={styles.darkText}>Shiba Classic: $8</Text>
              <Text style={styles.drinkText}>
                Shiba Classic is a whimsical boba drink. It features a base of
                rich, creamy milk tea that embodies the warm, toasty hues of a
                Shiba Inu's coat.
              </Text>
              <View style={styles.buyButton}>
                <Button
                  title="Buy"
                  color={Themes.light.white}
                  onPress={() => showConfirmDialog(8)}
                />
              </View>
            </View>
          </View>
          <View style={styles.drink}>
            <Image source={Icons.shibaSlobber} style={styles.drinkImage} />
            <View style={styles.drinkInfo}>
              <Text style={styles.darkText}>Shiba Slobber: $7</Text>
              <Text style={styles.drinkText}>
                Shiba Slobber is a playful twist on a classic boba drink. This
                beverage combines a refreshing blend of jasmine green tea and
                lime juice to create a citrusy delight.
              </Text>
              <View style={styles.buyButton}>
                <Button
                  title="Buy"
                  color={Themes.light.white}
                  onPress={() => showConfirmDialog(7)}
                />
              </View>
            </View>
          </View>
          <View style={styles.drink}>
            <Image source={Icons.shibaHachi} style={styles.drinkImage} />
            <View style={styles.drinkInfo}>
              <Text style={styles.darkText}>Hachi Honey Latte: $10</Text>
              <Text style={styles.drinkText}>
                The Hachi Honey Latte is a reference to the famous Hachiko
                story. This latte blends the rich, smooth taste of freshly
                brewed espresso with organic honey from Tsushima.
              </Text>
              <View style={styles.buyButton}>
                <Button
                  title="Buy"
                  color={Themes.light.white}
                  onPress={() => showConfirmDialog(10)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.signInText} onPress={() => nav.navigate("Account")}>
          Sign In
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Themes.light.bg,
  },
  signInText: {
    color: Themes.light.white,
    fontFamily: "Roboto-Bold",
    fontSize: 40,
    marginTop: "15%",
  },
  drinkImage: {
    height: windowHeight * 0.18,
    width: windowHeight * 0.18,
    marginLeft: "3%",
    marginVertical: "3%",
  },
  drink: {
    flexDirection: "row",
    backgroundColor: Themes.light.bgSecondary,
    width: windowWidth * 0.9,
    borderRadius: 13,
    marginBottom: "8%",
    marginTop: "3%",
    alignItems: "center",
  },
  drinkInfo: {
    flexDirection: "column",
    alignItems: "center",
    paddingRight: windowWidth * 0.4,
  },
  drinkText: {
    margin: "5%",
    marginTop: "2%",
    fontFamily: "Roboto",
    color: "black",
    fontSize: windowHeight * 0.018,
  },
  darkText: {
    margin: "5%",
    marginBottom: "0%",
    fontFamily: "Roboto-Bold",
    color: "black",
    fontSize: windowHeight * 0.018,
  },
  titleText: {
    color: "black",
    fontFamily: "Roboto-Bold",
    fontSize: windowHeight * 0.022,
    marginRight: "1%",
    marginTop: "3%",
  },
  buyButton: {
    width: "80%",
    backgroundColor: Themes.light.bgThird,
    borderRadius: 4,
    marginVertical: "2%",
    justifyContent: "center",
  },
});

export default ShibaBoba;
