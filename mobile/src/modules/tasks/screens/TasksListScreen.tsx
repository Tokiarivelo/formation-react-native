/**
 * Écran de liste des tâches
 * Exemple d'utilisation des hooks React Query + WatermelonDB
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { theme } from '../../../config/theme';
import { TasksStackParamList } from '../../../types/models';
import { useSyncStatus } from '../../projects/hooks/useProjects';
import { useTasks, useTaskStats } from '../hooks/useTasks';

interface TasksListScreenProps {
  projectId?: string;
}

type Nav = StackNavigationProp<TasksStackParamList, 'TasksList'>;

const TasksListScreen: React.FC<TasksListScreenProps> = ({ projectId }) => {
  const navigation = useNavigation<Nav>();
  const [filters, setFilters] = useState({
    projectId,
    status: undefined as string | undefined,
    priority: undefined as string | undefined,
  });

  // Hooks pour les données
  const { data: tasks, isLoading, refetch } = useTasks(filters);
  const { data: stats } = useTaskStats(projectId);
  const { data: syncStatus } = useSyncStatus();

  const handleCreateTask = () => {
    navigation.navigate('TaskEdit', { taskId: undefined as any });
  };

  const handleFilterChange = (filterType: 'status' | 'priority', value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const renderTask = ({ item: task }: { item: any }) => (
    <TouchableOpacity
      style={{ backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, marginBottom: theme.spacing.sm, ...theme.shadows.small }}
      onPress={() => navigation.navigate('TaskDetails', { taskId: task.id })}
    >
      <Text style={{ color: theme.colors.text.primary, fontWeight: theme.fontWeights.semibold }}>{task.title}</Text>
      {task.description ? (
        <Text style={{ color: theme.colors.text.secondary, marginTop: 4 }} numberOfLines={2}>{task.description}</Text>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: theme.colors.text.secondary }}>Statut: {task.status}</Text>
        <Text style={{ color: theme.colors.text.secondary }}>Priorité: {task.priority}</Text>
      </View>
    </TouchableOpacity>
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

