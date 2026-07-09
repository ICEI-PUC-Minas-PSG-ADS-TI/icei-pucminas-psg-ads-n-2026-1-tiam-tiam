import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, spacing } from '../theme';
import { useApp } from '../context/AppContext';

export default function SplashScreen({ navigation }) {
  const { authUser, authLoading } = useApp();

  useEffect(() => {
    if (authLoading) return;
    const t = setTimeout(() => {
      if (authUser) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [authLoading, authUser]);

  return (
    <LinearGradient colors={['#09090F', '#0D1530']} style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>🏋️</Text>
      </View>
      <Text style={styles.title}>FIT TRACK</Text>
      <Text style={styles.subtitle}>Treine. Evolua. Supere.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 36,
    elevation: 20,
  },
  icon: { fontSize: 58 },
  title: {
    color: colors.text,
    fontSize: font.xxxl,
    fontWeight: '900',
    letterSpacing: 5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: font.md,
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
});
