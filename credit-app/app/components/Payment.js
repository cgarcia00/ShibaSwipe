import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Dimensions,
  Alert,
} from "react-native";
import { useContext } from "react";
import { Themes } from "../../assets/Themes";
import UserData from "./UserData";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Payment = ({
  balance,
  setBalance,
  accountInfo,
  sendPayment,
  setShowBox,
}) => {
  const { userData, setUserData } = useContext(UserData);
  // This functions brings up the alert box that sends the payment
  const showConfirmDialog = () => {
    if (balance <= 0) {
      alert("Payment must be greater than 0.");
      return;
    } else if (!/^\d+$/.test(balance)) {
      // Regex expression to ensure only digits
      alert("You must enter a number.");
      return;
    } else if (balance > accountInfo.payableBalance) {
      // Disallow paying more than the payable balance
      alert("You cannot pay more than your available balance.");
      return;
    }
    return Alert.alert(
      "Confirm Payment",
      "Press yes to confirm your payment from your checking account ending in 0123.",
      [
        {
          text: "Yes",
          onPress: () => {
            sendPayment();
            setShowBox(false);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };
  return (
    <View style={[styles.dataContainer, Themes.light.shadows]}>
      <View style={styles.payBalanceContanier}>
        <Text style={styles.payBalanceText}>Pay Balance: $</Text>
        <TextInput
          onChangeText={setBalance}
          value={String(balance)}
          style={[styles.payBalanceInputText, styles.payBalanceInput]}
        />
      </View>
      <View style={styles.payButton}>
        <Button
          title="Pay Now"
          color={Themes.light.white}
          onPress={showConfirmDialog}
        />
      </View>
    </View>
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
    marginBottom: windowHeight * 0.01,
    paddingLeft: "5%",
    flexDirection: "column",
    alignItems: "center",
  },
  payBalanceContanier: {
    flexDirection: "row",
    marginVertical: "2%",
  },
  payBalanceText: {
    color: "black",
    fontFamily: "Roboto-Bold",
    fontSize: windowHeight * 0.022,
    marginRight: "1%",
  },
  payBalanceInputText: {
    color: "#505050",
    fontFamily: "Roboto",
    fontSize: windowHeight * 0.022,
  },
  payBalanceInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: "3%",
  },
  payButton: {
    flex: 1,
    width: windowHeight * 0.3,
    backgroundColor: Themes.light.bgThird,
    borderRadius: 4,
    marginVertical: "2%",
    justifyContent: "center",
  },
});

export default Payment;
