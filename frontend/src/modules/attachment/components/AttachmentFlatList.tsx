import { View, FlatList, NativeScrollEvent, NativeSyntheticEvent, Image, StyleSheet, Dimensions, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import { configs } from '../../../configs/config';
import AttachemntThumbnail from './AttachmentThumbnail';
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';
import AppText from '../../../components/ui/AppText';
import { Attachment } from '../../../types/api';

const apiUrl = configs.apiUrl;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AttachmentFlatList = ({ attachments }: { attachments: Attachment[] }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setSelectedImageIndex(index);
    };

    const renderFullImage = ({ item }: { item: any }) => (
        <View style={styles.fullImageContainer}>
            <Image
                source={{ uri: `${apiUrl}/${item.path}` }}
                style={styles.fullImage}
                resizeMode="contain"
            />
        </View>
    );
    return (
        <View>
            {/* THUMBNAILS */}
            <View style={styles.thumbnailContainer}>
                {attachments && attachments.length > 0 && (
                    attachments.map((attachment, index) => (
                        <AttachemntThumbnail
                            attachment={attachment}
                            index={index}
                            attachmentPath={`${apiUrl}/${attachment.path}`}
                            key={attachment.id}
                            flatListRef={flatListRef}
                            handleImageIndex={setSelectedImageIndex}
                        />
                    ))
                )}
            </View>

            {/* Full Image Modal with Swipe */}
            <Modal
                visible={selectedImageIndex !== null}
                transparent={true}
                onRequestClose={() => setSelectedImageIndex(null)}
            >
                <View style={styles.modalContainer}>
                    <AppTouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedImageIndex(null)}
                    >
                        <AppText style={styles.closeButtonText}>x</AppText>
                    </AppTouchableOpacity>

                    <FlatList
                        ref={flatListRef}
                        data={attachments}
                        renderItem={renderFullImage}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={selectedImageIndex || 0}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        getItemLayout={(data, index) => ({
                            length: SCREEN_WIDTH,
                            offset: SCREEN_WIDTH * index,
                            index,
                        })}
                        onScrollToIndexFailed={(info) => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
                            });
                        }}
                    />

                    {/* Image counter */}
                    {attachments && attachments.length > 1 && (
                        <View style={styles.counterContainer}>
                            <AppText style={styles.counterText}>
                                {selectedImageIndex! + 1} / {attachments.length}
                            </AppText>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    thumbnailContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    fullImageContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: SCREEN_WIDTH,
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    closeButtonText: {
        fontSize: 20,
        color: 'white',
    },
    counterContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    counterText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AttachmentFlatList