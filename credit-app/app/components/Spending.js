/*
  Creates a page where a user can see their previous transactions
*/
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import UserData from "./UserData";
import { useContext, useState, useEffect } from "react";
import { Themes } from "../../assets/Themes";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import PieChart from "react-native-pie-chart";
import transactionColorKey from "./transactionColorKey";
import SpendType from "./SpendType";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Spending = () => {
  const { userData, setUserData, ping, setPing } = useContext(UserData);
  const [authedTransactions, setAuthedTransactions] = useState({});
  const [accountInfo, setAccountInfo] = useState({
    creditLimit: 1,
    availableCredit: 0,
    payableBalance: 0,
    pendingEvents: [],
    settledEvents: [],
  });
  const widthAndHeight = windowHeight * 0.25;
  const [series, setSeries] = useState([100]);
  const [sliceColors, setSliceColors] = useState([Themes.light.bg]);
  const nav = useNavigation();

  const email = userData !== null ? userData.user.email : "null";
  const url = "http://cgarciaalcazar20.pythonanywhere.com/account/" + email;
  const allTransactions = accountInfo.pendingEvents
    .filter((transaction) => transaction.eventType === "TXN_AUTHED")
    .concat(
      accountInfo.settledEvents.filter(
        (transaction) => transaction.eventType === "TXN_SETTLED"
      )
    )
    .sort((a, b) => {
      return a.time - b.time;
    });

  // Fetches account info
  async function getAccountInfo() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  const groupTransactions = (transactions) => {
    const result = transactions.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    return result;
  };

  // Sets the accountInfo on render and if there is an eventPing
  useEffect(() => {
    setTimeout(() => getAccountInfo().then(setAccountInfo), 200);
  }, [userData, ping]);

  useEffect(() => {
    setTimeout(
      () =>
        setAuthedTransactions(
          groupTransactions(
            accountInfo.pendingEvents
              .filter((transaction) => transaction.eventType === "TXN_AUTHED")
              .concat(
                accountInfo.settledEvents.filter(
                  (transaction) => transaction.eventType === "TXN_SETTLED"
                )
              )
          )
        ),
      200
    );
  }, [accountInfo]);

  useEffect(() => {
    let newSeries = [];
    let colors = [];
    for (let key in authedTransactions) {
      let typeAmount = authedTransactions[key].reduce((acc, item) => {
        return acc + item.amount;
      }, 0);
      newSeries.push(typeAmount);
      colors.push(transactionColorKey[key]);
    }
    if (newSeries.length !== 0) {
      setSeries(newSeries);
      setSliceColors(colors);
    }
  }, [authedTransactions]);
  if (userData !== null) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={[styles.chartAndKey, Themes.light.shadows]}>
          <Text style={styles.headerText}>Spending Breakdown</Text>
          <View style={styles.pieRow}>
            <SpendType />
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              sliceColor={sliceColors}
              coverRadius={0.45}
            />
          </View>
        </View>
        <View style={[styles.dataContainer, Themes.light.shadows]}>
          <Text
            style={[
              styles.darkText,
              {
                fontFamily: "Roboto-Bold",
                borderColor: "black",
              },
            ]}
          >
            Transactions
          </Text>
          <View style={styles.divider} />
          <ScrollView>
            {allTransactions.map((event) => {
              // Creating each row for settled events
              let amount =
                event.amount >= 0
                  ? "$" + event.amount
                  : "-$" + Math.abs(event.amount);
              return (
                <View key={event.txnId}>
                  <View style={styles.transactionInfo}>
                    <View>
                      <Text
                        style={[
                          styles.darkText,
                          { color: transactionColorKey[event.type] },
                        ]}
                      >
                        {event.name}{" "}
                      </Text>
                      <Text style={styles.ligherText}>
                        {new Date(event.time)
                          .toDateString()
                          .split(" ")
                          .slice(1)
                          .join(" ")}{" "}
                      </Text>
                      <Text style={styles.ligherText}>{event.type}</Text>
                    </View>
                    <Text style={[styles.darkText, { marginRight: "2%" }]}>
                      {amount}
                    </Text>
                  </View>
                  <View style={styles.subDivider} />
                </View>
              );
            })}
          </ScrollView>
        </View>
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
  circle: {
    width: windowHeight * 0.009,
    height: windowHeight * 0.009,
    borderRadius: 22,
    backgroundColor: Themes.light.bgSecondary,
    marginRight: "2%",
  },
  chartAndKey: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Themes.light.bgSecondary,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
    borderRadius: 13,
    width: windowWidth * 0.9,
    marginTop: "5%",
    resizeMode: "contain",
  },
  headerText: {
    color: "black",
    fontFamily: "Roboto-Bold",
    fontSize: windowHeight * 0.022,
  },
  pieRow: {
    flexDirection: "row",
    marginTop: "5%",
  },
  dataContainer: {
    flex: 1,
    width: windowWidth * 0.9,
    backgroundColor: Themes.light.bgSecondary,
    borderColor: "black",
    borderRadius: 13,
    padding: "3%",
    margin: "3%",
    paddingLeft: "5%",
    flexDirection: "column",
  },
  subDivider: {
    height: 1,
    backgroundColor: Themes.light.gray,
  },
  darkText: {
    fontFamily: "Roboto-Bold",
    color: "black",
    fontSize: windowHeight * 0.018,
    marginVertical: "1%",
  },
  ligherText: {
    fontFamily: "Roboto",
    color: "black",
    fontSize: windowHeight * 0.016,
    marginVertical: "1%",
  },
  divider: {
    height: windowHeight * 0.005,
    backgroundColor: Themes.light.bgThird,
    marginBottom: "2%",
  },
  transactionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Spending;
