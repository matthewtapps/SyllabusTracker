import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MuiCard from '@mui/material/Card'
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import { FastTextField } from '../Fields/FastTextField';
import { CardContent, styled } from '@mui/material';
import { Technique } from 'common';
import { TitleTextField } from '../Fields/TitleTextField';
import { TextFieldWithDescriptionField } from '../Fields/TextFieldWithDescriptionField';
import { SelectField } from '../Fields/SelectField';


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
    <MuiButton sx={{width: "100%", margin: "10px"}} variant='contained' {...props} />
))(({ theme }) => ({}));

interface NewCollectionDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    collectionOptions: {
        titleOptions: string[];
        giOptions: string[];
        hierarchyOptions: string[];
        typeOptions: string[];
        positionOptions: string[];
        openGuardOptions: string[];
    } | null;
    techniqueList: Technique[];
}

interface DescriptionMap {
    [key: string]: string | undefined;
};

interface Descriptions {
    [key: string]: DescriptionMap
};

export const NewCollectionDialog = (props: NewCollectionDialogProps) => {
    const [wasSubmitted, setWasSubmitted] = React.useState(false);
    const [localPositionState, setLocalPositionState] = React.useState('')

    const handlePositionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newPosition = event.target.value || '';
        setLocalPositionState(newPosition);
    };

    const isPositionOpenGuard = localPositionState.toLowerCase() === 'open guard';

    const generateDescriptionObjects = (techniques: Technique[]) => {
        let descriptions: Descriptions = {
            position: {},
            type: {},
            openGuard: {},
        }

        techniques.forEach(technique => {
            if (technique.position && technique.position.title) {
                descriptions.position[technique.position.title] = technique.position.description;
            }
    
            if (technique.type && technique.type.title) {
                descriptions.type[technique.type.title] = technique.type.description;
            }
    
            if (technique.openGuard && technique.openGuard.title) {
                descriptions.openGuard[technique.openGuard.title] = technique.openGuard.description;
            }
        });

        return descriptions
    }
    
    const descriptions = generateDescriptionObjects(props.techniqueList)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setWasSubmitted(true)
        if (event.currentTarget.checkValidity()) {
            await props.onSave(event);
        } else {
            console.log("Form is invalid");
        }
    };

    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} scroll="paper" maxWidth="lg">
            <form noValidate onSubmit={handleSubmit}>
                <DialogTitle sx={{padding: "0px", marginBottom: "10px"}}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={0}>
                        <Button type="submit" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                        <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                    </Box>
                </DialogTitle>
        
                <DialogContent dividers={true} sx={{padding: "0px", borderBottom: "none"}}>
                    <Card>
                        <CardContent>
                            <TitleTextField wasSubmitted={wasSubmitted} size="small" fullWidth required
                            name="title" label="Collection Title" options={props.collectionOptions?.titleOptions}/>

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth required
                            multiline rows={4} name="description" label="Collection Description"/>

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth 
                            multiline rows={4} name="globalNotes" label="Global Notes"/>
                                    
                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="position"
                            label="Position" descriptionLabel='Position Description' options={props.collectionOptions?.positionOptions}
                            onPositionBlur={handlePositionBlur} descriptions={descriptions}/>

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="type"
                            label="Type" descriptionLabel='Type Description' options={props.collectionOptions?.typeOptions}
                            descriptions={descriptions}/>

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="openGuard"
                            label="Open Guard" descriptionLabel="Open Guard Description" options={props.collectionOptions?.openGuardOptions} 
                            descriptions={descriptions} hidden={!isPositionOpenGuard} disabled={!isPositionOpenGuard} required={isPositionOpenGuard}/>

                            <SelectField wasSubmitted={wasSubmitted} name="hierarchy" label="Hierarchy" options={props.collectionOptions?.hierarchyOptions}/>

                            <SelectField wasSubmitted={wasSubmitted} name="gi" label="Gi" options={props.collectionOptions?.giOptions}/>
                        </CardContent>
                    </Card>
                </DialogContent>
            </form>
        </Dialog>
    );
};
