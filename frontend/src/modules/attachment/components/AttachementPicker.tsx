import React from 'react'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity'
import AppText from '../../../components/ui/AppText'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useCreateAttachment } from '../hooks/useAttachments'

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
        <AppTouchableOpacity onPress={handleImagePicker}>
            <AppText>{select ? "Select Attachment" : "Take Photo"}</AppText>
        </AppTouchableOpacity>
    )
}

export default AttachementPicker