import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MuiCard from '@mui/material/Card'
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
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

interface NewTechniqueDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    wasSubmitted: boolean;
    techniqueOptions: {
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
}

interface Descriptions {
    positions: DescriptionMap;
    types: DescriptionMap;
    openGuards: DescriptionMap;
}

export const NewTechniqueDialog = (props: NewTechniqueDialogProps) => {
    const [localPositionState, setLocalPositionState] = React.useState('')

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                            <Autocomplete
                                options={props.techniqueOptions?.titleOptions || []}
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
                            multiline rows={4} name="description" label="Technique Description"/>

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth 
                            multiline rows={4} name="globalNotes" label="Global Notes"/>
                                    
                            <Accordion disableGutters >
                                <AccordionSummary expandIcon={<ExpandMore />}  aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.techniqueOptions?.positionOptions || []}
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
                                    <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth label="Position Description"
                                    value={localPositionDescriptionState || ''} required
                                    onChange={e => setLocalPositionDescriptionState(e.target.value)} multiline rows={4} name='positionDescription'/>
                                </AccordionDetails>
                            </Accordion>

                            <TextField wasSubmitted={props.wasSubmitted} select fullWidth name="hierarchy" label="Hierarchy" defaultValue=""> 
                                {props.techniqueOptions?.hierarchyOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                                    
                            <Accordion disableGutters>
                                <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.techniqueOptions?.typeOptions || []}
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
                                    <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth label="Type Description" required
                                    value={localTypeDescriptionState || ''}  
                                        onChange={e => setLocalTypeDescriptionState(e.target.value)} multiline rows={4} name='typeDescription' />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion disableGutters hidden={!isPositionOpenGuard}>
                                    <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.techniqueOptions?.openGuardOptions || []}
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

                            <TextField wasSubmitted={props.wasSubmitted} select fullWidth name="gi" label="Gi" defaultValue="" required>
                                {props.techniqueOptions?.giOptions?.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth name="videoSrc" label="Video Link"/>
                        </CardContent>
                    </Card>
                </DialogContent>
            </form>
        </Dialog>
    )
}
