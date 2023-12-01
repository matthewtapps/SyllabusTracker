import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MuiCard from '@mui/material/Card'
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import theme from '../theme/Theme';
import Autocomplete from '@mui/material/Autocomplete'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FastTextField } from './FastTextField';
import { CardContent, styled } from '@mui/material';
import MenuItem from '@mui/material/MenuItem'
import { Technique } from 'common';


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

const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    margin: "0px",
    padding: "0px",
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    },
});

const AccordionSummary = styled(MuiAccordionSummary)({
    margin: "0px",
    padding: "0px"
})

const AccordionDetails = styled(MuiAccordionDetails)({
    margin: "0px",
    padding: "0px"
})

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
}

interface Descriptions {
    positions: DescriptionMap;
    types: DescriptionMap;
    openGuards: DescriptionMap;
}

export const EditTechniqueDialog = (props: EditTechniqueDialogProps) => {
    const [localPositionState, setLocalPositionState] = React.useState(props.editingTechnique?.position || '')

    const [localPositionDescriptionState, setLocalPositionDescriptionState] = React.useState<null | string>(null)
    const [localTypeDescriptionState, setLocalTypeDescriptionState] = React.useState<null | string>(null)
    const [localOpenGuardDescriptionState, setLocalOpenGuardDescriptionState] = React.useState<null | string>(null)

    const handlePositionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newPosition = event.target.value || '';
        setLocalPositionState(newPosition);
        setLocalPositionDescriptionState(descriptions.positions[newPosition] ||'')
    };

    const handleTypeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newType = event.target.value || '';
        setLocalTypeDescriptionState(descriptions.types[newType] ||'')
    };

    const handleOpenGuardBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newOpenGuard = event.target.value || '';
        setLocalOpenGuardDescriptionState(descriptions.types[newOpenGuard] ||'')
    };

    const isPositionOpenGuard = localPositionState.toLowerCase() === 'open guard';

    const generateDescriptionObjects = (techniques: Technique[]) => {
        let descriptions: Descriptions = {
            positions: {},
            types: {},
            openGuards: {},
        }

        techniques.forEach(technique => {
            if (technique.position && technique.position.title) {
                descriptions.positions[technique.position.title] = technique.position.description;
            }
    
            if (technique.type && technique.type.title) {
                descriptions.types[technique.type.title] = technique.type.description;
            }
    
            if (technique.openGuard && technique.openGuard.title) {
                descriptions.openGuards[technique.openGuard.title] = technique.openGuard.description;
            }
        });

        return descriptions
    }
    
    const descriptions = generateDescriptionObjects(props.techniqueList)

    React.useEffect(() => {
        if (props.editingTechnique?.openGuardDescription) setLocalOpenGuardDescriptionState(props.editingTechnique?.openGuardDescription)
        if (props.editingTechnique?.positionDescription) setLocalPositionDescriptionState(props.editingTechnique?.positionDescription)
        if (props.editingTechnique?.typeDescription) setLocalTypeDescriptionState(props.editingTechnique?.typeDescription)
    },[props.editingTechnique?.openGuardDescription, props.editingTechnique?.positionDescription, props.editingTechnique?.typeDescription]
    )
    
    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} scroll="paper" maxWidth="lg">
            <form noValidate onSubmit={props.onSave}>
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
                        
                            <Autocomplete
                                options={props.editingTechniqueOptions?.titleOptions || []}
                                defaultValue={props.editingTechnique?.title || ''}
                                ListboxProps={{onClick: event => event?.stopPropagation()}}
                                autoComplete
                                autoSelect
                                fullWidth
                                freeSolo
                                filterOptions={(options, { inputValue }) => {
                                    return inputValue ? options.filter(option => 
                                        option.toLowerCase().includes(inputValue.toLowerCase())
                                    ) : [];
                                }}
                                renderInput={(params) => (
                                    <TextField name="title" onClick={event => event?.stopPropagation()} required
                                    wasSubmitted={props.wasSubmitted} {...params} label="Technique Title" onBlur={handlePositionBlur}/>
                                )}
                            />

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth required
                            defaultValue={props.editingTechnique?.description} multiline rows={4} name="description" label="Technique Description"/>

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth 
                            defaultValue={props.editingTechnique?.globalNotes} multiline rows={4} name="globalNotes" label="Global Notes"/>
                                    
                            <Accordion disableGutters >
                                <AccordionSummary expandIcon={<ExpandMore />}  aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.editingTechniqueOptions?.positionOptions || []}
                                        defaultValue={props.editingTechnique?.position || ''}
                                        ListboxProps={{onClick: event => event?.stopPropagation()}}
                                        autoComplete
                                        autoSelect
                                        fullWidth
                                        freeSolo
                                        onBlur={handlePositionBlur}
                                        renderInput={(params) => (
                                            <TextField name="position" onClick={event => event?.stopPropagation()} required
                                            wasSubmitted={props.wasSubmitted} {...params} label="Position" />
                                        )}
                                    />
                                </AccordionSummary>
                                        
                                <AccordionDetails>
                                    <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth label="Position Description" required
                                    value={localPositionDescriptionState || ''} 
                                    onChange={e => setLocalPositionDescriptionState(e.target.value)} multiline rows={4} name='positionDescription'/>
                                </AccordionDetails>
                            </Accordion>

                            <TextField wasSubmitted={props.wasSubmitted} select defaultValue={props.editingTechnique?.hierarchy || ''} 
                            fullWidth name="hierarchy" label="Hierarchy" required> 
                                {props.editingTechniqueOptions?.hierarchyOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                                    
                            <Accordion disableGutters>
                                <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.editingTechniqueOptions?.typeOptions || []}
                                        defaultValue={props.editingTechnique?.type || ''}
                                        ListboxProps={{onClick: event => event?.stopPropagation()}}
                                        autoComplete
                                        autoSelect
                                        fullWidth
                                        freeSolo
                                        onBlur={handleTypeBlur}
                                        renderInput={(params) => (
                                            <TextField name="type" onClick={event => event?.stopPropagation()} required
                                            wasSubmitted={props.wasSubmitted} {...params} label="Type"/>
                                        )}
                                    />
                                </AccordionSummary>
                                        
                                <AccordionDetails>
                                    <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth required label="Type Description"
                                    value={localTypeDescriptionState || ''}  
                                        onChange={e => setLocalTypeDescriptionState(e.target.value)} multiline rows={4} name='typeDescription' />
                                </AccordionDetails>
                            </Accordion>

                            <TextField wasSubmitted={props.wasSubmitted} select defaultValue={props.editingTechnique?.gi || ''} 
                            fullWidth name="gi" label="Gi" required>
                                {props.editingTechniqueOptions?.giOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Accordion disableGutters hidden={!isPositionOpenGuard}>
                                    <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.editingTechniqueOptions?.openGuardOptions || []}
                                        defaultValue={props.editingTechnique?.openGuard || ''}
                                        ListboxProps={{onClick: event => event?.stopPropagation()}}
                                        autoComplete
                                        autoSelect
                                        fullWidth
                                        freeSolo
                                        onBlur={handleOpenGuardBlur}
                                        disabled={!isPositionOpenGuard}
                                        renderInput={(params) => (
                                            <TextField name="openGuard" onClick={event => event?.stopPropagation()} required={isPositionOpenGuard}
                                            wasSubmitted={props.wasSubmitted} {...params} label="Open Guard" />
                                        )}
                                    />
                                </AccordionSummary>
                                        
                                <AccordionDetails>
                                    <TextField wasSubmitted={props.wasSubmitted} size="small" placeholder='Open Guard Description' fullWidth disabled={!isPositionOpenGuard}
                                    value={localOpenGuardDescriptionState || ''}
                                        onChange={e => setLocalOpenGuardDescriptionState(e.target.value)} multiline rows={4} 
                                        name='openGuardDescription' label="Open Guard Description" required={isPositionOpenGuard}/> 
                                </AccordionDetails>
                            </Accordion>

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth label="Video Source"
                            defaultValue={props.editingTechnique?.videoSrc} name="videoSrc"/>
                        </CardContent>
                    </Card>
                </DialogContent>
            </form>
        </Dialog>
    )
}