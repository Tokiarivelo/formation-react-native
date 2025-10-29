import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { theme } from '../../../config/theme';
import { ProjectsStackParamList } from '../../../types/models';
import { ProjectStatus } from '../api';
import { useCreateProject, useProject, useUpdateProject } from '../hooks/useProjects';

type Route = RouteProp<ProjectsStackParamList, 'ProjectEdit'>;
type Nav = StackNavigationProp<ProjectsStackParamList, 'ProjectEdit'>;

const ProjectEditScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const isEdit = !!params?.projectId;
  const { data: project } = useProject(params?.projectId || '');
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  type FormValues = { name: string; description?: string; status: ProjectStatus; startDate?: string; endDate?: string };
  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      status: (project?.status as ProjectStatus) || 'ACTIVE',
      startDate: project?.startDate || '',
      endDate: project?.endDate || '',
    }
  });

  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const startDateVal = watch('startDate');
  const endDateVal = watch('endDate');
  const parseDateSafe = (value?: string) => {
    const d = value ? new Date(value) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  };
  const formatDate = (value?: string) => {
    if (!value) return '';
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return '';
    }
  };

  React.useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || '',
        status: (project.status as ProjectStatus) || 'ACTIVE',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
      });
    }
  }, [project, reset]);

  const onSave = async (values: FormValues) => {
    try {
      if (isEdit && params?.projectId) {
        await updateMutation.mutateAsync({ projectId: params.projectId, updates: values });
        Alert.alert('Succès', 'Projet mis à jour');
        navigation.goBack();
      } else {
        const created = await createMutation.mutateAsync(values);
        Alert.alert('Succès', 'Projet créé');
        navigation.navigate('ProjectDetails', { projectId: (created as any).id });
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le projet');
    }
  };

//   const onAttach = async () => {
//     try {
//       const res = await ImagePicker.launchImageLibrary({ mediaType: 'mixed' });
//       const asset = res.assets?.[0];
//       if (!asset) return;

//       const currentProjectId = params?.projectId || (project as any)?.id;
//       if (!currentProjectId) {
//         Alert.alert('Info', 'Enregistrez le projet avant d’ajouter des pièces jointes.');
//         return;
//       }

//       await attachmentsApi.uploadForProject(currentProjectId, {
//         uri: asset.uri!,
//         name: asset.fileName || 'file',
//         type: asset.type || 'application/octet-stream',
//       });
//       Alert.alert('Succès', 'Fichier téléversé');
//     } catch (e) {
//       Alert.alert('Erreur', 'Téléversement impossible');
//     }
//   };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</Text>
      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Nom</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Nom requis' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={styles.input} placeholder="Nom du projet" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, { height: 100 }]} placeholder="Description" value={value} onChangeText={onChange} onBlur={onBlur} multiline />
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
                {(['ACTIVE','COMPLETED','CANCELLED','ON_HOLD'] as ProjectStatus[]).map((s) => (
                  <TouchableOpacity key={s} style={[styles.chip, value === s && styles.chipActive]} onPress={() => onChange(s)}>
                    <Text style={[styles.chipText, value === s && styles.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
        <View style={styles.row2}>
          <View style={[styles.field, { flex: 1, marginRight: theme.spacing.sm }]}>
            <Text style={styles.label}>Début</Text>
            <TouchableOpacity style={styles.input} onPress={() => setOpenStart(true)}>
              <Text style={styles.inputText}>{formatDate(startDateVal) || 'Sélectionner une date'}</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="startDate"
              render={() => (
                <DatePicker
                  modal
                  mode="date"
                  open={openStart}
                  date={parseDateSafe(startDateVal)}
                  onConfirm={(date) => {
                    setOpenStart(false);
                    setValue('startDate', date.toISOString(), { shouldDirty: true });
                  }}
                  onCancel={() => setOpenStart(false)}
                />
              )}
            />
          </View>
          <View style={[styles.field, { flex: 1, marginLeft: theme.spacing.sm }]}>
            <Text style={styles.label}>Fin</Text>
            <TouchableOpacity style={styles.input} onPress={() => setOpenEnd(true)}>
              <Text style={styles.inputText}>{formatDate(endDateVal) || 'Sélectionner une date'}</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="endDate"
              render={() => (
                <DatePicker
                  modal
                  mode="date"
                  open={openEnd}
                  date={parseDateSafe(endDateVal)}
                  onConfirm={(date) => {
                    setOpenEnd(false);
                    setValue('endDate', date.toISOString(), { shouldDirty: true });
                  }}
                  onCancel={() => setOpenEnd(false)}
                />
              )}
            />
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        {/* <TouchableOpacity style={styles.secondary} onPress={onAttach}>
          <Text style={styles.secondaryText}>+ Pièce jointe</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.primary} onPress={handleSubmit(onSave)}>
          <Text style={styles.primaryText}>{isEdit ? 'Enregistrer' : 'Créer'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  inner: { padding: theme.spacing.lg },
  title: { fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.lg },
  card: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.xl, padding: theme.spacing.xl, ...theme.shadows.large },
  field: { marginBottom: theme.spacing.lg },
  label: { color: theme.colors.text.primary, marginBottom: theme.spacing.xs },
  input: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border.light, padding: theme.spacing.md },
  inputText: { color: theme.colors.text.primary, fontSize: theme.fontSizes.md },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.background.tertiary, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { color: theme.colors.text.primary, fontWeight: theme.fontWeights.medium },
  chipTextActive: { color: theme.colors.white },
  errorText: { color: theme.colors.danger, marginTop: theme.spacing.xs },
  row2: { flexDirection: 'row' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.lg },
  primary: { backgroundColor: theme.colors.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: theme.borderRadius.md },
  primaryText: { color: theme.colors.white, fontWeight: theme.fontWeights.semibold },
//   secondary: { backgroundColor: theme.colors.background.tertiary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: theme.borderRadius.md },
//   secondaryText: { color: theme.colors.text.primary, fontWeight: theme.fontWeights.medium },
});

export default ProjectEditScreen;


