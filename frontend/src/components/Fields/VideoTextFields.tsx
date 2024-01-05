import { Add, Remove } from "@mui/icons-material";
import { Box, Typography, styled } from "@mui/material";
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiTextField from '@mui/material/TextField';
import React from "react";


const TextField = styled(MuiTextField)({
    marginTop: "15px"
})

const Button = styled((props: ButtonProps) => (
    <MuiButton sx={{ width: "100%", margin: "10px" }} variant='contained' {...props} />
))(({ theme }) => ({}));

interface TechniqueDTO {
    title: string,
    videos: { title: string, hyperlink: string }[],
    description: string,
    globalNotes: string | undefined,
    gi: string,
    hierarchy: string,
    type: string,
    typeDescription: string | undefined,
    position: string,
    positionDescription: string | undefined,
    openGuard: string | undefined,
    openGuardDescription: string | undefined,
}

interface VideoTextFieldsProps {
    editingTechnique: TechniqueDTO;
    editingTechniqueId: string;
    wasSubmitted: boolean;
}

export function VideoTextFields(props: VideoTextFieldsProps) {
    const [videoCount, setVideoCount] = React.useState(1)
    const [values, setValues] = React.useState(props.editingTechnique.videos);
    const [errors, setErrors] = React.useState(props.editingTechnique.videos.map(() => ({ title: false, hyperlink: false })));

    React.useEffect(() => {
        setVideoCount(props.editingTechnique.videos.length || 1)
    }, [props.editingTechnique.videos])

    const addVideoField = () => {
        setVideoCount(prev => prev + 1)
        setValues([...values, { title: '', hyperlink: '' }]);
        setErrors([...errors, { title: false, hyperlink: false }]);
    };

    const subtractVideoField = () => {
        if (videoCount > 1) {
            setVideoCount(videoCount - 1);
            setValues(values.slice(0, -1));
            setErrors(errors.slice(0, -1));
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: 'title' | 'hyperlink') => {
        const newValues = [...values]
        newValues[index] = { ...newValues[index], [field]: event.target.value || '' }

        const newErrors = [...errors];
        if (field === 'title') {
            newErrors[index].title = !event.target.value && (index > 0 || newValues[index].hyperlink.length > 0)
            if (index === 0) { newErrors[index].hyperlink = newValues[index].title.length > 0 && newValues[index].hyperlink.length === 0 }
        } else {
            newErrors[index].hyperlink = !event.target.value && (index > 0 || newValues[index].title.length > 0)
            if (index === 0) { newErrors[index].title = newValues[index].hyperlink.length > 0 && newValues[index].title.length === 0 }
        }
        setValues(newValues)
        setErrors(newErrors)
    }

    return (
        <React.Fragment>
            {Array.from({ length: videoCount }, (_, index) => (
                <React.Fragment key={props.editingTechniqueId + "_video_fields_" + index}>
                    <Typography variant="body2" sx={{ marginTop: "10px", marginLeft: "5px" }}>{`Video Set ${index + 1}`}</Typography>
                    <TextField
                        size="small"
                        fullWidth
                        label="Video Title"
                        required={index > 0 || !(values[index].hyperlink === undefined || values[index].hyperlink.length === 0)}
                        defaultValue={values[index].title}
                        name={"video_title_" + index}
                        onBlur={e => handleBlur(e, index, 'title')}
                        error={errors[index].title}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        label="Video Hyperlink"
                        required={index > 0 || !(values[index].title === undefined || values[index].title.length === 0)}
                        defaultValue={values[index].title}
                        name={"video_link_" + index}
                        onBlur={e => handleBlur(e, index, 'hyperlink')}
                        error={errors[index].hyperlink}
                    />
                    <Box display="flex" flexDirection="row" justifyContent="space-evenly" alignItems="center">
                        {index === videoCount - 1 && (
                            <>
                                <Button onClick={addVideoField} sx={{ minWidth: "100px" }}><Add /></Button>
                                <Button onClick={subtractVideoField} disabled={videoCount <= 1} sx={{ minWidth: "100px" }}><Remove /></Button>
                            </>
                        )}
                    </Box>
                </React.Fragment>
            )
            )}
        </React.Fragment>
    )
}

export default VideoTextFields
