import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, spacing, radius } from '../theme';

const features = [
  { icon: '💪', text: 'Crie e organize seus treinos' },
  { icon: '📊', text: 'Acompanhe seu progresso' },
  { icon: '🗓️', text: 'Histórico completo de sessões' },
];

export default function OnboardingScreen({ navigation }) {
  return (
    <LinearGradient colors={['#09090F', '#0D1530']} style={styles.container}>
      <Text style={styles.emoji}>🏋️</Text>
      <Text style={styles.title}>Bem-vindo ao{`\n`}Fit Track</Text>
      <Text style={styles.subtitle}>Seu parceiro de treino no bolso.</Text>
      <View style={styles.featuresBox}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.btnText}>Começar agora →</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  emoji: { fontSize: 72, textAlign: 'center', marginBottom: spacing.md },
  title: {
    color: colors.text,
    fontSize: font.xxl,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: font.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featuresBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  featureIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureIcon: { fontSize: 20 },
  featureText: { color: colors.text, fontSize: font.md },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  btnText: { color: '#fff', fontSize: font.lg, fontWeight: '700' },
});
