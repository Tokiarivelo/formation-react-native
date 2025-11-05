import React from 'react'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity'
import AppText from '../../../components/ui/AppText'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useCreateAttachment } from '../hooks/useAttachments'
import { StyleSheet, View } from 'react-native'

const AttachementPicker = ({ projectId = "", taskId = "", select = true }: { projectId?: string, taskId?: string, select: boolean }) => {
    const { mutateAsync: uploadAttachment } = useCreateAttachment()
    const handleImagePicker = async () => {
        let response;
        if (select) {
            response = await launchImageLibrary({ mediaType: 'photo' });
        }
        else {
            response = await launchCamera({ mediaType: 'photo' });
        }
        if (response.didCancel) {
            console.log('User cancelled image picker');
            return;
        }
        if (response.errorCode) {
            console.error('ImagePicker Error: ', response.errorMessage);
            return;
        }
        await uploadAttachment({ file: response.assets?.[0]!, projectId, taskId });
    }

    return (
        <View style={styles.wrapper}>
            <AppTouchableOpacity style={styles.button} onPress={handleImagePicker}>
                <AppText style={styles.text}>
                    {select ? "Select Attachment" : "Take Photo"}
                </AppText>
            </AppTouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
    },
    text: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 10,
    },
})

export default AttachementPicker