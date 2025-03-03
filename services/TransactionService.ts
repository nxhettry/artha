import { db } from "@/FirebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import NetInfo from '@react-native-community/netinfo';

export interface Transaction {
  amount: number;
  category: {
    id: string;
    name: string;
  };
  date: string;
  description: string;
  id: string;
  title: string;
  type: "expense" | "income" | "lend" | "borrow" | "reminder";
  person?: string;
}

export interface PendingTransaction extends Transaction {
  syncStatus: 'pending' | 'synced';
}

export const checkInternetConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export const addTransactionToDb = async (transaction: Transaction) => {
  const isConnected = await checkInternetConnection();
  
  if (!isConnected) {
    throw new Error('offline');
  }

  const { amount, category, date, description, title, type, person } = transaction;

  try {
    const transactionRef = collection(db, "transactions");
    const docRef = await addDoc(transactionRef, {
      amount,
      category,
      date,
      description,
      title,
      type,
      person,
    });
    console.log("Transaction added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding transaction: ", error);
    throw error;
  }
};

export const getTransactionsFromDb = async () => {
  try {
    const transactionRef = collection(db, "transactions");
    const querySnapshot = await getDocs(transactionRef);

    const transactions = querySnapshot.docs.map((doc) => doc.data());

    return transactions;
  } catch (error) {
    console.error("Error getting transactions: ", error);
    throw error;
  }
};

export const syncPendingTransactions = async (pendingTransactions: PendingTransaction[]) => {
  const isConnected = await checkInternetConnection();
  
  if (!isConnected) {
    return false;
  }

  try {
    for (const transaction of pendingTransactions) {
      if (transaction.syncStatus === 'pending') {
        await addTransactionToDb(transaction);
      }
    }
    return true;
  } catch (error) {
    console.error("Error syncing transactions: ", error);
    return false;
  }
};

export const deleteTransactionFromDb = async (transactionId: string) => {
  const isConnected = await checkInternetConnection();
  
  if (!isConnected) {
    throw new Error('offline');
  }

  try {
    const transactionRef = collection(db, "transactions");
    const docRef = doc(transactionRef, transactionId);
    await deleteDoc(docRef);

    console.log("Transaction deleted with ID: ", transactionId);
    return true;
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    throw error;
  }
};