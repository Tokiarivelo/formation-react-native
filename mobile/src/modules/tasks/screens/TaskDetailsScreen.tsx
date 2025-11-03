import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TasksStackParamList } from '../../../types/models';
import { useTask, useDeleteTask } from '../hooks/useTasks';
import { theme } from '../../../config/theme';

type Route = RouteProp<TasksStackParamList, 'TaskDetails'>;
type Nav = StackNavigationProp<TasksStackParamList, 'TaskDetails'>;

const TaskDetailsScreen: React.FC = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { data: task, isLoading } = useTask(params.taskId);
  const deleteMutation = useDeleteTask();

  const handleDelete = () => {
    if (!task) return;
    const { Alert } = require('react-native');
    Alert.alert('Supprimer la tâche', 'Cette action est irréversible. Continuer ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try { await deleteMutation.mutateAsync(task.id); navigation.goBack(); }
        catch { Alert.alert('Erreur', 'Suppression impossible'); }
      } }
    ]);
  };

  if (isLoading || !task) {
    return (
      <View style={styles.container}><Text style={styles.meta}>Chargement…</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <View style={styles.card}>
        <Text style={styles.title}>{task.title}</Text>
        {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}
        <View style={styles.rowBetween}>
          <Text style={styles.meta}>Statut: {task.status}</Text>
          <Text style={styles.meta}>Priorité: {task.priority}</Text>
        </View>
        <Text style={[styles.meta, { marginTop: theme.spacing.sm }]}>Échéance: {task.dueDate || '—'}</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('TaskEdit', { taskId: task.id })}>
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={deleteMutation.isPending}>
        <Text style={styles.deleteText}>{deleteMutation.isPending ? 'Suppression…' : 'Supprimer la tâche'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  card: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.xl, padding: theme.spacing.xl, ...theme.shadows.large, marginBottom: theme.spacing.lg },
  title: { fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.sm },
  desc: { color: theme.colors.text.secondary, fontSize: theme.fontSizes.md, marginBottom: theme.spacing.md },
  meta: { color: theme.colors.text.secondary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editBtn: { marginTop: theme.spacing.md, backgroundColor: theme.colors.secondary, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, alignItems: 'center' },
  editText: { color: theme.colors.white, fontWeight: theme.fontWeights.semibold },
  deleteBtn: { marginTop: theme.spacing.lg, backgroundColor: theme.colors.danger, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, alignItems: 'center' },
  deleteText: { color: theme.colors.white, fontWeight: theme.fontWeights.semibold },
});

export default TaskDetailsScreen;



