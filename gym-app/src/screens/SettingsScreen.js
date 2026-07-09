import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Alert } from 'react-native';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

function SettingsRow({ icon, label, onPress, right }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={right ? 1 : 0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>{right || <Text style={styles.rowChevron}>›</Text>}</View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { settings, updateSettings, wipeHistory } = useApp();

  async function handleClearHistory() {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza? Todos os treinos registrados serão apagados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await wipeHistory();
            Alert.alert('Pronto', 'Histórico apagado com sucesso.');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>

        <Text style={styles.section}>Conta</Text>
        <View style={styles.group}>
          <SettingsRow icon="👤" label="Editar perfil" onPress={() => navigation.navigate('Profile')} />
        </View>

        <Text style={styles.section}>Preferências</Text>
        <View style={styles.group}>
          <SettingsRow
            icon="🔔"
            label="Notificações"
            right={
              <Switch
                value={settings.notifications}
                onValueChange={async (v) => updateSettings({ ...settings, notifications: v })}
                thumbColor={settings.notifications ? colors.primary : colors.textMuted}
                trackColor={{ false: colors.border, true: colors.primary + '55' }}
              />
            }
          />
        </View>

        <Text style={styles.section}>Dados</Text>
        <View style={styles.group}>
          <SettingsRow icon="🗑️" label="Limpar histórico" onPress={handleClearHistory} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginBottom: spacing.lg },
  section: { color: colors.textMuted, fontSize: font.sm, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.xs, marginTop: spacing.md },
  group: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { fontSize: 20, marginRight: spacing.md },
  rowLabel: { flex: 1, color: colors.text, fontSize: font.md },
  rowRight: {},
  rowChevron: { color: colors.textMuted, fontSize: font.xl },
});
