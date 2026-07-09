import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

const AUTH_ERRORS = {
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/email-already-in-use': 'Este email já está cadastrado.',
  'auth/invalid-email': 'Email inválido.',
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
};

export default function LoginScreen({ navigation }) {
  const { signIn, signUp } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isRegister && !name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu nome.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Informe um email válido.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha fraca', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(name.trim(), email.trim().toLowerCase(), password);
      } else {
        await signIn(email.trim().toLowerCase(), password);
      }
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Erro', AUTH_ERRORS[err.code] ?? 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#09090F', '#0D1530']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Text style={styles.logo}>🏋️</Text>
          </View>
          <Text style={styles.title}>{isRegister ? 'Criar conta' : 'Entrar'}</Text>
          <Text style={styles.subtitle}>{isRegister ? 'Comece sua jornada!' : 'Bem-vindo de volta!'}</Text>

          <View style={styles.form}>
            {isRegister && (
              <>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </>
            )}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.toggle} onPress={() => setIsRegister((v) => !v)}>
            <Text style={styles.toggleText}>
              {isRegister ? 'Já tenho conta · ' : 'Não tenho conta · '}
              <Text style={styles.toggleLink}>{isRegister ? 'Entrar' : 'Criar conta'}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '50',
  },
  logo: { fontSize: 46, textAlign: 'center' },
  title: { color: colors.text, fontSize: font.xxl, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: font.md, textAlign: 'center', marginBottom: spacing.xl },
  form: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.textSecondary, fontSize: font.sm, marginBottom: spacing.xs, marginTop: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.md, color: colors.text, fontSize: font.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  btn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.md + 2, alignItems: 'center', marginTop: spacing.md, shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8 },
  btnText: { color: '#fff', fontSize: font.lg, fontWeight: '700' },
  toggle: { alignItems: 'center', marginTop: spacing.xl },
  toggleText: { color: colors.textSecondary, fontSize: font.md },
  toggleLink: { color: colors.primary, fontWeight: '700' },
});
