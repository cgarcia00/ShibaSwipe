import { useCallback, useState, useContext, Dimensions } from "react";
import { StyleSheet, View, Text, StatusBar, LogBox } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Themes } from "../assets/Themes";
import Header from "./components/Header";
import Body from "./components/Body";
import Spending from "./components/Spending";
import ShibaBoba from "./components/ShibaBoba";
import Account from "./components/Account";
import UserData from "./components/UserData";
import { useNavigation } from "@react-navigation/native";

/* Keep the splash screen visible while we fetch resources */
SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs();

function HomeScreen() {
  const { userData, setUserData } = useContext(UserData);
  nav = useNavigation();
  if (userData !== null) {
    return (
      <View style={styles.container}>
        <Header />
        <Body />
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
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [userData, setUserData] = useState(null);
  const [ping, setPing] = useState(null);

  // Set fonts
  const [fontsLoaded] = useFonts({
    Roboto: require("../assets/Fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/Fonts/Roboto-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  StatusBar.setBarStyle(Themes.light.statusBar);

  return (
    <UserData.Provider value={{ userData, setUserData, ping, setPing }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "ios-home" : "ios-home-outline";
              } else if (route.name === "Account") {
                iconName = focused ? "ios-list" : "ios-list-outline";
              } else if (route.name === "Spending") {
                iconName = focused ? "ios-cash" : "ios-cash-outline";
              } else if (route.name === "Shiba Boba") {
                iconName = focused ? "ios-paw" : "ios-paw-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Themes.light.bg,
            tabBarInactiveTintColor: Themes.light.gray,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Account" component={Account} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Spending" component={Spending} />
          <Tab.Screen name="Shiba Boba" component={ShibaBoba} />
        </Tab.Navigator>
      </View>
    </UserData.Provider>
  );
}

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
  tabStyle: {
    backgroundColor: Themes.light.black,
  },
});
