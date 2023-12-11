/*
  Contains Pending/Settled transactions that are sent to HomeScreen
*/
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { Themes } from "../../assets/Themes";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const Transactions = ({ accountInfo }) => {
  return (
    <>
      <View style={[styles.dataContainer, Themes.light.shadows]}>
        <Text style={[styles.darkText, { fontFamily: "Roboto-Bold" }]}>
          Pending Transactions
        </Text>
        <View style={styles.divider} />
        <ScrollView>
          {accountInfo.pendingEvents.map((event) => {
            // Creating each row for pending events
            let amount =
              event.amount >= 0
                ? "$" + event.amount
                : "-$" + Math.abs(event.amount);
            return (
              <View key={event.txnId}>
                <View style={styles.transactionInfo}>
                  <View>
                    <Text style={styles.darkText}>{event.name} </Text>
                    <Text style={styles.ligherText}>
                      {new Date(event.time)
                        .toDateString()
                        .split(" ")
                        .slice(1)
                        .join(" ")}
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
          Settled Transactions
        </Text>
        <View style={styles.divider} />
        <ScrollView>
          {accountInfo.settledEvents.map((event) => {
            // Creating each row for settled events
            let amount =
              event.amount >= 0
                ? "$" + event.amount
                : "-$" + Math.abs(event.amount);
            return (
              <View key={event.txnId}>
                <View style={styles.transactionInfo}>
                  <View>
                    <Text style={styles.darkText}>{event.name} </Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    width: windowWidth * 0.9,
    backgroundColor: Themes.light.bgSecondary,
    borderColor: "black",
    borderRadius: 13,
    padding: "3%",
    margin: "3%",
    marginBottom: 0,
    paddingLeft: "5%",
    flexDirection: "column",
  },
  divider: {
    height: windowHeight * 0.005,
    backgroundColor: Themes.light.bgThird,
    marginBottom: "2%",
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
  transactionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Transactions;
