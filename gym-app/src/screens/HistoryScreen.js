import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

function HistoryItem({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardNote}>{item.note}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.cardStats}>
          <Text style={styles.cardStat}>🔥 {item.kcal} kcal</Text>
          <Text style={styles.cardStat}>⚙️ {item.sets} sets</Text>
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { history } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={history}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Histórico</Text>}
        renderItem={({ item }) => <HistoryItem item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyText}>Nenhum treino registrado ainda.</Text>
            <Text style={styles.emptySubtext}>Complete um treino para ver seu histórico aqui.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, flexGrow: 1 },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  cardLeft: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardIcon: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardNote: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  cardDate: { color: colors.textMuted, fontSize: font.sm, marginTop: 2 },
  cardStats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  cardStat: { color: colors.textSecondary, fontSize: font.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { color: colors.text, fontSize: font.lg, fontWeight: '700', marginBottom: spacing.sm },
  emptySubtext: { color: colors.textSecondary, fontSize: font.md, textAlign: 'center' },
});
