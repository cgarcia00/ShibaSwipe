/*
  Main body for HomeScreen
*/
import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Payment from "./Payment";
import Transactions from "./Transactions";
import CreditView from "./CreditView";
import UserData from "./UserData";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Body = () => {
  const [eventPing, updateFunction] = useState(true);
  const [balance, setBalance] = useState(0);
  const [showBox, setShowBox] = useState(true);
  const { userData, setUserData, ping, setPing } = useContext(UserData);
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
  async function sendPayment() {
    // The new txnId and eventTime need some extra work to be figured out
    let paymentId = 1;
    for (let idx in accountInfo.pendingEvents) {
      const item = accountInfo.pendingEvents[idx];
      if (item.txnId.substring(0, 1) === "p") {
        paymentId = Math.max(paymentId, Number(item.txnId.substring(1)));
        break;
      }
    }
    for (let idx in accountInfo.settledEvents) {
      const item = accountInfo.settledEvents[idx];
      if (item.txnId.substring(0, 1) === "p") {
        paymentId = Math.max(paymentId, Number(item.txnId.substring(1)));
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
      eventType: "PAYMENT_INITIATED",
      eventTime: Math.max(eventTime1, eventTime2) + 1,
      txnId: "p" + (paymentId + 1),
      amount: -balance,
      name: "Payment",
      type: "Account *******0123",
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
    setTimeout(() => getAccountInfo().then(setAccountInfo), 200);
  }, [eventPing, userData, ping]);

  // Sets the balance in the input text
  useEffect(() => {
    setTimeout(() => setBalance(accountInfo.payableBalance), 200);
  }, [accountInfo, userData, ping]);

  return (
    <View style={styles.container}>
      <CreditView accountInfo={accountInfo} />
      <Transactions accountInfo={accountInfo} />
      <Payment
        balance={balance}
        setBalance={setBalance}
        accountInfo={accountInfo}
        sendPayment={sendPayment}
        setShowBox={setShowBox}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
    flexDirection: "column",
    paddingBottom: windowHeight * 0.025,
  },
});

export default Body;
