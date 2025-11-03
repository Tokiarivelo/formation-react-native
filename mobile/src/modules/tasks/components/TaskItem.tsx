/**
 * Composant TaskItem avec observables WatermelonDB
 * Exemple d'utilisation des hooks React Query + WatermelonDB
 */

import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { withObservables } from '@nozbe/with-observables';
// import { Task } from '../../../database/models/Task';
// import { useToggleTaskStatus, useChangeTaskPriority, useDeleteTask } from '../hooks/useTasks';
// import { theme } from '../../../config/theme';

interface TaskItemProps {
  // task: Task;
  onPress?: () => void;
}

const TaskItemComponent: React.FC<TaskItemProps> = () =>
  // { task, onPress }
  {
    return null;
    // const toggleStatusMutation = useToggleTaskStatus();
    // const changePriorityMutation = useChangeTaskPriority();
    // const deleteMutation = useDeleteTask();

    // const handleToggleStatus = () => {
    //   toggleStatusMutation.mutate(task.id);
    // };

    // const handleChangePriority = (priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => {
    //   changePriorityMutation.mutate({ taskId: task.id, priority });
    // };

    // const handleDelete = () => {
    //   Alert.alert(
    //     'Supprimer la tâche',
    //     'Êtes-vous sûr de vouloir supprimer cette tâche ?',
    //     [
    //       { text: 'Annuler', style: 'cancel' },
    //       {
    //         text: 'Supprimer',
    //         style: 'destructive',
    //         onPress: () => deleteMutation.mutate(task.id),
    //       },
    //     ]
    //   );
    // };

    // const getPriorityColor = (priority: string) => {
    //   switch (priority) {
    //     case 'URGENT':
    //       return '#EF4444';
    //     case 'HIGH':
    //       return '#F97316';
    //     case 'MEDIUM':
    //       return '#3B82F6';
    //     case 'LOW':
    //       return '#10B981';
    //     default:
    //       return '#6B7280';
    //   }
    // };

    // const getStatusIcon = (status: string) => {
    //   switch (status) {
    //     case 'TODO':
    //       return '⭕';
    //     case 'IN_PROGRESS':
    //       return '🔄';
    //     case 'DONE':
    //       return '✅';
    //     case 'CANCELLED':
    //       return '❌';
    //     default:
    //       return '⭕';
    //   }
    // };

    // return (
    //   <TouchableOpacity
    //     style={[styles.container, task.isDone && styles.completed]}
    //     onPress={onPress}
    //   >
    //     <TouchableOpacity
    //       style={[styles.statusButton, task.isDone && styles.statusButtonCompleted]}
    //       onPress={handleToggleStatus}
    //       disabled={toggleStatusMutation.isPending}
    //     >
    //       <Text style={styles.statusIcon}>
    //         {getStatusIcon(task.status)}
    //       </Text>
    //     </TouchableOpacity>

    //     <View style={styles.content}>
    //       <Text style={[styles.title, task.isDone && styles.titleCompleted]}>
    //         {task.title}
    //       </Text>

    //       {task.description && (
    //         <Text style={styles.description} numberOfLines={2}>
    //           {task.description}
    //         </Text>
    //       )}

    //       <View style={styles.meta}>
    //         <View
    //           style={[
    //             styles.priority,
    //             { backgroundColor: getPriorityColor(task.priority) },
    //           ]}
    //         >
    //           <Text style={styles.priorityText}>
    //             {task.priority}
    //           </Text>
    //         </View>

    //         {task.dueDate && (
    //           <Text style={[
    //             styles.dueDate,
    //             task.isOverdue && styles.overdue,
    //             task.isDueSoon && styles.dueSoon,
    //           ]}>
    //             {task.dueDate.toLocaleDateString('fr-FR')}
    //           </Text>
    //         )}

    //         {task.isDirty && (
    //           <View style={styles.syncIndicator}>
    //             <Text style={styles.syncText}>⟳</Text>
    //           </View>
    //         )}
    //       </View>
    //     </View>

    //     <View style={styles.actions}>
    //       <TouchableOpacity
    //         style={styles.actionButton}
    //         onPress={() => handleChangePriority('HIGH')}
    //         disabled={changePriorityMutation.isPending}
    //       >
    //         <Text style={styles.actionText}>↑</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         style={styles.actionButton}
    //         onPress={handleDelete}
    //         disabled={deleteMutation.isPending}
    //       >
    //         <Text style={styles.actionText}>🗑️</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </TouchableOpacity>
    // );
  };

// HOC WatermelonDB pour observables automatiques

// const enhance = withObservables(['task'], ({ task }) => ({
//   task: task.observe(),
// }));

// const TaskItem = enhance(TaskItemComponent);
const TaskItem = TaskItemComponent;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     padding: theme.spacing.md,
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.md,
//     marginBottom: theme.spacing.sm,
//     alignItems: 'flex-start',
//     ...theme.shadows.small,
//   },
//   completed: {
//     opacity: 0.6,
//   },
//   statusButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: theme.spacing.md,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: theme.colors.gray[300],
//   },
//   statusButtonCompleted: {
//     backgroundColor: theme.colors.success,
//     borderColor: theme.colors.success,
//   },
//   statusIcon: {
//     fontSize: 16,
//   },
//   content: {
//     flex: 1,
//   },
//   title: {
//     fontSize: theme.fontSizes.lg,
//     fontWeight: theme.fontWeights.semibold,
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.xs,
//   },
//   titleCompleted: {
//     textDecorationLine: 'line-through',
//     color: theme.colors.text.secondary,
//   },
//   description: {
//     fontSize: theme.fontSizes.sm,
//     color: theme.colors.text.secondary,
//     marginBottom: theme.spacing.sm,
//   },
//   meta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   priority: {
//     paddingHorizontal: theme.spacing.sm,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.borderRadius.sm,
//     marginRight: theme.spacing.sm,
//     marginBottom: theme.spacing.xs,
//   },
//   priorityText: {
//     color: theme.colors.white,
//     fontSize: theme.fontSizes.xs,
//     fontWeight: theme.fontWeights.bold,
//   },
//   dueDate: {
//     fontSize: theme.fontSizes.sm,
//     color: theme.colors.text.secondary,
//     marginRight: theme.spacing.sm,
//     marginBottom: theme.spacing.xs,
//   },
//   overdue: {
//     color: theme.colors.danger,
//     fontWeight: theme.fontWeights.bold,
//   },
//   dueSoon: {
//     color: theme.colors.warning,
//     fontWeight: theme.fontWeights.semibold,
//   },
//   syncIndicator: {
//     marginLeft: 'auto',
//     marginBottom: theme.spacing.xs,
//   },
//   syncText: {
//     color: theme.colors.warning,
//     fontSize: theme.fontSizes.sm,
//   },
//   actions: {
//     flexDirection: 'column',
//     marginLeft: theme.spacing.sm,
//   },
//   actionButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: theme.colors.gray[100],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xs,
//   },
//   actionText: {
//     fontSize: theme.fontSizes.sm,
//   },
// });

export default TaskItem;
