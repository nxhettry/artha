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
      await addTransaction({
        title,
        description,
        amount: Number(amount),
        category: selectedCategory,
        type,
        date: date.toISOString(),
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
              type === "expense" && styles.selectedTypeButton,
            ]}
            onPress={() => setType("expense")}
          >
            <Ionicons
              name="arrow-down-outline"
              size={18}
              color={type === "expense" ? "white" : "#e74c3c"}
            />
            <Text
              style={[
                styles.typeText,
                type === "expense" && styles.selectedTypeText,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.selectedTypeButton,
              styles.incomeButton,
            ]}
            onPress={() => setType("income")}
          >
            <Ionicons
              name="arrow-up-outline"
              size={18}
              color={type === "income" ? "white" : "#2ecc71"}
            />
            <Text
              style={[
                styles.typeText,
                type === "income" && styles.selectedTypeText,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "lend" && styles.selectedTypeButton,
              styles.lendButton,
            ]}
            onPress={() => setType("lend")}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={18}
              color={type === "lend" ? "white" : "#3498db"}
            />
            <Text
              style={[
                styles.typeText,
                type === "lend" && styles.selectedTypeText,
              ]}
            >
              Lend
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "borrow" && styles.selectedTypeButton,
              styles.borrowButton,
            ]}
            onPress={() => setType("borrow")}
          >
            <Ionicons
              name="arrow-down-outline"
              size={18}
              color={type === "borrow" ? "white" : "#3498db"}
            />
            <Text
              style={[
                styles.typeText,
                type === "borrow" && styles.selectedTypeText,
              ]}
            >
              Borrow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "reminder" && styles.selectedTypeButton,
              styles.reminderButton,
            ]}
            onPress={() => setType("reminder")}
          >
            <Ionicons
              name="alarm-outline"
              size={18}
              color={type === "reminder" ? "white" : "#3498db"}
            />
            <Text
              style={[
                styles.typeText,
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
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e74c3c',
    flex: 0,
    minWidth: '45%',
    marginHorizontal: 0,
  },
  incomeButton: {
    borderColor: "#2ecc71",
  },
  lendButton: {
    borderColor: "#3498db",
  },
  selectedTypeButton: {
    backgroundColor: "#e74c3c",
  },
  typeText: {
    marginLeft: 5,
    fontWeight: "500",
    color: "#e74c3c",
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
    backgroundColor: "#3498db",
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
  borrowButton: {
    borderColor: "#3498db",
  },
  reminderButton: {
    borderColor: "#3498db",
  },
});
