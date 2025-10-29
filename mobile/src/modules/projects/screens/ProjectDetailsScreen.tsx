import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProjectsStackParamList } from '../../../types/models';
import { useProject, useDeleteProject } from '../hooks/useProjects';
import { theme } from '../../../config/theme';
import AttachmentList from '../../attachments/components/AttachmentList';

type Route = RouteProp<ProjectsStackParamList, 'ProjectDetails'>;
type Nav = StackNavigationProp<ProjectsStackParamList, 'ProjectDetails'>;

const ProjectDetailsScreen: React.FC = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { data: project, isLoading } = useProject(params.projectId);
  const deleteMutation = useDeleteProject();

  const handleDelete = () => {
    if (!project) return;
    // Simple confirmation
    // Using native confirm via Alert
    // Import Alert inline to avoid extra top-level import churn
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Alert } = require('react-native');
    Alert.alert(
      'Supprimer le projet',
      'Cette action est irréversible. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(project.id);
              navigation.goBack();
            } catch (e) {
              Alert.alert('Erreur', 'Suppression impossible');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !project) {
    return (
      <View style={styles.container}>
        <Text style={styles.meta}>Chargement…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{project.name}</Text>
        {project.description ? (
          <Text style={styles.desc}>{project.description}</Text>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.meta}>Statut: {project.status || '—'}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.meta}>Début: {project.startDate || '—'}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.meta}>Fin: {project.endDate || '—'}</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate('ProjectEdit', { projectId: project.id })
          }
        >
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Pièces jointes</Text>
      <AttachmentList projectId={project.id} />

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={deleteMutation.isPending}>
        <Text style={styles.deleteText}>{deleteMutation.isPending ? 'Suppression…' : 'Supprimer le projet'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  desc: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: { color: theme.colors.text.secondary },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  editBtn: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  editText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.semibold,
  },
  deleteBtn: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  deleteText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.semibold,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
});

export default ProjectDetailsScreen;
