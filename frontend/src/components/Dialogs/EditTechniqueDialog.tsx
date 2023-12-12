import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MuiCard from '@mui/material/Card'
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import theme from '../../theme/Theme';
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

interface TechniqueDTO {
    title: string,
    videoSrc: string | undefined,
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
    wasSubmitted: boolean;
    editingTechnique: TechniqueDTO;
    editingTechniqueId: string;
    editingTechniqueOptions: {
        titleOptions: string[],
        positionOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        openGuardOptions: string[],
        giOptions: string[]
    } | null;
    techniqueList: Technique[];
}

interface DescriptionMap {
    [key: string]: string | undefined;
};

interface Descriptions {
    [key: string]: DescriptionMap
};

export const EditTechniqueDialog = (props: EditTechniqueDialogProps) => {
    const [wasSubmitted, setWasSubmitted] = React.useState(false);
    const [localPositionState, setLocalPositionState] = React.useState(props.editingTechnique?.position || '')

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
                        <Button onClick={(event) => { event.stopPropagation(); props.onDelete(props.editingTechniqueId); }}
                            style={{backgroundColor: theme.palette.error.main}}
                        >Delete</Button>
                    </Box>
                </DialogTitle>
        
                <DialogContent dividers={true} sx={{padding: "0px", borderBottom: "none"}}>
                    <Card>
                        <CardContent>
                            <TitleTextField wasSubmitted={wasSubmitted} size="small" fullWidth required defaultValue={props.editingTechnique?.title || ''}
                            name="title" label="Technique Title" options={props.editingTechniqueOptions?.titleOptions}/>

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth required defaultValue={props.editingTechnique?.description || ''}
                             multiline rows={4} name="description" label="Technique Description"/>

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth defaultValue={props.editingTechnique?.globalNotes || ''} 
                            multiline rows={4} name="globalNotes" label="Global Notes"/>

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="position"
                            label="Position" descriptionLabel="Position Description" options={props.editingTechniqueOptions?.positionOptions} 
                            descriptions={descriptions} onPositionBlur={handlePositionBlur} defaultValue={props.editingTechnique?.position || ''} 
                            descriptionDefaultValue={props.editingTechnique?.positionDescription || ''}/>

                            <SelectField wasSubmitted={wasSubmitted} name="hierarchy" label="Hierarchy" defaultValue={props.editingTechnique?.hierarchy || ''}
                            options={props.editingTechniqueOptions?.hierarchyOptions} required/>
                                    
                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth required name="type" 
                            defaultValue={props.editingTechnique?.type || ''} descriptionDefaultValue={props.editingTechnique?.typeDescription || ''}
                            label="Type" descriptionLabel="Type Description" options={props.editingTechniqueOptions?.typeOptions} descriptions={descriptions} />

                            <SelectField wasSubmitted={wasSubmitted} name="gi" label="Gi" defaultValue={props.editingTechnique?.gi || ''}
                            options={props.editingTechniqueOptions?.giOptions} required/>

                            <TextFieldWithDescriptionField wasSubmitted={wasSubmitted} size="small" fullWidth name="openGuard" 
                            defaultValue={props.editingTechnique?.openGuard || ''} descriptionDefaultValue={props.editingTechnique?.openGuardDescription || ''}
                            label="Open Guard" descriptionLabel="Open Guard Description" options={props.editingTechniqueOptions?.openGuardOptions} 
                            descriptions={descriptions} hidden={!isPositionOpenGuard} disabled={!isPositionOpenGuard} required={isPositionOpenGuard}/>

                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth label="Video Source"
                            defaultValue={props.editingTechnique?.videoSrc} name="videoSrc"/>
                        </CardContent>
                    </Card>
                </DialogContent>
            </form>
        </Dialog>
    );
};
