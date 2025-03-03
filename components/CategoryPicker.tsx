"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Category } from "@/context/Transactioncontext"
import React from "react"

interface CategoryPickerProps {
  categories: Category[]
  selectedCategory: Category
  onSelectCategory: (category: Category) => void
  onAddCategory: (name: string) => Promise<Category>
}

export default function CategoryPicker({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: CategoryPickerProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name")
      return
    }

    try {
      const category = await onAddCategory(newCategoryName)
      onSelectCategory(category)
      setNewCategoryName("")
      setShowAddForm(false)
    } catch (error) {
      Alert.alert("Error", "Failed to add category")
      console.error(error)
    }
  }

  return (
    <View>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text>{selectedCategory?.name || "Select a category"}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false)
                  setShowAddForm(false)
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {showAddForm ? (
              <View style={styles.addForm}>
                <TextInput
                  style={styles.input}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Enter category name"
                  autoFocus
                />
                <View style={styles.addFormButtons}>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAddForm(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddCategory}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.categoryItem, selectedCategory?.id === item.id && styles.selectedCategoryItem]}
                      onPress={() => {
                        onSelectCategory(item)
                        setModalVisible(false)
                      }}
                    >
                      <Text
                        style={[styles.categoryText, selectedCategory?.id === item.id && styles.selectedCategoryText]}
                      >
                        {item.name}
                      </Text>
                      {selectedCategory?.id === item.id && <Ionicons name="checkmark" size={20} color="white" />}
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.addCategoryButton} onPress={() => setShowAddForm(true)}>
                  <Ionicons name="add" size={20} color="#3498db" />
                  <Text style={styles.addCategoryText}>Add New Category</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCategoryItem: {
    backgroundColor: "#3498db",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "500",
  },
  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addCategoryText: {
    marginLeft: 8,
    color: "#3498db",
    fontSize: 16,
  },
  addForm: {
    marginVertical: 15,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  addFormButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  addButton: {
    backgroundColor: "#3498db",
  },
  cancelButtonText: {
    color: "#333",
  },
  addButtonText: {
    color: "white",
  },
})

