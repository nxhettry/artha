"use client";

import type React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTransactionsFromDb } from "@/services/TransactionService";


export type TransactionType =
  | "expense"
  | "income"
  | "lend"
  | "borrow"
  | "reminder";

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  type: TransactionType;
  person?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  addCategory: (name: string) => Promise<Category>;
  deleteTransaction: (id: string) => Promise<void>;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from DB ans AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data from DB
        const transactions = await getTransactionsFromDb();

        if (transactions.length) {
          setTransactions(transactions as Transaction[]);
          await AsyncStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
          );

          return;
        }

        const storedTransactions = await AsyncStorage.getItem("transactions");
        const storedCategories = await AsyncStorage.getItem("categories");

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }

        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          // Set default categories if none exist
          const defaultCategories = [
            { id: "1", name: "Food" },
            { id: "2", name: "Transportation" },
            { id: "3", name: "Entertainment" },
            { id: "4", name: "Bills" },
            { id: "5", name: "Salary" },
          ];
          setCategories(defaultCategories);
          await AsyncStorage.setItem(
            "categories",
            JSON.stringify(defaultCategories)
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save transactions to AsyncStorage whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem(
          "transactions", 
          JSON.stringify(transactions)
        );
      } catch (error) {
        console.error("Error saving transactions:", error);
      }
    };

    if (!loading) {
      saveTransactions();
    }
  }, [transactions, loading]);

  // Save categories to AsyncStorage whenever they change
  useEffect(() => {
    const saveCategories = async () => {
      try {
        await AsyncStorage.setItem("categories", JSON.stringify(categories));
      } catch (error) {
        console.error("Error saving categories:", error);
      }
    };

    if (!loading && categories.length > 0) {
      saveCategories();
    }
  }, [categories, loading]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const addCategory = async (name: string): Promise<Category> => {
    const newCategory = {
      id: Date.now().toString(),
      name,
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        addCategory,
        deleteTransaction,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
