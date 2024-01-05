import { CardContent, Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import theme from '../../theme/Theme';
import { FastTextField } from '../Fields/FastTextField';
import { SelectField } from '../Fields/SelectField';
import { TextFieldWithDescriptionField } from '../Fields/TextFieldWithDescriptionField';
import { TitleTextField } from '../Fields/TitleTextField';
import { Add, Remove } from '@mui/icons-material';
import VideoTextFields from '../Fields/VideoTextFields';


const TextField = styled(FastTextField)({
    marginTop: "15px"
})

const Card = styled(MuiCard)({
    backgroundColor: `#3c3836`,
    '&.MuiCard-root': {
        margin: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

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

interface EditTechniqueDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onDelete: (techniqueId: string) => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    editingTechnique: TechniqueDTO;
    editingTechniqueId: string;
}


export const EditTechniqueDialog = (props: EditTechniqueDialogProps) => {
    const [wasSubmitted, setWasSubmitted] = React.useState(false);
    const [localPositionState, setLocalPositionState] = React.useState(props.editingTechnique?.position || '')

    const handlePositionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newPosition = event.target.value || '';
        setLocalPositionState(newPosition);
    };

    const isPositionOpenGuard = localPositionState.toLowerCase() === 'open guard';

    const { techniqueSuggestions } = useSelector((state: RootState) => state.suggestions);
    const { descriptions } = useSelector((state: RootState) => state.descriptions)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setWasSubmitted(true)
        if (event.currentTarget.checkValidity()) {
            await props.onSave(event);
            setWasSubmitted(false)
        } else {
            console.log("Form is invalid");
        }
    };

    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} scroll="paper" maxWidth="md" fullWidth>
            <DialogTitle sx={{ padding: "0px", marginBottom: "10px" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={0}>
                    <Button type="submit" form="techniqueEditForm" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                    <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                    <Button onClick={(event) => { event.stopPropagation(); props.onDelete(props.editingTechniqueId); }}
                        style={{ backgroundColor: theme.palette.error.main }}>Delete</Button>
                </Box>
            </DialogTitle>

            <DialogContent dividers={true} sx={{ padding: "0px", borderBottom: "none" }}>
                <Card>
                    <CardContent>
                        <form id="techniqueEditForm" onSubmit={handleSubmit}>
                            <TitleTextField wasSubmitted={wasSubmitted} size="small" fullWidth required defaultValue={props.editingTechnique?.title || ''}
                                name="title" label="Technique Title" options={techniqueSuggestions.titleOptions} />

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth required defaultValue={props.editingTechnique?.description || ''}
                                multiline rows={4} name="description" label="Technique Description" />

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth defaultValue={props.editingTechnique?.globalNotes || ''}
                                multiline rows={4} name="globalNotes" label="Global Notes" />

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="position"
                                label="Position" descriptionLabel="Position Description" options={techniqueSuggestions.positionOptions}
                                descriptions={descriptions} onPositionBlur={handlePositionBlur} defaultValue={props.editingTechnique?.position || ''}
                                descriptionDefaultValue={props.editingTechnique?.positionDescription || ''} />

                            <SelectField wasSubmitted={wasSubmitted} name="hierarchy" label="Hierarchy" defaultValue={props.editingTechnique?.hierarchy || ''}
                                options={techniqueSuggestions.hierarchyOptions} required />

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="type"
                                defaultValue={props.editingTechnique?.type || ''} descriptionDefaultValue={props.editingTechnique?.typeDescription || ''}
                                label="Type" descriptionLabel="Type Description" options={techniqueSuggestions.typeOptions} descriptions={descriptions} />

                            <SelectField wasSubmitted={wasSubmitted} name="gi" label="Gi" defaultValue={props.editingTechnique?.gi || ''}
                                options={techniqueSuggestions.giOptions} required />

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="openGuard"
                                defaultValue={props.editingTechnique?.openGuard || ''} descriptionDefaultValue={props.editingTechnique?.openGuardDescription || ''}
                                label="Open Guard" descriptionLabel="Open Guard Description" options={techniqueSuggestions.openGuardOptions}
                                descriptions={descriptions} hidden={!isPositionOpenGuard} disabled={!isPositionOpenGuard} required={isPositionOpenGuard} />
                            
                            <VideoTextFields wasSubmitted={wasSubmitted} editingTechnique={props.editingTechnique} editingTechniqueId={props.editingTechniqueId}/>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog >

    );
};
