import { CardContent, styled } from '@mui/material';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Collection } from 'common';
import React from 'react';
import theme from '../../theme/Theme';
import { FastTextField } from '../Fields/FastTextField';
import { SelectField } from '../Fields/SelectField';
import { TextFieldWithDescriptionField } from '../Fields/TextFieldWithDescriptionField';
import { TitleTextField } from '../Fields/TitleTextField';
import { useGetCollectionSuggestionsQuery, useGetDescriptionsQuery } from '../../services/syllabusTrackerApi';
import Pageloader from '../Base/PageLoader';


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

interface EditCollectionDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onDelete: (techniqueId: string) => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    editingCollection: Collection | null;
    editingCollectionId: string;
}

export const EditCollectionDialog = (props: EditCollectionDialogProps) => {
    const { data: collectionSuggestions, isLoading: suggestionsLoading, isSuccess: suggestionsSuccess } = useGetCollectionSuggestionsQuery()
    const { data: descriptions, isLoading: descriptionsLoading, isSuccess: descriptionsSuccess } = useGetDescriptionsQuery()

    const [wasSubmitted, setWasSubmitted] = React.useState(false);
    const [localPositionState, setLocalPositionState] = React.useState(props.editingCollection?.position?.title || '')

    const handlePositionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newPosition = event.target.value || '';
        setLocalPositionState(newPosition);
    };

    const isPositionOpenGuard = localPositionState.toLowerCase() === 'open guard';

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
                            <Button type="submit" form="collectionEditForm" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                            <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                            <Button onClick={(event) => { event.stopPropagation(); props.onDelete(props.editingCollectionId); }}
                                style={{ backgroundColor: theme.palette.error.main }}
                            >Delete</Button>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers={true} sx={{ padding: "0px", borderBottom: "none" }}>
                        <Card>
                            <CardContent>
                                <form noValidate id="collectionEditForm" onSubmit={handleSubmit}>

                                    <TitleTextField wasSubmitted={wasSubmitted} size="small" fullWidth required defaultValue={props.editingCollection?.title || ''}
                                        name="title" label="Collection Title" options={collectionSuggestions.title} />

                                    <TextField wasSubmitted={wasSubmitted} size="small" fullWidth required defaultValue={props.editingCollection?.description}
                                        multiline rows={4} name="description" label="Collection Description" />

                                    <TextField wasSubmitted={wasSubmitted} size="small" fullWidth defaultValue={props.editingCollection?.globalNotes || ''}
                                        multiline rows={4} name="globalNotes" label="Global Notes" />

                                    <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="position"
                                        label="Position" descriptionLabel="Position Description" options={collectionSuggestions.position}
                                        descriptions={descriptions} onPositionBlur={handlePositionBlur} defaultValue={props.editingCollection?.position?.title || ''}
                                        descriptionDefaultValue={props.editingCollection?.position?.description || ''} />

                                    <SelectField wasSubmitted={wasSubmitted} name="hierarchy" label="Hierarchy" defaultValue={props.editingCollection?.hierarchy || ''}
                                        options={collectionSuggestions.hierarchy} required />

                                    <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="type"
                                        defaultValue={props.editingCollection?.type?.title || ''} descriptionDefaultValue={props.editingCollection?.type?.description || ''}
                                        label="Type" descriptionLabel="Type Description" options={collectionSuggestions.type} descriptions={descriptions} />

                                    <SelectField wasSubmitted={wasSubmitted} name="gi" label="Gi" defaultValue={props.editingCollection?.gi || ''}
                                        options={collectionSuggestions.gi} required />

                                    <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="openGuard"
                                        defaultValue={props.editingCollection?.openGuard?.title || ''} descriptionDefaultValue={props.editingCollection?.openGuard?.description || ''}
                                        label="Open Guard" descriptionLabel="Open Guard Description" options={collectionSuggestions.openguard}
                                        descriptions={descriptions} hidden={!isPositionOpenGuard} disabled={!isPositionOpenGuard} required={isPositionOpenGuard} />
                                </form>

                            </CardContent>
                        </Card>
                    </DialogContent>
                </Dialog>
            }
        </>
    )
}
