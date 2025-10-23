/**
 * Écran de liste des tâches
 * Exemple d'utilisation des hooks React Query + WatermelonDB
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTasks, useCreateTask, useTaskStats } from '../hooks/useTasks';
import { useSyncStatus } from '../../projects/hooks/useProjects';
import TaskItem from '../components/TaskItem';
import { theme } from '../../../config/theme';

interface TasksListScreenProps {
  projectId?: string;
}

const TasksListScreen: React.FC<TasksListScreenProps> = ({ projectId }) => {
  const [filters, setFilters] = useState({
    projectId,
    status: undefined as string | undefined,
    priority: undefined as string | undefined,
  });

  // Hooks pour les données
  const { data: tasks, isLoading, refetch } = useTasks(filters);
  const { data: stats } = useTaskStats(projectId);
  const { data: syncStatus } = useSyncStatus();
  
  // Hooks pour les mutations
  const createTaskMutation = useCreateTask();

  const handleCreateTask = () => {
    Alert.prompt(
      'Nouvelle tâche',
      'Entrez le titre de la tâche',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Créer',
          onPress: (title) => {
            if (title && projectId) {
              createTaskMutation.mutate({
                title,
                projectId,
                status: 'TODO',
                priority: 'MEDIUM',
              });
            }
          },
        },
      ]
    );
  };

  const handleFilterChange = (filterType: 'status' | 'priority', value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const renderTask = ({ item: task }: { item: any }) => (
    <TaskItem
      task={task}
      onPress={() => {
        // Navigation vers les détails de la tâche
        console.log('Navigation vers tâche:', task.id);
      }}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Tâches</Text>
      
      {stats && (
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {stats.total} tâches • {stats.done} terminées
          </Text>
          {stats.overdue > 0 && (
            <Text style={styles.overdueText}>
              {stats.overdue} en retard
            </Text>
          )}
        </View>
      )}

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, !filters.status && styles.filterButtonActive]}
          onPress={() => handleFilterChange('status', undefined)}
        >
          <Text style={[styles.filterText, !filters.status && styles.filterTextActive]}>
            Toutes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filters.status === 'TODO' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('status', 'TODO')}
        >
          <Text style={[styles.filterText, filters.status === 'TODO' && styles.filterTextActive]}>
            À faire
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filters.status === 'IN_PROGRESS' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('status', 'IN_PROGRESS')}
        >
          <Text style={[styles.filterText, filters.status === 'IN_PROGRESS' && styles.filterTextActive]}>
            En cours
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filters.status === 'DONE' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('status', 'DONE')}
        >
          <Text style={[styles.filterText, filters.status === 'DONE' && styles.filterTextActive]}>
            Terminées
          </Text>
        </TouchableOpacity>
      </View>

      {syncStatus && (
        <View style={styles.syncStatus}>
          <Text style={styles.syncText}>
            {syncStatus.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
            {syncStatus.pendingMutations > 0 && ` • ${syncStatus.pendingMutations} en attente`}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucune tâche trouvée</Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
        <Text style={styles.createButtonText}>Créer une tâche</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks || []}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={handleCreateTask}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  listContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statsText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.md,
  },
  overdueText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.semibold,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeights.medium,
  },
  filterTextActive: {
    color: theme.colors.white,
  },
  syncStatus: {
    alignItems: 'center',
  },
  syncText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
  },
  fabText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
  },
});

export default TasksListScreen;

