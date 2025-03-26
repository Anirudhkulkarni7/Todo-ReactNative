import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  time: string;
}

export default function HomeScreen() {
  // Header animations
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;
  
  // Tasks list fade animation
  const tasksFadeAnim = useRef(new Animated.Value(1)).current;
  
  // Modal animation for adding task
  const addModalAnim = useRef(new Animated.Value(300)).current;
  
  // State for tasks (initially empty, will load from AsyncStorage)
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal state for adding task
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  
  // Inline editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState('');
  const [editedCategory, setEditedCategory] = useState<string>('');
  const [editedTaskTime, setEditedTaskTime] = useState('');
  
  // Available categories
  const categories = ['All', 'Personal', 'Work', 'Shopping', 'Fitness'];
  
  // Animate header on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFadeAnim, headerSlideAnim]);
  
  // Animate tasks list fade when filters change
  useEffect(() => {
    tasksFadeAnim.setValue(0);
    Animated.timing(tasksFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [selectedCategory, statusFilter]);
  
  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('@tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.log('Error loading tasks from storage', error);
      }
    };
    loadTasks();
  }, []);
  
  // Save tasks to AsyncStorage whenever tasks change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
      } catch (error) {
        console.log('Error saving tasks', error);
      }
    };
    saveTasks();
  }, [tasks]);
  
  // Filter tasks by status and category
  const filteredTasks = tasks.filter(task => {
    const statusMatch =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Active'
        ? !task.completed
        : task.completed;
    const categoryMatch = selectedCategory === 'All' || task.category === selectedCategory;
    return statusMatch && categoryMatch;
  });
  
  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  // Update a task (inline editing)
  const updateTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, title: editedTask, category: editedCategory, time: editedTaskTime } : task
      )
    );
    setEditingTaskId(null);
    setEditedTask('');
    setEditedCategory('');
    setEditedTaskTime('');
  };
  
  // Open Add Task modal
  const openAddModal = () => {
    setShowAddModal(true);
    addModalAnim.setValue(300);
    Animated.timing(addModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  // Close Add Task modal
  const closeAddModal = () => {
    Animated.timing(addModalAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAddModal(false);
      setNewTask('');
      setNewTaskTime('');
    });
  };
  
  // Add new task from modal
  const addNewTask = () => {
    if (newTask.trim().length === 0) return;
    const newId = (tasks.length + 1).toString();
    const taskCategory = selectedCategory === 'All' ? 'Personal' : selectedCategory;
    setTasks([{ id: newId, title: newTask, completed: false, category: taskCategory, time: newTaskTime }, ...tasks]);
    closeAddModal();
  };
  
  // Render a single task item
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItemContainer}>
      <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskItem}>
        <View style={styles.checkbox}>
          {item.completed && <Ionicons name="checkmark" size={20} color={theme.colors.white} />}
        </View>
        <View style={styles.taskDetails}>
          {editingTaskId === item.id ? (
            <>
              <TextInput
                style={[styles.taskText, styles.editableTaskText]}
                value={editedTask}
                onChangeText={setEditedTask}
                placeholder="Edit task..."
                placeholderTextColor={theme.colors.textSecondary}
              />
              <TextInput
                style={[styles.taskText, styles.editableTaskText]}
                value={editedTaskTime}
                onChangeText={setEditedTaskTime}
                placeholder="Edit time..."
                placeholderTextColor={theme.colors.textSecondary}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.inlineCategoryScroll}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setEditedCategory(cat)}
                    style={[
                      styles.inlineCategoryButton,
                      editedCategory === cat && styles.inlineActiveCategoryButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.inlineCategoryText,
                        editedCategory === cat && styles.inlineActiveCategoryText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
              <Text style={styles.taskCategory}>{item.category}</Text>
              <Text style={styles.taskTime}>{item.time}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.taskActions}>
        {editingTaskId === item.id ? (
          <TouchableOpacity onPress={() => updateTask(item.id)} style={styles.actionButton}>
            <Ionicons name="checkmark-done-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setEditingTaskId(item.id);
              setEditedTask(item.title);
              setEditedCategory(item.category);
              setEditedTaskTime(item.time);
            }}
            style={styles.actionButton}
          >
            <Ionicons name="pencil-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Animated Gradient Header */}
      <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.header}>
        <Animated.View style={{ opacity: headerFadeAnim, transform: [{ translateY: headerSlideAnim }] }}>
          <Text style={styles.greeting}>Hello, Welcome!</Text>
          <Text style={styles.subGreeting}>Organize your tasks in style.</Text>
        </Animated.View>
      </LinearGradient>
  
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Categories Filter in two rows */}
        <Text style={styles.filterLabel}>Categories</Text>
        <View style={styles.categoryWrapperGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.activeCategoryButton]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* Status Filter */}
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.filterContainer}>
          {['All', 'Active', 'Completed'].map(type => (
            <TouchableOpacity 
              key={type} 
              style={[styles.filterButton, statusFilter === type && styles.activeFilter]}
              onPress={() => setStatusFilter(type as 'All' | 'Active' | 'Completed')}
            >
              <Text style={[styles.filterText, statusFilter === type && styles.activeFilterText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* Task List */}
        <Animated.View style={{ opacity: tasksFadeAnim }}>
          <FlatList 
            data={filteredTasks}
            keyExtractor={item => item.id}
            renderItem={renderTask}
            contentContainerStyle={styles.taskList}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>
  
      {/* Floating Action Button for Adding Task */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={32} color={theme.colors.white} />
      </TouchableOpacity>
  
      {/* Modal for Adding Task */}
      <Modal transparent visible={showAddModal} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: addModalAnim }] }]}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <View style={styles.modalInputContainer}>
              <TextInput 
                style={styles.modalInput}
                placeholder="Enter task description..."
                placeholderTextColor={theme.colors.textSecondary}
                value={newTask}
                onChangeText={setNewTask}
              />
            </View>
            <View style={styles.modalInputContainer}>
              <TextInput 
                style={styles.modalInput}
                placeholder="Enter task time (e.g., 3:00 PM)..."
                placeholderTextColor={theme.colors.textSecondary}
                value={newTaskTime}
                onChangeText={setNewTaskTime}
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={addNewTask}>
                <Ionicons name="checkmark-circle-outline" size={28} color={theme.colors.white} />
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeAddModal}>
                <Ionicons name="close-circle-outline" size={28} color={theme.colors.white} />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  filterLabel: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    marginVertical: 5,
  },
  // New grid wrapper for categories (using flexWrap)
  categoryWrapperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'flex-start',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 2, // for consistent spacing

     borderRadius: 20,
    backgroundColor: theme.colors.white,
    width: '30%', // fixed width instead of minWidth
    alignItems: 'center',
  },
  activeCategoryButton: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  activeCategoryText: {
    color: theme.colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
  },
  activeFilter: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  activeFilterText: {
    color: theme.colors.white,
  },
  taskList: {
    paddingBottom: theme.spacing.lg,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  taskItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    backgroundColor: theme.colors.primary,
  },
  taskDetails: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  editableTaskText: {
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
    color: '#000',
    marginBottom: 5,
  },
  taskCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  taskTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  inlineCategoryScroll: {
    marginTop: 5,
  },
  inlineCategoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 5,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  inlineActiveCategoryButton: {
    backgroundColor: theme.colors.primary,
  },
  inlineCategoryText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  inlineActiveCategoryText: {
    color: theme.colors.white,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.colors.button,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalInputContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    height: 40,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
  },
  modalButtonText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  footerText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
  },
});
