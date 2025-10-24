import React from 'react'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity'
import AppText from '../../../components/ui/AppText'
import { launchCamera } from 'react-native-image-picker'
import { useCreateAttachment } from '../hooks/useAttachments'

const AttachementPicker = () => {
    const { mutateAsync: uploadAttachment } = useCreateAttachment()
    const handleImagePicker = async () => {
        const response = await launchCamera({ mediaType: 'photo' });
        console.log(response);
        await uploadAttachment({ file: response.assets?.[0]! })
    }

    return (
        <AppTouchableOpacity onPress={handleImagePicker}>
            <AppText>Pick Attachment</AppText>
        </AppTouchableOpacity>
    )
}

export default AttachementPicker