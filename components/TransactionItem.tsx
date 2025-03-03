import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Transaction } from "@/context/Transactioncontext";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: () => void;
}

export default function TransactionItem({
  transaction,
  onDelete,
}: TransactionItemProps) {
  const { title, description, amount, date, category, type } = transaction;

  const formattedDate = new Date(date).toLocaleDateString();

  const getIconName = () => {
    switch (type) {
      case "income":
        return "arrow-up-outline";
      case "expense":
        return "arrow-down-outline";
      case "lend":
        return "swap-horizontal-outline";
      case "borrow":
        return "arrow-down-outline";
      case "reminder":
        return "alarm-outline";
      default:
        return "cash-outline";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "income":
        return "#2ecc71";
      case "expense":
        return "#e74c3c";
      case "lend":
        return "#3498db";
      case "borrow":
        return "#3498db";
      case "reminder":
        return "#3498db";
      default:
        return "#7f8c8d";
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case "income":
        return "#2ecc71";
      case "expense":
      case "lend":
        return "#e74c3c";
      case "borrow":
        return "#3498db";
      case "reminder":
        return "#3498db";
      default:
        return "#333";
    }
  };

  const getAmountPrefix = () => {
    switch (type) {
      case "income":
        return "+";
      case "expense":
      case "lend":
        return "-";
      case "borrow":
        return "-";
      case "reminder":
        return "-";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
        <Ionicons name={getIconName()} size={20} color="white" />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{category.name}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: getAmountColor() }]}>
          {getAmountPrefix()}${amount.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  amountContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
});
