import { CardContent, styled } from '@mui/material';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { useGetDescriptionsQuery, useGetTechniqueSuggestionsQuery } from '../../services/syllabusTrackerApi';
import Pageloader from '../Base/PageLoader';
import { FastTextField as TextField } from '../Fields/FastTextField';
import { SelectField } from '../Fields/SelectField';
import { TextFieldWithDescriptionField } from '../Fields/TextFieldWithDescriptionField';
import { TitleTextField } from '../Fields/TitleTextField';
import VideoTextFields from '../Fields/VideoTextFields';


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

interface NewTechniqueDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const NewTechniqueDialog = (props: NewTechniqueDialogProps) => {
    const [wasSubmitted, setWasSubmitted] = React.useState(false);

    const [localPositionState, setLocalPositionState] = React.useState('');

    const handlePositionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newPosition = event.target.value || '';
        setLocalPositionState(newPosition);
    };

    const isPositionOpenGuard = localPositionState.toLowerCase() === 'open guard';

    const { data: techniqueSuggestions, isLoading: suggestionsLoading, isSuccess: suggestionsSuccess } = useGetTechniqueSuggestionsQuery()
    const { data: descriptions, isLoading: descriptionsLoading, isSuccess: descriptionsSuccess } = useGetDescriptionsQuery()

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
        <>
            {(suggestionsLoading || descriptionsLoading) ? <CardContent><Pageloader /></CardContent>
                : (suggestionsSuccess && descriptionsSuccess) &&
                <Dialog open={props.dialogOpen} onClose={props.onClose} scroll="paper" maxWidth="md" fullWidth>
                    <DialogTitle sx={{ padding: "0px", marginBottom: "10px" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={0}>
                            <Button type="submit" form="newTechniqueForm" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                            <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers={true} sx={{ padding: "0px", borderBottom: "none" }}>
                        <Card>
                            <form id="newTechniqueForm" onSubmit={handleSubmit}>
                                <CardContent>
                                    <TitleTextField wasSubmitted={wasSubmitted} size="small" fullWidth required
                                        name="title" label="Technique Title" options={techniqueSuggestions.title} />

                                    <TextField wasSubmitted={wasSubmitted} size="small" fullWidth required
                                        multiline rows={4} name="description" label="Technique Description" />

                                    <TextField wasSubmitted={wasSubmitted} size="small" fullWidth
                                        multiline rows={4} name="globalNotes" label="Global Notes" />

                                    <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="position"
                                        label="Position" descriptionLabel="Position Description" options={techniqueSuggestions.position} descriptions={descriptions}
                                        onPositionBlur={handlePositionBlur} />

                                    <SelectField wasSubmitted={wasSubmitted} name="hierarchy" label="Hierarchy" options={techniqueSuggestions.hierarchy} required />

                                    <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="type"
                                        label="Type" descriptionLabel="Type Description" options={techniqueSuggestions.type} descriptions={descriptions} />

                                    <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="openGuard"
                                        label="Open Guard" descriptionLabel="Open Guard Description" options={techniqueSuggestions.openguard}
                                        descriptions={descriptions} hidden={!isPositionOpenGuard} disabled={!isPositionOpenGuard} required={isPositionOpenGuard} />

                                    <SelectField wasSubmitted={wasSubmitted} name="gi" label="Gi" options={techniqueSuggestions.gi} required />

                                    <VideoTextFields wasSubmitted={wasSubmitted} />
                                </CardContent>
                            </form>
                        </Card>
                    </DialogContent>
                </Dialog >
            }
        </>
    );
};
