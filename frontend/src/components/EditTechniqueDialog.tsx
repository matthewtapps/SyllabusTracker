import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MuiCard from '@mui/material/Card'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import theme from '../theme/Theme';
import Autocomplete from '@mui/material/Autocomplete'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FastTextField as TextField } from './FastTextField';
import { styled } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'


const SubCard = styled(MuiCard)({
    backgroundColor: 'inherit',
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
    onDelete: () => void;
    onSave: () => void;
    wasSubmitted: boolean;
    editingTechnique: TechniqueDTO;
    editingTechniqueOptions: {
        techniqueTitleOptions: string[],
        techniquePositionOptions: string[],
        techniqueHierarchyOptions: string[],
        techniqueTypeOptions: string[],
        techniqueOpenGuardOptions: string[],
        techniqueGiOptions: string[]
    } | null;

}

export const EditTechniqueDialog = (props: EditTechniqueDialogProps) => {
    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} scroll="paper">
            <DialogTitle sx={{padding: "0px", marginBottom: "10px"}}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={1}>
                    <Button onClick={(event) => { event.stopPropagation(); props.onSave() }}>Save</Button>
                    <Button onClick={(event) => { event.stopPropagation(); props.onCancel(); }}>Cancel</Button>
                    <Button onClick={(event) => { event.stopPropagation(); props.onDelete(); }}
                        style={{backgroundColor: theme.palette.error.main}}
                    >Delete</Button>
                </Box>
            </DialogTitle>

            <DialogContent dividers={true} sx={{padding: "0px"}}> 
                <form noValidate onSubmit={props.onSave}>
                    <Autocomplete
                        options={props.editingTechniqueOptions?.techniqueTitleOptions || []}
                        defaultValue={props.editingTechnique?.title || ''}
                        ListboxProps={{onClick: event => event?.stopPropagation()}}
                        autoComplete
                        autoSelect
                        fullWidth
                        freeSolo
                        renderInput={(params) => (
                            <TextField name="title" onClick={event => event?.stopPropagation()} wasSubmitted={props.wasSubmitted} {...params} />
                        )}
                    />
                    <SubCard elevation={0}>
                        <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                        defaultValue={props.editingTechnique?.description} multiline rows={4} name="description"/>

                        <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                        defaultValue={props.editingTechnique?.globalNotes} multiline rows={4} name="globalNotes"/>


                        <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                        defaultValue={props.editingTechnique?.videoSrc} name="videoSrc"/>


                        <Autocomplete
                            options={props.editingTechniqueOptions?.techniquePositionOptions || []}
                            defaultValue={props.editingTechnique?.position || ''}
                            ListboxProps={{onClick: event => event?.stopPropagation()}}
                            autoComplete
                            autoSelect
                            fullWidth
                            freeSolo
                            renderInput={(params) => (
                                <TextField name="position" onClick={event => event?.stopPropagation()} wasSubmitted={props.wasSubmitted} {...params} />
                            )}
                        />

                        <TextField wasSubmitted={props.wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                        defaultValue={props.editingTechnique?.positionDescription} multiline rows={4} name='positionDescription'/>

                        <Select defaultValue={props.editingTechnique?.hierarchy || ''} fullWidth name="hierarchy">
                            {props.editingTechniqueOptions?.techniqueHierarchyOptions.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                            
                        <Autocomplete
                            options={props.editingTechniqueOptions?.techniqueTypeOptions || []}
                            defaultValue={props.editingTechnique?.type || ''}
                            ListboxProps={{onClick: event => event?.stopPropagation()}}
                            autoComplete
                            autoSelect
                            fullWidth
                            freeSolo
                            renderInput={(params) => (
                                <TextField name="type" onClick={event => event?.stopPropagation()} wasSubmitted={props.wasSubmitted} {...params} />
                            )}
                        />

                        <TextField wasSubmitted={props.wasSubmitted} size="small" placeholder='Technique Type Description' fullWidth style={{marginRight: "20px"}} 
                        defaultValue={props.editingTechnique?.typeDescription} multiline rows={4} name='typeDescription'/>

                        <Autocomplete
                            options={props.editingTechniqueOptions?.techniqueOpenGuardOptions || []}
                            defaultValue={props.editingTechnique?.openGuard || ''}
                            ListboxProps={{onClick: event => event?.stopPropagation()}}
                            autoComplete
                            autoSelect
                            fullWidth
                            freeSolo
                            renderInput={(params) => (
                                <TextField name="openGuard" onClick={event => event?.stopPropagation()} wasSubmitted={props.wasSubmitted} {...params} />
                            )}
                        />

                            
                        <TextField wasSubmitted={props.wasSubmitted} size="small" placeholder='Open Guard Description' fullWidth style={{marginRight: "20px"}} 
                        defaultValue={props.editingTechnique?.openGuardDescription} multiline rows={4} name='openGuardDescription'/> 

                        <Select
                            defaultValue={props.editingTechnique?.gi || ''}
                            MenuProps={{onClick: event => event?.stopPropagation()}}
                            fullWidth
                            name="gi"
                        >
                            {props.editingTechniqueOptions?.techniqueGiOptions.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </SubCard>
                </form>
                <div style={{paddingTop: "10px"}}/>
            </DialogContent>
        </Dialog>
    )
}
