import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';

const sampleExercises = [
  { id: '1', name: 'Supino', reps: '8-12' },
  { id: '2', name: 'Agachamento', reps: '6-10' },
  { id: '3', name: 'Levantamento Terra', reps: '4-6' }
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>Treinos</Text>
      <FlatList
        data={sampleExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={() => navigation.navigate('Workout', { exercise: item })} />
        )}
      />
      <Button title="Perfil" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}
