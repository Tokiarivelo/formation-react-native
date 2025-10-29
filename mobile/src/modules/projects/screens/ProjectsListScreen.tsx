import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProjectsStackParamList } from '../../../types/models';
import { useProjects } from '../hooks/useProjects';
import { theme } from '../../../config/theme';

type Nav = StackNavigationProp<ProjectsStackParamList, 'ProjectsList'>;

const ProjectsListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { data: projects = [], isLoading } = useProjects();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Projets</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ProjectEdit', {})}>
          <Text style={styles.addBtnText}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.meta}>Chargement…</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(p: any) => p.id}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}>
              <Text style={styles.name}>{item.name}</Text>
              {item.description ? <Text style={styles.desc} numberOfLines={2}>{item.description}</Text> : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.secondary, padding: theme.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.lg },
  title: { fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, color: theme.colors.text.primary },
  addBtn: { backgroundColor: theme.colors.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: theme.borderRadius.md },
  addBtnText: { color: theme.colors.white, fontWeight: theme.fontWeights.semibold },
  item: { backgroundColor: theme.colors.white, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, ...theme.shadows.small },
  name: { fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.semibold, color: theme.colors.text.primary },
  desc: { fontSize: theme.fontSizes.sm, color: theme.colors.text.secondary, marginTop: 4 },
  meta: { color: theme.colors.text.secondary },
});

export default ProjectsListScreen;


