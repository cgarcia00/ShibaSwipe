import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as Progress from "react-native-progress";

import { Themes } from "../../assets/Themes";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const CreditView = ({ accountInfo }) => {
  // Covers the edge cases where payableBalance and availableCredit are negative and
  // the negative sign goes before the dollar sign like in $-100 ---> -$100
  const payableBalance =
    accountInfo.payableBalance >= 0
      ? "$" + accountInfo.payableBalance.toLocaleString("en-US")
      : "-$" + Math.abs(accountInfo.payableBalance).toLocaleString("en-US");

  const availableCredit =
    accountInfo.availableCredit >= 0
      ? "$" + accountInfo.availableCredit.toLocaleString("en-US")
      : "-$" + Math.abs(accountInfo.availableCredit).toLocaleString("en-US");

  return (
    <View style={styles.creditContainer}>
      <View style={styles.balanceContainer}>
        <View
          style={[styles.circle, { backgroundColor: Themes.light.bgThird }]}
        />
        <Text style={styles.text}>Current Balance</Text>
      </View>
      <Text style={styles.balanceText}>{payableBalance}</Text>
      <Progress.Bar
        progress={
          (accountInfo.creditLimit - accountInfo.availableCredit) /
          accountInfo.creditLimit
        }
        width={windowWidth * 0.7}
        height={windowHeight * 0.015}
        style={styles.progressBar}
        color={Themes.light.bgThird}
        backgroundColor={Themes.light.bgSecondary}
      />
      <View style={styles.balanceContainer}>
        <View style={styles.circle} />
        <Text style={styles.text}>
          Available Credit: {availableCredit} of $
          {accountInfo.creditLimit.toLocaleString("en-US")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto-Bold",
    color: "white",
    fontSize: windowHeight * 0.018,
  },
  progressBar: {
    height: windowHeight * 0.015,
    borderRadius: 100,
    marginBottom: windowHeight * 0.018,
    borderWidth: 0,
  },
  circle: {
    width: windowHeight * 0.009,
    height: windowHeight * 0.009,
    borderRadius: 22,
    backgroundColor: Themes.light.bgSecondary,
    marginRight: "2%",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  creditContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: windowHeight * 0.007,
  },
  balanceText: {
    color: "white",
    fontFamily: "Roboto-Bold",
    fontSize: windowHeight * 0.025,
    margin: "2%",
  },
});

export default CreditView;
