import React from 'react'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';
import { Alert, FlatList, Image, ImageStyle, StyleProp, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Attachment } from '../../../types/api';
import { useDeleteAttachment, useDownloadAttachment } from '../hooks/useAttachments';

type AttachmentThumbnailProps = TouchableOpacityProps & {
    attachment: Attachment;
    style?: StyleProp<ImageStyle>;
    attachmentPath: string;
    index: number;
    flatListRef: React.RefObject<FlatList<any> | null>;
    handleImageIndex: (index: number) => void;
}

const AttachmentThumbnail = ({ attachment, style, attachmentPath, index, flatListRef, handleImageIndex, ...props }: AttachmentThumbnailProps) => {
    const { mutate: download } = useDownloadAttachment();
    const { mutate: deleteAttachment } = useDeleteAttachment();
    const handleLongPress = () => {
        Alert.alert(
            attachment.originalName,
            'Choose an action',
            [
                {
                    text: 'Download',
                    onPress: () => handleDownload(),
                },
                {
                    text: 'Delete',
                    onPress: () => handleDelete(),
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const handleDownload = () => {
        download(attachment.id);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Attachment',
            `Are you sure you want to delete ${attachment.originalName}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteAttachment(attachment.id);
                    },
                    style: 'destructive',
                },
            ]
        );
    };
    return (
        <AppTouchableOpacity
            onPress={() => {
                handleImageIndex(index);
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: false });
                }, 100);
            }}
            style={styles.button}
            onLongPress={() => handleLongPress()}
            {...props}
        >
            <Image
                source={{ uri: attachmentPath }}
                style={[styles.thumbnail, style]}
                resizeMode="cover"
            />
        </AppTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    button: {
        backgroundColor: "transparent"
    }
});

export default AttachmentThumbnail