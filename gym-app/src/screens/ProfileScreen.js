import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, TextInput, Alert, Image, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';
import { auth, storage } from '../firebase';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, stats, signOut, authUser } = useApp();
  const [editVisible, setEditVisible] = useState(false);
  const [form, setForm] = useState({ name: '', weight: '', height: '', age: '' });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  function openEdit() {
    setForm({
      name: user?.name ?? '',
      weight: user?.weight ?? '',
      height: user?.height ?? '',
      age: user?.age ?? '',
    });
    setEditVisible(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      Alert.alert('Campo obrigatório', 'O nome não pode estar vazio.');
      return;
    }
    await updateUser({ ...user, ...form, name: form.name.trim() });
    setEditVisible(false);
  }

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para trocar a foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (result.canceled) return;

    setUploadingPhoto(true);
    try {
      const uri = result.assets[0].uri;
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new Error('Upload falhou'));
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const uid = authUser.uid;
      const storageRef = ref(storage, `users/${uid}/avatar`);
      await uploadBytes(storageRef, blob);
      blob.close?.();

      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      await updateUser({ ...user, photoURL });
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar a foto. Tente novamente.');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigation.getParent()?.getParent()?.replace('Login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickPhoto} disabled={uploadingPhoto} activeOpacity={0.8}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraBtn}>
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.cameraBtnText}>📷</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name || 'Sem nome'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user?.weight || '—'}</Text>
            <Text style={styles.statLabel}>Peso (kg)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user?.height || '—'}</Text>
            <Text style={styles.statLabel}>Altura (cm)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user?.age || '—'}</Text>
            <Text style={styles.statLabel}>Anos</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Treinos</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Sequência</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={openEdit} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>✏️</Text>
              <Text style={styles.menuLabel}>Editar perfil</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuLabel}>Configurações</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>➥ Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            {[
              { label: 'Nome', key: 'name', placeholder: 'Seu nome', keyboard: 'default' },
              { label: 'Peso (kg)', key: 'weight', placeholder: '70', keyboard: 'numeric' },
              { label: 'Altura (cm)', key: 'height', placeholder: '175', keyboard: 'numeric' },
              { label: 'Idade', key: 'age', placeholder: '25', keyboard: 'numeric' },
            ].map((field) => (
              <View key={field.key}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textMuted}
                  value={form[field.key]}
                  onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                />
              </View>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
                <Text style={styles.confirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: 88, height: 88, borderRadius: 44 },
  avatarText: { color: '#fff', fontSize: font.xxl, fontWeight: '800' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  cameraBtnText: { fontSize: 14 },
  name: { color: colors.text, fontSize: font.lg, fontWeight: '700', marginTop: spacing.md },
  email: { color: colors.textSecondary, fontSize: font.sm, marginTop: 2 },
  statsContainer: { backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: spacing.lg, flexDirection: 'row', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: font.xl, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: font.sm, marginTop: 2 },
  divider: { width: 1, height: '80%', backgroundColor: colors.border },
  menu: { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { fontSize: 20, marginRight: spacing.md },
  menuLabel: { color: colors.text, fontSize: font.md },
  menuChevron: { color: colors.textMuted, fontSize: font.xl },
  logoutBtn: { backgroundColor: colors.error, borderRadius: radius.md, paddingVertical: spacing.lg, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: font.md, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, paddingBottom: spacing.xxl },
  modalTitle: { color: colors.text, fontSize: font.lg, fontWeight: '800', marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: font.sm, marginBottom: spacing.xs, marginTop: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.md, color: colors.text, fontSize: font.md, borderWidth: 1, borderColor: colors.border },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  cancelBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.card, alignItems: 'center' },
  cancelText: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  confirmBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' },
  confirmText: { color: '#fff', fontSize: font.md, fontWeight: '700' },
});
