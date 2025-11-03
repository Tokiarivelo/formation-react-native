import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TasksStackParamList } from '../../../types/models';
import { useCreateTask, useTask, useUpdateTask } from '../hooks/useTasks';
import { theme } from '../../../config/theme';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { TaskPriority, TaskStatus } from '../api';
import { useProjects } from '../../projects/hooks/useProjects';

type Route = RouteProp<TasksStackParamList, 'TaskEdit'>;
type Nav = StackNavigationProp<TasksStackParamList, 'TaskEdit'>;

type FormValues = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
};

const TaskEditScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const isEdit = !!params?.taskId;
  const { data: task } = useTask(params?.taskId || '');
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const { data: projects, isLoading: loadingProjects } = useProjects();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: (task?.status as TaskStatus) || 'TODO',
      priority: (task?.priority as TaskPriority) || 'LOW',
      dueDate: task?.dueDate || '',
      projectId: params?.projectId || task?.projectId || '',
    },
  });

  React.useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || '',
        projectId: task.projectId,
      });
    }
  }, [task, reset]);

  const [openDue, setOpenDue] = React.useState(false);
  const dueVal = watch('dueDate');
  const parseDateSafe = (value?: string) => {
    const d = value ? new Date(value) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  };
  const formatDate = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const onSave = async (values: FormValues) => {
    try {
      if (!values.title.trim() || !values.projectId) {
        Alert.alert('Erreur', 'Titre et projet requis');
        return;
      }
      if (isEdit && params?.taskId) {
        await updateMutation.mutateAsync({
          taskId: params.taskId,
          updates: values,
        });
        Alert.alert('Succès', 'Tâche mise à jour');
        navigation.goBack();
      } else {
        const created = await createMutation.mutateAsync(values);
        Alert.alert('Succès', 'Tâche créée');
        navigation.navigate('TaskDetails', { taskId: (created as any).id });
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la tâche');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>
        {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
      </Text>
      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Titre</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: 'Titre requis' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Titre de la tâche"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title.message}</Text>
          )}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Statut</Text>
          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <View style={styles.chipsRow}>
                {(
                  ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as TaskStatus[]
                ).map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, value === s && styles.chipActive]}
                    onPress={() => onChange(s)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        value === s && styles.chipTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Priorité</Text>
          <Controller
            control={control}
            name="priority"
            render={({ field: { value, onChange } }) => (
              <View style={styles.chipsRow}>
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TaskPriority[]).map(
                  p => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.chip, value === p && styles.chipActive]}
                      onPress={() => onChange(p)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          value === p && styles.chipTextActive,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Échéance</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setOpenDue(true)}
          >
            <Text style={styles.inputText}>
              {formatDate(dueVal) || 'Sélectionner une date'}
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name="dueDate"
            render={() => (
              <DatePicker
                modal
                mode="date"
                open={openDue}
                date={parseDateSafe(dueVal)}
                onConfirm={date => {
                  setOpenDue(false);
                  setValue('dueDate', date.toISOString(), {
                    shouldDirty: true,
                  });
                }}
                onCancel={() => setOpenDue(false)}
              />
            )}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Projet</Text>
          <Controller
            control={control}
            name="projectId"
            rules={{ required: 'Projet requis' }}
            render={({ field: { value, onChange } }) =>
              loadingProjects ? (
                <Text>Sélection des projets...</Text>
              ) : (
                <View style={{ borderWidth: 1, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.white }}>
                  {projects?.length ? (
                    projects.map((project: any) => (
                      <TouchableOpacity
                        key={project.id}
                        style={[styles.chip, value === project.id && styles.chipActive]}
                        onPress={() => onChange(project.id)}
                      >
                        <Text style={[styles.chipText, value === project.id && styles.chipTextActive]}>
                          {project.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.errorText}>Aucun projet trouvé</Text>
                  )}
                </View>
              )
            }
          />
          {errors.projectId && <Text style={styles.errorText}>{errors.projectId.message}</Text>}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primary} onPress={handleSubmit(onSave)}>
          <Text style={styles.primaryText}>
            {isEdit ? 'Enregistrer' : 'Créer'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  inner: { padding: theme.spacing.lg },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
  },
  field: { marginBottom: theme.spacing.lg },
  label: { color: theme.colors.text.primary, marginBottom: theme.spacing.xs },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing.md,
  },
  inputText: { color: theme.colors.text.primary, fontSize: theme.fontSizes.md },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.tertiary,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeights.medium,
  },
  chipTextActive: { color: theme.colors.white },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.lg,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
  },
  primaryText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.semibold,
  },
  errorText: { color: theme.colors.danger, marginTop: theme.spacing.xs },
});

export default TaskEditScreen;
