import { CardContent, styled } from '@mui/material';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FastTextField } from '../Fields/FastTextField';
import { SelectField } from '../Fields/SelectField';
import { TextFieldWithDescriptionField } from '../Fields/TextFieldWithDescriptionField';
import { TitleTextField } from '../Fields/TitleTextField';


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

interface NewCollectionDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const NewCollectionDialog = (props: NewCollectionDialogProps) => {
    const [wasSubmitted, setWasSubmitted] = React.useState(false);
    const [localPositionState, setLocalPositionState] = React.useState('')

    const handlePositionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newPosition = event.target.value || '';
        setLocalPositionState(newPosition);
    };

    const isPositionOpenGuard = localPositionState.toLowerCase() === 'open guard';

    const { collectionSuggestions } = useSelector((state: RootState) => state.suggestions);
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
                    <Button type="submit" form="newCollectionForm" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                    <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                </Box>
            </DialogTitle>
            <DialogContent dividers={true} sx={{ padding: "0px", borderBottom: "none" }}>
                <form id="newCollectionForm" onSubmit={handleSubmit}>
                    <Card>
                        <CardContent>
                            <TitleTextField wasSubmitted={wasSubmitted} size="small" fullWidth required
                                name="title" label="Collection Title" options={collectionSuggestions.titleOptions} />

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth required
                                multiline rows={4} name="description" label="Collection Description" />

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth
                                multiline rows={4} name="globalNotes" label="Global Notes" />

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="position"
                                label="Position" descriptionLabel='Position Description' options={collectionSuggestions.positionOptions}
                                onPositionBlur={handlePositionBlur} descriptions={descriptions} />

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="type"
                                label="Type" descriptionLabel='Type Description' options={collectionSuggestions.typeOptions}
                                descriptions={descriptions} />

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="openGuard"
                                label="Open Guard" descriptionLabel="Open Guard Description" options={collectionSuggestions.openGuardOptions}
                                descriptions={descriptions} hidden={!isPositionOpenGuard} disabled={!isPositionOpenGuard} required={isPositionOpenGuard} />

                            <SelectField wasSubmitted={wasSubmitted} name="hierarchy" label="Hierarchy" options={collectionSuggestions.hierarchyOptions} />

                            <SelectField wasSubmitted={wasSubmitted} name="gi" label="Gi" options={collectionSuggestions.giOptions} />
                        </CardContent>
                    </Card>
                </form>
            </DialogContent>
        </Dialog >
    );
};
