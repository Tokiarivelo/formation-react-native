import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import AppText from '../../../components/ui/AppText'
import { TaskStackScreenProps } from '../../../types/navigation'
import { useAttachments } from '../../attachment/hooks/useAttachments'
import AttachmentFlatList from '../../attachment/components/AttachmentFlatList'
import AttachementPicker from '../../attachment/components/AttachementPicker'
import { withObservables } from '@nozbe/watermelondb/react'
import { tasksApi_local } from '../localApi'
import Task from '../../../database/models/Task'

type Prop = TaskStackScreenProps<'TaskDetail'> & {
    task: Task,
};

const enhance = withObservables(['route'], ({ route }: TaskStackScreenProps<'TaskDetail'>) => ({
    task: tasksApi_local.get(route.params.taskId)
}))

const TaskDetailScreen = ({ task }: Prop) => {
    const { data: attachments } = useAttachments(task?.projectId || '', task.id);

    return (
        <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
                <AppText style={styles.title}>{task.title}</AppText>

                <View style={styles.row}>
                    <AppText style={styles.label}>Task ID</AppText>
                    <AppText style={styles.mono}>{task.id}</AppText>
                </View>

                {task.description ? (
                    <>
                        <AppText style={styles.label}>Description</AppText>
                        <AppText style={styles.body}>{task.description}</AppText>
                    </>
                ) : null}

                {/* TASK PROPERTIES */}
                <View style={[styles.row, styles.metaRow]}>
                    <View style={styles.badge}>
                        <AppText style={styles.badgeText}>{task.status}</AppText>
                    </View>

                    <View style={[styles.badge, styles.badgeAlt]}>
                        <AppText style={styles.badgeText}>{task.priority}</AppText>
                    </View>

                    <View style={styles.flexSpacer} />

                    <AppText style={styles.label}>Due</AppText>
                    <AppText style={styles.date}>{task.dueDate ? task.dueDate.toLocaleDateString() : '—'}</AppText>
                </View>

                {/* ATTACHMENT PICKER */}
                <View style={styles.pickerRow}>
                    <AttachementPicker select={true} projectId={task.projectId} taskId={task.id} />
                    <AttachementPicker select={false} projectId={task.projectId} taskId={task.id} />
                </View>
            </View>

            {/* ATTACHMENT LIST */}
            <View style={styles.attachmentsSection}>
                <AppText style={styles.sectionTitle}>Attachments</AppText>
                <AttachmentFlatList attachments={attachments || []} />
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    screen: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#f6f7fb',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: '#6b7280',
        marginRight: 8,
    },
    body: {
        fontSize: 15,
        color: '#111827',
        marginBottom: 12,
    },
    mono: {
        fontSize: 12,
        color: '#374151',
        fontFamily: undefined, // keep system font; replace if you have monospace
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    metaRow: {
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#eef2ff',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        marginRight: 8,
    },
    badgeAlt: {
        backgroundColor: '#fff1f0',
    },
    badgeText: {
        color: '#111827',
        fontWeight: '600',
        fontSize: 13,
    },
    date: {
        fontSize: 13,
        color: '#111827',
        marginLeft: 6,
        fontWeight: '600',
    },
    flexSpacer: { flex: 1 },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 8,
    },
    attachmentsSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#111827',
    },
});

export default enhance(TaskDetailScreen)