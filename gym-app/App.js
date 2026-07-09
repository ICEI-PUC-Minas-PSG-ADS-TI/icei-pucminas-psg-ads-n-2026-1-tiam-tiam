import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import StatsScreen from './src/screens/StatsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DashStack = createNativeStackNavigator();
const WorkStack = createNativeStackNavigator();
const MissStack = createNativeStackNavigator();
const StatStack = createNativeStackNavigator();
const ProfStack = createNativeStackNavigator();

const stackOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700', color: colors.text },
  headerShadowVisible: false,
};

function DashboardStackNav() {
  return (
    <DashStack.Navigator screenOptions={stackOptions}>
      <DashStack.Screen name="DashboardMain" component={DashboardScreen} options={{ headerShown: false }} />
      <DashStack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
    </DashStack.Navigator>
  );
}

function WorkoutStackNav() {
  return (
    <WorkStack.Navigator screenOptions={stackOptions}>
      <WorkStack.Screen name="WorkoutMain" component={WorkoutScreen} options={{ headerShown: false }} />
      <WorkStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: 'Detalhes' }} />
    </WorkStack.Navigator>
  );
}

function MissionsStackNav() {
  return (
    <MissStack.Navigator screenOptions={stackOptions}>
      <MissStack.Screen name="MissionsMain" component={MissionsScreen} options={{ headerShown: false }} />
    </MissStack.Navigator>
  );
}

function StatsStackNav() {
  return (
    <StatStack.Navigator screenOptions={stackOptions}>
      <StatStack.Screen name="StatsMain" component={StatsScreen} options={{ headerShown: false }} />
    </StatStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfStack.Navigator screenOptions={stackOptions}>
      <ProfStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </ProfStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size, focused }) => {
          const icons = {
            Dashboard: '🏠',
            Workout: '💪',
            Missions: '🏆',
            Stats: '📊',
            Profile: '👤',
          };
          return <Text style={{ fontSize: focused ? size + 2 : size }}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackNav} options={{ title: 'Início' }} />
      <Tab.Screen name="Workout" component={WorkoutStackNav} options={{ title: 'Treinos' }} />
      <Tab.Screen name="Missions" component={MissionsStackNav} options={{ title: 'Missões' }} />
      <Tab.Screen name="Stats" component={StatsStackNav} options={{ title: 'Stats' }} />
      <Tab.Screen name="Profile" component={ProfileStackNav} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Main" component={MainTabs} />
        </RootStack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </AppProvider>
  );
}
