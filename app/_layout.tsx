import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

import HomeScreen from "./screens/HomeScreen"
import AddTransactionScreen from "./screens/AddTransactionScreen"
import { TransactionProvider } from "@/context/Transactioncontext"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <TransactionProvider>
        {/* <NavigationContainer> */}
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Finance Tracker" }} />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{ title: "Add Transaction" }}
            />
          </Stack.Navigator>
        {/* </NavigationContainer>r */}
      </TransactionProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}

