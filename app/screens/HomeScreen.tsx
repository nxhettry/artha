import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "@/context/Transactioncontext";
import TransactionItem from "@/components/TransactionItem";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { transactions, deleteTransaction, loading } = useTransactions();
  const [filter, setFilter] = useState<"all" | "expense" | "income" | "lend">(
    "all"
  );

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const totalBalance = transactions.reduce((sum, transaction) => {
    if (transaction.type === "income") {
      return sum + transaction.amount;
    } else if (transaction.type === "expense") {
      return sum - transaction.amount;
    } else {
      // For lend, we're considering it as money going out
      return sum - transaction.amount;
    }
  }, 0);

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            totalBalance < 0 ? styles.negative : styles.positive,
          ]}
        >
          ${Math.abs(totalBalance).toFixed(2)}
          {totalBalance < 0 ? " (Debt)" : ""}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "income" && styles.activeFilter,
          ]}
          onPress={() => setFilter("income")}
        >
          <Text style={styles.filterText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.activeFilter,
          ]}
          onPress={() => setFilter("expense")}
        >
          <Text style={styles.filterText}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "lend" && styles.activeFilter,
          ]}
          onPress={() => setFilter("lend")}
        >
          <Text style={styles.filterText}>Lend</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : filteredTransactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found</Text>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                onDelete={() => handleDeleteTransaction(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTransaction" as never)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  balanceContainer: {
    backgroundColor: "#845ec2",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceLabel: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  positive: {
    color: "#e0f7fa",
  },
  negative: {
    color: "#ffcdd2",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#845ec2",
  },
  filterText: {
    color: "#333",
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#845ec2",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
