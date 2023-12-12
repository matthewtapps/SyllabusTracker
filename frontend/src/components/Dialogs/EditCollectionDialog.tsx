import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MuiCard from '@mui/material/Card'
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import theme from '../../theme/Theme';
import Autocomplete from '@mui/material/Autocomplete'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FastTextField } from '../Fields/FastTextField';
import { CardContent, styled } from '@mui/material';
import MenuItem from '@mui/material/MenuItem'
import { Collection, Technique } from 'common';


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

interface EditCollectionDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onDelete: (techniqueId: string) => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    wasSubmitted: boolean;
    editingCollection: Collection | null;
    editingCollectionId: string;
    editingCollectionOptions: {
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

export const EditCollectionDialog = (props: EditCollectionDialogProps) => {
    const [localPositionState, setLocalPositionState] = React.useState(props.editingCollection?.position?.title || '')

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
        if (props.editingCollection?.openGuard?.description) setLocalOpenGuardDescriptionState(props.editingCollection?.openGuard.description)
        if (props.editingCollection?.position?.description) setLocalPositionDescriptionState(props.editingCollection?.position?.description)
        if (props.editingCollection?.type?.description) setLocalTypeDescriptionState(props.editingCollection?.type?.description)
    },[props.editingCollection?.openGuard?.description, props.editingCollection?.position?.description, props.editingCollection?.type?.description]
    )
    
    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} scroll="paper" maxWidth="lg">
            <form noValidate onSubmit={props.onSave}>
                <DialogTitle sx={{padding: "0px", marginBottom: "10px"}}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={0}>
                        <Button type="submit" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                        <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                        <Button onClick={(event) => { event.stopPropagation(); props.onDelete(props.editingCollectionId); }}
                            style={{backgroundColor: theme.palette.error.main}}
                        >Delete</Button>
                    </Box>
                </DialogTitle>
        
                <DialogContent dividers={true} sx={{padding: "0px", borderBottom: "none"}}>
                    <Card>
                        <CardContent>
                            <Autocomplete
                                options={props.editingCollectionOptions?.titleOptions || ['']}
                                defaultValue={props.editingCollection?.title || ''}
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
                                    wasSubmitted={props.wasSubmitted} {...params} label="Collection Title" onBlur={handlePositionBlur}/>
                                )}
                            />

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth required
                            defaultValue={props.editingCollection?.description} multiline rows={4} name="description" label="Collection Description"/>

                            <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth 
                            defaultValue={props.editingCollection?.globalNotes || ''} multiline rows={4} name="globalNotes" label="Global Notes"/>
                                    
                            <Accordion disableGutters >
                                <AccordionSummary expandIcon={<ExpandMore />}  aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.editingCollectionOptions?.positionOptions || ['']}
                                        defaultValue={props.editingCollection?.position?.title || ''}
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

                            <TextField wasSubmitted={props.wasSubmitted} select defaultValue={props.editingCollection?.hierarchy || ''} 
                            fullWidth name="hierarchy" label="Hierarchy" required> 
                                {props.editingCollectionOptions?.hierarchyOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                                    
                            <Accordion disableGutters>
                                <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.editingCollectionOptions?.typeOptions || ['']}
                                        defaultValue={props.editingCollection?.type?.title || ''}
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

                            <Accordion disableGutters hidden={!isPositionOpenGuard}>
                                    <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                                    <Autocomplete
                                        options={props.editingCollectionOptions?.openGuardOptions || ['']}
                                        defaultValue={props.editingCollection?.openGuard?.title || ''}
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

                            <TextField wasSubmitted={props.wasSubmitted} select defaultValue={props.editingCollection?.gi || ''} 
                            fullWidth name="gi" label="Gi" required>
                                {props.editingCollectionOptions?.giOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </CardContent>
                    </Card>
                </DialogContent>
            </form>
        </Dialog>
    )
}
