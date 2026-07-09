import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

const ICONS = ['💪', '🦵', '🏋️', '🔝', '⚡', '🔥', '🏃', '🤸'];
const EX_ICONS = ['💪', '🦵', '🏋️', '🔝', '⚡', '🔥', '🤸', '🧗', '🏊', '🚴'];
const CATEGORIES = ['Força', 'Hipertrofia', 'Cardio', 'Funcional'];

function WorkoutCard({ item, onPress, onEdit }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardMain} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardContent}>
          <View style={styles.cardIcon}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDetails}>{item.exercises} exercícios • {item.time} min</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editCardBtn} onPress={onEdit} activeOpacity={0.7}>
        <Text style={styles.editCardText}>✏️</Text>
      </TouchableOpacity>
    </View>
  );
}

function ExerciseForm({ exName, setExName, exSets, setExSets, exReps, setExReps, exIcon, setExIcon, onAdd }) {
  return (
    <View style={styles.addExForm}>
      <TextInput
        style={styles.input}
        placeholder="Nome do exercício"
        placeholderTextColor={colors.textMuted}
        value={exName}
        onChangeText={setExName}
      />
      <View style={styles.exNumRow}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Séries"
          placeholderTextColor={colors.textMuted}
          value={exSets}
          onChangeText={setExSets}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Reps"
          placeholderTextColor={colors.textMuted}
          value={exReps}
          onChangeText={setExReps}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.iconRowSmall}>
        {EX_ICONS.map((ic) => (
          <TouchableOpacity
            key={ic}
            style={[styles.iconBtnSm, exIcon === ic && styles.iconBtnActive]}
            onPress={() => setExIcon(ic)}
          >
            <Text style={styles.iconBtnText}>{ic}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.addExBtn} onPress={onAdd} activeOpacity={0.7}>
        <Text style={styles.addExBtnText}>+ Adicionar exercício</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WorkoutScreen({ navigation }) {
  const { workouts, addWorkout, updateWorkout, removeWorkout } = useApp();

  // Create modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Força');
  const [newTime, setNewTime] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💪');
  const [newExList, setNewExList] = useState([]);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('');
  const [newExReps, setNewExReps] = useState('');
  const [newExIcon, setNewExIcon] = useState('💪');

  // Edit modal state
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Força');
  const [editTime, setEditTime] = useState('');
  const [editIcon, setEditIcon] = useState('💪');
  const [editExList, setEditExList] = useState([]);
  const [editExName, setEditExName] = useState('');
  const [editExSets, setEditExSets] = useState('');
  const [editExReps, setEditExReps] = useState('');
  const [editExIcon, setEditExIcon] = useState('💪');

  function addNewExercise() {
    if (!newExName.trim()) return;
    const ex = {
      id: Date.now().toString(),
      name: newExName.trim(),
      sets: parseInt(newExSets) || 3,
      reps: parseInt(newExReps) || 10,
      icon: newExIcon,
    };
    setNewExList((prev) => [...prev, ex]);
    setNewExName('');
    setNewExSets('');
    setNewExReps('');
    setNewExIcon('💪');
  }

  function removeNewExercise(index) {
    setNewExList((prev) => prev.filter((_, i) => i !== index));
  }

  function addEditExercise() {
    if (!editExName.trim()) return;
    const ex = {
      id: Date.now().toString(),
      name: editExName.trim(),
      sets: parseInt(editExSets) || 3,
      reps: parseInt(editExReps) || 10,
      icon: editExIcon,
    };
    setEditExList((prev) => [...prev, ex]);
    setEditExName('');
    setEditExSets('');
    setEditExReps('');
    setEditExIcon('💪');
  }

  function removeEditExercise(index) {
    setEditExList((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAddWorkout() {
    if (!newName.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do treino.');
      return;
    }
    const time = parseInt(newTime) || 30;
    const workout = {
      id: Date.now().toString(),
      name: newName.trim(),
      exercises: newExList.length,
      time,
      category: newCategory,
      icon: selectedIcon,
      exerciseList: newExList,
    };
    await addWorkout(workout);
    setNewName('');
    setNewCategory('Força');
    setNewTime('');
    setSelectedIcon('💪');
    setNewExList([]);
    setModalVisible(false);
  }

  function openEdit(item) {
    setEditingWorkout(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditTime(item.time.toString());
    setEditIcon(item.icon);
    setEditExList(item.exerciseList ?? []);
    setEditExName('');
    setEditExSets('');
    setEditExReps('');
    setEditExIcon('💪');
  }

  async function handleSaveEdit() {
    if (!editName.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do treino.');
      return;
    }
    const updated = {
      ...editingWorkout,
      name: editName.trim(),
      category: editCategory,
      time: parseInt(editTime) || 30,
      icon: editIcon,
      exercises: editExList.length,
      exerciseList: editExList,
    };
    await updateWorkout(updated);
    setEditingWorkout(null);
  }

  function handleDeleteWorkout() {
    Alert.alert(
      'Excluir treino',
      `Tem certeza que deseja excluir "${editingWorkout.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removeWorkout(editingWorkout.id);
            setEditingWorkout(null);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={workouts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Meus Treinos</Text>
            <Text style={styles.subtitle}>Escolha seu treino de hoje</Text>
          </View>
        }
        renderItem={({ item }) => (
          <WorkoutCard
            item={item}
            onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
            onEdit={() => openEdit(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ Adicionar novo treino</Text>
          </TouchableOpacity>
        }
      />

      {/* Create modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Novo Treino</Text>

              <Text style={styles.label}>Nome do treino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Treino de Costas"
                placeholderTextColor={colors.textMuted}
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.label}>Duração (min)</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor={colors.textMuted}
                value={newTime}
                onChangeText={setNewTime}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categories}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catBtn, newCategory === cat && styles.catBtnActive]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text style={[styles.catText, newCategory === cat && styles.catTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Ícone do Treino</Text>
              <View style={styles.iconRow}>
                {ICONS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={[styles.iconBtn, selectedIcon === ic && styles.iconBtnActive]}
                    onPress={() => setSelectedIcon(ic)}
                  >
                    <Text style={styles.iconBtnText}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Exercícios</Text>
              {newExList.map((ex, i) => (
                <View key={ex.id} style={styles.exRow}>
                  <Text style={styles.exIconText}>{ex.icon}</Text>
                  <View style={styles.exInfo}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exDetail}>{ex.sets} séries × {ex.reps} reps</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeNewExercise(i)} style={styles.exDeleteBtn}>
                    <Text style={styles.exDelete}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <ExerciseForm
                exName={newExName} setExName={setNewExName}
                exSets={newExSets} setExSets={setNewExSets}
                exReps={newExReps} setExReps={setNewExReps}
                exIcon={newExIcon} setExIcon={setNewExIcon}
                onAdd={addNewExercise}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleAddWorkout}>
                  <Text style={styles.confirmText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit modal */}
      <Modal visible={!!editingWorkout} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Editar Treino</Text>

              <Text style={styles.label}>Nome do treino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Treino de Costas"
                placeholderTextColor={colors.textMuted}
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={styles.label}>Duração (min)</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor={colors.textMuted}
                value={editTime}
                onChangeText={setEditTime}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categories}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catBtn, editCategory === cat && styles.catBtnActive]}
                    onPress={() => setEditCategory(cat)}
                  >
                    <Text style={[styles.catText, editCategory === cat && styles.catTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Ícone do Treino</Text>
              <View style={styles.iconRow}>
                {ICONS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={[styles.iconBtn, editIcon === ic && styles.iconBtnActive]}
                    onPress={() => setEditIcon(ic)}
                  >
                    <Text style={styles.iconBtnText}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Exercícios</Text>
              {editExList.map((ex, i) => (
                <View key={ex.id} style={styles.exRow}>
                  <Text style={styles.exIconText}>{ex.icon}</Text>
                  <View style={styles.exInfo}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exDetail}>{ex.sets} séries × {ex.reps} reps</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeEditExercise(i)} style={styles.exDeleteBtn}>
                    <Text style={styles.exDelete}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <ExerciseForm
                exName={editExName} setExName={setEditExName}
                exSets={editExSets} setExSets={setEditExSets}
                exReps={editExReps} setExReps={setEditExReps}
                exIcon={editExIcon} setExIcon={setEditExIcon}
                onAdd={addEditExercise}
              />

              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteWorkout}>
                <Text style={styles.deleteText}>🗑 Excluir treino</Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingWorkout(null)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleSaveEdit}>
                  <Text style={styles.confirmText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: colors.textSecondary, fontSize: font.md, marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' },
  cardMain: { flex: 1, padding: spacing.md },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { width: 50, height: 50, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  icon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardName: { color: colors.text, fontSize: font.md, fontWeight: '700' },
  cardDetails: { color: colors.textSecondary, fontSize: font.sm },
  cardCategory: { color: colors.primary, fontSize: font.sm, marginTop: 2, fontWeight: '600' },
  chevron: { color: colors.textMuted, fontSize: font.xxl },
  editCardBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.lg },
  editCardText: { fontSize: 18 },
  addBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.lg, alignItems: 'center', marginTop: spacing.md },
  addBtnText: { color: colors.primary, fontSize: font.md, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, paddingBottom: spacing.xxl, maxHeight: '90%' },
  modalTitle: { color: colors.text, fontSize: font.lg, fontWeight: '800', marginBottom: spacing.lg },
  label: { color: colors.textSecondary, fontSize: font.sm, marginBottom: spacing.xs, marginTop: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.md, color: colors.text, fontSize: font.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  inputHalf: { flex: 1 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  catBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  catBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catText: { color: colors.textSecondary, fontSize: font.sm },
  catTextActive: { color: '#fff', fontWeight: '700' },
  iconRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  iconBtn: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  iconBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  iconBtnText: { fontSize: 20 },
  iconRowSmall: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm, flexWrap: 'wrap' },
  iconBtnSm: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  // Exercise list
  exRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.sm, marginBottom: spacing.xs, borderWidth: 1, borderColor: colors.border },
  exIconText: { fontSize: 22, marginRight: spacing.sm },
  exInfo: { flex: 1 },
  exName: { color: colors.text, fontSize: font.sm, fontWeight: '600' },
  exDetail: { color: colors.textSecondary, fontSize: font.sm },
  exDeleteBtn: { padding: spacing.xs },
  exDelete: { color: colors.error, fontSize: font.md, fontWeight: '700' },
  // Add exercise form
  addExForm: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  exNumRow: { flexDirection: 'row', gap: spacing.sm },
  addExBtn: { backgroundColor: colors.primaryLight, borderRadius: radius.sm, paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.xs },
  addExBtnText: { color: colors.primary, fontSize: font.sm, fontWeight: '700' },
  deleteBtn: { paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm, borderRadius: radius.md, backgroundColor: colors.errorLight },
  deleteText: { color: colors.error, fontSize: font.md, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  cancelBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.card, alignItems: 'center' },
  cancelText: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  confirmBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' },
  confirmText: { color: '#fff', fontSize: font.md, fontWeight: '700' },
});
