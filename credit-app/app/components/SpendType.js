import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Themes } from "../../assets/Themes";
import transactionColorKey from "./transactionColorKey";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SpendType = () => {
  return (
    <View style={styles.container}>
      <View style={styles.type}>
        <View
          style={[
            styles.circle,
            { backgroundColor: transactionColorKey["Shopping"] },
          ]}
        />
        <Text style={styles.typeText}>Shopping</Text>
      </View>
      <View style={styles.type}>
        <View
          style={[
            styles.circle,
            { backgroundColor: transactionColorKey["Food"] },
          ]}
        />
        <Text style={styles.typeText}>Food</Text>
      </View>
      <View style={styles.type}>
        <View
          style={[
            styles.circle,
            { backgroundColor: transactionColorKey["Travel"] },
          ]}
        />
        <Text style={styles.typeText}>Travel</Text>
      </View>
      <View style={styles.type}>
        <View
          style={[
            styles.circle,
            { backgroundColor: transactionColorKey["Groceries"] },
          ]}
        />
        <Text style={styles.typeText}>Groceries</Text>
      </View>
      <View style={styles.type}>
        <View
          style={[
            styles.circle,
            { backgroundColor: transactionColorKey["Gas"] },
          ]}
        />
        <Text style={styles.typeText}>Gas</Text>
      </View>
      <View style={styles.type}>
        <View
          style={[
            styles.circle,
            { backgroundColor: transactionColorKey["Entertainment"] },
          ]}
        />
        <Text style={styles.typeText}>Entertainment</Text>
      </View>
      <View style={styles.type}>
        <View
          style={[styles.circle, { backgroundColor: Themes.light.white }]}
        />
        <Text style={styles.typeText}>Other</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "1%",
  },
  type: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: windowHeight * 0.009,
    height: windowHeight * 0.009,
    borderRadius: 22,
    backgroundColor: Themes.light.bgSecondary,
    marginRight: "5%",
  },
  typeText: {
    color: "black",
    fontFamily: "Roboto-Bold",
    fontSize: windowHeight * 0.016,
  },
});

export default SpendType;
