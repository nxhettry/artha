import { db } from "@/FirebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

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

export const addTransactionToDb = async (transaction: Transaction) => {
  const { amount, category, date, description, title, type, person } =
    transaction;

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
