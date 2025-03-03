import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import { TransactionProvider } from "@/context/Transactioncontext";
import index from "./index";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <TransactionProvider>
        <Stack.Navigator initialRouteName="index">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Finance Tracker" }}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ title: "Add Transaction" }}
          />
          <Stack.Screen
            name="index"
            component={index}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </TransactionProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
