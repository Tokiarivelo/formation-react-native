import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking } from 'react-native';
import { attachmentsApi, Attachment } from '../api';
import { theme } from '../../../config/theme';

interface AttachmentListProps {
  projectId: string;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ projectId }) => {
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await attachmentsApi.listByProject(projectId);
      setAttachments(data);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => { load(); }, [load]);

  const handleOpen = async (id: string) => {
    const url = await attachmentsApi.download(id);
    Linking.openURL(url);
  };

  if (loading && attachments.length === 0) {
    return <Text style={styles.meta}>Chargement des pièces jointes…</Text>;
  }

  if (attachments.length === 0) {
    return <Text style={styles.meta}>Aucune pièce jointe</Text>;
  }

  return (
    <FlatList
      data={attachments}
      keyExtractor={(a) => a.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleOpen(item.id)}>
          <Text style={styles.name}>📎 {item.filename}</Text>
          <Text style={styles.meta}>{Math.round(item.size / 1024)} Ko</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
});

export default AttachmentList;


