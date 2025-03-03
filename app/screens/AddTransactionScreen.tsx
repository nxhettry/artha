"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useTransactions,
  type TransactionType,
} from "@/context/Transactioncontext";
import CategoryPicker from "@/components/CategoryPicker";
import { addTransactionToDb } from "@/services/TransactionService";

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { addTransaction, categories, addCategory } = useTransactions();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [person, setPerson] = useState("");

  const handleAddTransaction = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    try {
      await addTransactionToDb({
        title,
        description,
        amount: Number(amount),
        category: selectedCategory,
        type,
        date: date.toISOString(),
        id: "",
        person,
      });


      // This is for async storage
      // ToDo : make this store the transaction offline and attach to Db later
      await addTransaction({
        title,
        description,
        amount: Number(amount),
        category: selectedCategory,
        type,
        date: date.toISOString(),
        person,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add transaction");
      console.error(error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButton_expense,
              type === "expense" && styles.selectedTypeButton_expense,
            ]}
            onPress={() => setType("expense")}
          >
            <Ionicons
              name="arrow-down-outline"
              size={20}
              color={type === "expense" ? "white" : "#e74c3c"}
            />
            <Text
              style={[
                styles.typeText,
                styles.typeText_expense,
                type === "expense" && styles.selectedTypeText,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButton_income,
              type === "income" && styles.selectedTypeButton_income,
            ]}
            onPress={() => setType("income")}
          >
            <Ionicons
              name="arrow-up-outline"
              size={20}
              color={type === "income" ? "white" : "#2ecc71"}
            />
            <Text
              style={[
                styles.typeText,
                styles.typeText_income,
                type === "income" && styles.selectedTypeText,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButton_lend,
              type === "lend" && styles.selectedTypeButton_lend,
            ]}
            onPress={() => setType("lend")}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={20}
              color={type === "lend" ? "white" : "#3498db"}
            />
            <Text
              style={[
                styles.typeText,
                styles.typeText_lend,
                type === "lend" && styles.selectedTypeText,
              ]}
            >
              Lend
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButton_borrow,
              type === "borrow" && styles.selectedTypeButton_borrow,
            ]}
            onPress={() => setType("borrow")}
          >
            <Ionicons
              name="arrow-down-outline"
              size={20}
              color={type === "borrow" ? "white" : "#9b59b6"}
            />
            <Text
              style={[
                styles.typeText,
                styles.typeText_borrow,
                type === "borrow" && styles.selectedTypeText,
              ]}
            >
              Borrow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              styles.typeButton_reminder,
              type === "reminder" && styles.selectedTypeButton_reminder,
            ]}
            onPress={() => setType("reminder")}
          >
            <Ionicons
              name="alarm-outline"
              size={20}
              color={type === "reminder" ? "white" : "#f1c40f"}
            />
            <Text
              style={[
                styles.typeText,
                styles.typeText_reminder,
                type === "reminder" && styles.selectedTypeText,
              ]}
            >
              Reminder
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <CategoryPicker
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={addCategory}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{date.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.personContainer}>
            <Text style={styles.label}>Person</Text>
            <Text style={[styles.label, { fontSize: 12, color: "#666" }]}>
              (Optional)
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={person}
            onChangeText={setPerson}
            placeholder="Enter person"
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTransaction}
        >
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: "45%",
    backgroundColor: "white",
  },
  typeText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
  },
  typeButton_expense: {
    borderColor: "#e74c3c",
  },
  typeText_expense: {
    color: "#e74c3c",
  },
  selectedTypeButton_expense: {
    backgroundColor: "#e74c3c",
  },
  typeButton_income: {
    borderColor: "#2ecc71",
  },
  typeText_income: {
    color: "#2ecc71",
  },
  selectedTypeButton_income: {
    backgroundColor: "#2ecc71",
  },
  typeButton_lend: {
    borderColor: "#3498db",
  },
  typeText_lend: {
    color: "#3498db",
  },
  selectedTypeButton_lend: {
    backgroundColor: "#3498db",
  },
  typeButton_borrow: {
    borderColor: "#9b59b6",
  },
  typeText_borrow: {
    color: "#9b59b6",
  },
  selectedTypeButton_borrow: {
    backgroundColor: "#9b59b6",
  },
  typeButton_reminder: {
    borderColor: "#f1c40f",
  },
  typeText_reminder: {
    color: "#f1c40f",
  },
  selectedTypeButton_reminder: {
    backgroundColor: "#f1c40f",
  },
  selectedTypeText: {
    color: "white",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#845ec2",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  personContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
