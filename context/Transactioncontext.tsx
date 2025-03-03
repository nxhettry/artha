"use client";

import type React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTransactionsFromDb, addTransactionToDb, checkInternetConnection, syncPendingTransactions, PendingTransaction, deleteTransactionFromDb } from "@/services/TransactionService";
import NetInfo from '@react-native-community/netinfo';


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
  pendingTransactions: PendingTransaction[];
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
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);

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

  // Load pending transactions on mount
  useEffect(() => {
    const loadPendingTransactions = async () => {
      try {
        const stored = await AsyncStorage.getItem('pendingTransactions');
        if (stored) {
          setPendingTransactions(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading pending transactions:", error);
      }
    };

    loadPendingTransactions();
  }, []);

  // Load pending deletes on mount
  useEffect(() => {
    const loadPendingDeletes = async () => {
      try {
        const stored = await AsyncStorage.getItem('pendingDeletes');
        if (stored) {
          setPendingDeletes(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading pending deletes:", error);
      }
    };

    loadPendingDeletes();
  }, []);

  // Set up network listener to trigger sync
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        // Sync pending transactions
        if (pendingTransactions.length > 0) {
          const synced = await syncPendingTransactions(pendingTransactions);
          if (synced) {
            setPendingTransactions([]);
            await AsyncStorage.removeItem('pendingTransactions');
          }
        }

        // Sync pending deletes
        if (pendingDeletes.length > 0) {
          for (const id of pendingDeletes) {
            try {
              await deleteTransactionFromDb(id);
            } catch (error) {
              console.error("Error syncing delete:", error);
              continue;
            }
          }
          setPendingDeletes([]);
          await AsyncStorage.removeItem('pendingDeletes');
        }

        // Refresh transactions from DB
        const transactions = await getTransactionsFromDb();
        setTransactions(transactions as Transaction[]);
      }
    });

    return () => unsubscribe();
  }, [pendingTransactions, pendingDeletes]);

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

  // Save pending transactions whenever they change
  useEffect(() => {
    const savePendingTransactions = async () => {
      try {
        await AsyncStorage.setItem(
          'pendingTransactions',
          JSON.stringify(pendingTransactions)
        );
      } catch (error) {
        console.error("Error saving pending transactions:", error);
      }
    };

    if (pendingTransactions.length > 0) {
      savePendingTransactions();
    }
  }, [pendingTransactions]);

  // Save pending deletes whenever they change
  useEffect(() => {
    const savePendingDeletes = async () => {
      try {
        if (pendingDeletes.length > 0) {
          await AsyncStorage.setItem('pendingDeletes', JSON.stringify(pendingDeletes));
        } else {
          await AsyncStorage.removeItem('pendingDeletes');
        }
      } catch (error) {
        console.error("Error saving pending deletes:", error);
      }
    };

    savePendingDeletes();
  }, [pendingDeletes]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    try {
      // Try to add to DB first
      await addTransactionToDb(newTransaction);
      // If successful, add to local state
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      if (error instanceof Error && error.message === 'offline') {
        // If offline, add to pending transactions
        const pendingTransaction: PendingTransaction = {
          ...newTransaction,
          syncStatus: 'pending'
        };
        setPendingTransactions([...pendingTransactions, pendingTransaction]);
        // Also add to local transactions
        setTransactions([newTransaction, ...transactions]);
      } else {
        throw error;
      }
    }
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
    try {
      // Try to delete from DB first
      await deleteTransactionFromDb(id);
      // If successful, remove from local state
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      if (error instanceof Error && error.message === 'offline') {
        // If offline, add to pending deletes
        setPendingDeletes([...pendingDeletes, id]);
        // Remove from local state
        setTransactions(transactions.filter(t => t.id !== id));
        // Also remove from pending transactions if it exists there
        setPendingTransactions(pendingTransactions.filter(t => t.id !== id));
      } else {
        throw error;
      }
    }
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
        pendingTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
