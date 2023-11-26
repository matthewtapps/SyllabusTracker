import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Edit from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import { Technique } from 'common';
import MuiButton, {ButtonProps} from '@mui/material/Button'
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import { FastTextField as TextField } from './FastTextField';
import MuiCard from '@mui/material/Card';
import theme from '../theme/Theme';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Autocomplete } from '@mui/material';

const Button = styled((props: ButtonProps) => (
    <MuiButton sx={{width: "80px", marginBottom: "10px"}} variant='contained' {...props} />
))(({ theme }) => ({}));

const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    },
    '&:not(:last-child)': {
        borderBottom: '1px solid #7c6f64'
    }
});

const SubAccordion = styled(MuiAccordion)({
    backgroundColor: `inherit`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

const ListItem = styled(MuiListItem)({
    paddingTop: "0px",
    paddingLeft: "0px",
    '&.MuiListItem-root.Mui-selected': {
        backgroundColor: 'inherit'
    }
})

interface ExtendedListItemTextProps extends ListItemTextProps {
    smalltext: boolean
}

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

const BaseListItemText: React.FC<ExtendedListItemTextProps> = (props) => {
    const { smalltext, ...otherProps } = props;
    return (
        <MuiListItemText 
            {...otherProps} 
            secondaryTypographyProps={{ component: 'div'}}
            primaryTypographyProps={{ component: 'div'}}
        />
    );
}

const ListItemText = styled(BaseListItemText)<ExtendedListItemTextProps>(({ theme, smalltext }) => {
    let primaryVariant = 'h6';
    let secondaryVariant = 'body1';

    if (smalltext) {
        primaryVariant = 'body1';
        secondaryVariant = 'body2';
    }
    
    return {
        '& .MuiTypography-root': {
            variant: primaryVariant
        },
        '& .MuiTypography-colorTextSecondary': {
            variant: secondaryVariant
        }
    };
});

const SubCard = styled(MuiCard)({
    backgroundColor: 'inherit',
})

interface TechniquesListProps {
    filteredTechniques: Technique[];
    checkbox?: boolean;
    ordered?: boolean;
    elevation: number;
    editable?: boolean;
    checkedTechniques?: {index: number, technique: Technique}[];
    onTechniqueCheck?: (techniqueId: string) => void;
    editingTechniqueId?: string | null;
    editingTechnique?: TechniqueDTO | null;
    onEditClick?: (technique: Technique) => void;
    onSubmitClick?: (event: React.FormEvent<HTMLFormElement>) => void;
    onCancelClick?: () => void;
    onDeleteClick?: (techniqueId: string) => void;
    editingTechniqueOptions: {
        techniqueTitleOptions: string[],
        techniquePositionOptions: string[],
        techniqueHierarchyOptions: string[],
        techniqueTypeOptions: string[],
        techniqueOpenGuardOptions: string[],
        techniqueGiOptions: string[]
    } | null;
}  

TechniqueList.defaultProps = {
    checkbox: false,
    elevation: 3,
    ordered: false,
    editable: false,
    editingTechniqueOptions: null
}

function TechniqueList(props: TechniquesListProps): JSX.Element {

    const [wasSubmitted, setWasSubmitted] = React.useState(false)

    return (
        <form noValidate onSubmit={props.onSubmitClick}>
            {props.filteredTechniques.map((technique, index) => {
                let currentOrder = props.ordered ? index + 1 : null;
            return (
                <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                    >
                        <Box display="flex" flexDirection="row" width="100%">
                            {props.checkbox && (
                                <Box display="flex" alignItems="center" marginLeft="0px">
                                    <Checkbox
                                        size='small'
                                        checked={props.checkedTechniques?.some(item => item.technique === technique)}
                                        onChange={() => props.onTechniqueCheck?.(technique.techniqueId)}
                                        onClick={e => e.stopPropagation()}
                                    />
                                    <Typography variant="body1">{technique.title}</Typography>
                                </Box>
                            )}

                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                    {!props.checkbox && (
                                        (props.editingTechniqueId === technique.techniqueId) ? (
                                            <Autocomplete
                                                    options={props.editingTechniqueOptions?.techniqueTitleOptions || []}
                                                    defaultValue={props.editingTechnique?.title || ''}
                                                    ListboxProps={{onClick: event => event?.stopPropagation()}}
                                                    autoComplete
                                                    autoSelect
                                                    fullWidth
                                                    freeSolo
                                                    renderInput={(params) => (
                                                        <TextField name="title" onClick={event => event?.stopPropagation()} wasSubmitted={wasSubmitted} {...params} />
                                                    )}
                                                />
                                        ) : 
                                        <Box display="flex" alignItems="center" marginLeft="0px">
                                            {props.ordered && (
                                            <Typography variant="body1" style={{marginRight: "8px"}}>{currentOrder + ". "}</Typography>
                                            )}
                                            <Typography variant="body1">{technique?.title}</Typography>
                                        </Box>
                                    )}
                                    {props.editable && !(props.editingTechniqueId === technique.techniqueId) && !(props.editingTechniqueId) && (
                                        <Edit onClick={(event) => { event.stopPropagation(); props.onEditClick?.(technique); }}/>
                                    )}
                                </Box>

                                {props.editingTechniqueId === technique.techniqueId && (
                                    <Box display="flex" justifyContent="space-between" alignItems="center" width="97%" mt={1}>
                                        <Button type="submit" onClick={(event) => { event.stopPropagation() }}>Save</Button>
                                        <Button onClick={(event) => { event.stopPropagation(); props.onCancelClick?.(); }}>Cancel</Button>
                                        <Button onClick={(event) => { event.stopPropagation(); props.onDeleteClick?.(technique.techniqueId); }}
                                            style={{backgroundColor: theme.palette.error.main}}
                                        >Delete</Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <ListItem>                                
                                <ListItemText sx={{margin: "0px"}}
                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                primary="Description"
                                secondary={(props.editingTechniqueId === technique.techniqueId) ? 
                                    <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                    defaultValue={props.editingTechnique?.description} multiline rows={4} name="description"/> : 
                                    technique?.description
                                }
                                />
                            </ListItem>

                            {(technique?.globalNotes || props.editingTechniqueId === technique.techniqueId) && (
                                <ListItem>
                                    <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false} 
                                    primary="Global Notes"
                                    secondary={(props.editingTechniqueId === technique.techniqueId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={props.editingTechnique?.globalNotes} multiline rows={4} name="globalNotes"/> : technique?.globalNotes }/>
                                </ListItem>
                            )}

                            {(technique?.videoSrc || props.editingTechniqueId === technique.techniqueId) && (
                                <ListItem>
                                    <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false} 
                                    primary="Video Link"
                                    secondary={(props.editingTechniqueId === technique.techniqueId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={props.editingTechnique?.videoSrc} name="videoSrc"/> : technique?.videoSrc }/>
                                </ListItem>
                            )}
    
                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Position"
                                            secondary={props.editingTechniqueId === technique.techniqueId ? (
                                                <Autocomplete
                                                    options={props.editingTechniqueOptions?.techniquePositionOptions || []}
                                                    defaultValue={props.editingTechnique?.position || ''}
                                                    ListboxProps={{onClick: event => event?.stopPropagation()}}
                                                    autoComplete
                                                    autoSelect
                                                    fullWidth
                                                    freeSolo
                                                    renderInput={(params) => (
                                                        <TextField name="position" onClick={event => event?.stopPropagation()} wasSubmitted={wasSubmitted} {...params} />
                                                    )}
                                                />
                                            ) : (
                                                technique?.position?.title
                                            )}
                                        />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem >
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false}  
                                        secondary={(props.editingTechniqueId === technique.techniqueId) ? 
                                            <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                            defaultValue={props.editingTechnique?.positionDescription} multiline rows={4} name='positionDescription'/> : technique?.position.description }/>
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            <ListItem>
                                <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                    primary="Hierarchy"
                                    secondary={props.editingTechniqueId === technique.techniqueId ? (
                                        <Select
                                            defaultValue={props.editingTechnique?.hierarchy || ''}
                                            fullWidth
                                            name="hierarchy"
                                        >
                                            {props.editingTechniqueOptions?.techniqueHierarchyOptions.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        technique?.hierarchy
                                    )}
                                />
                            </ListItem>

                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Type"
                                            secondary={props.editingTechniqueId === technique.techniqueId ? (
                                                <Autocomplete
                                                    options={props.editingTechniqueOptions?.techniqueTypeOptions || []}
                                                    defaultValue={props.editingTechnique?.type || ''}
                                                    ListboxProps={{onClick: event => event?.stopPropagation()}}
                                                    autoComplete
                                                    autoSelect
                                                    fullWidth
                                                    freeSolo
                                                    renderInput={(params) => (
                                                        <TextField name="type" onClick={event => event?.stopPropagation()} wasSubmitted={wasSubmitted} {...params} />
                                                    )}
                                                />
                                            ) : (
                                                technique?.type.title
                                            )}
                                        />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false} 
                                        secondary={(props.editingTechniqueId === technique.techniqueId) ? 
                                            <TextField wasSubmitted={wasSubmitted} size="small" placeholder='Technique Type Description' fullWidth style={{marginRight: "20px"}} 
                                            defaultValue={props.editingTechnique?.typeDescription} multiline rows={4} name='typeDescription'/> : technique?.type.description }/>
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            {(technique?.openGuard || props.editingTechniqueId === technique.techniqueId) && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText
                                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                                primary="Open Guard"
                                                secondary={props.editingTechniqueId === technique.techniqueId ? (
                                                    <Autocomplete
                                                        options={props.editingTechniqueOptions?.techniqueOpenGuardOptions || []}
                                                        defaultValue={props.editingTechnique?.openGuard || ''}
                                                        ListboxProps={{onClick: event => event?.stopPropagation()}}
                                                        autoComplete
                                                        autoSelect
                                                        fullWidth
                                                        freeSolo
                                                        renderInput={(params) => (
                                                            <TextField name="openGuard" onClick={event => event?.stopPropagation()} wasSubmitted={wasSubmitted} {...params} />
                                                        )}
                                                    />
                                                ) : (
                                                    technique?.openGuard?.title
                                                )}
                                            />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}   
                                            secondary={(props.editingTechniqueId === technique.techniqueId) ? 
                                                <TextField wasSubmitted={wasSubmitted} size="small" placeholder='Open Guard Description' fullWidth style={{marginRight: "20px"}} 
                                                defaultValue={props.editingTechnique?.openGuardDescription} multiline rows={4} name='openGuardDescription'/> 
                                                : technique?.openGuard?.description }/>
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            <ListItem>
                                <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                    primary="Gi or No Gi"
                                    secondary={props.editingTechniqueId === technique.techniqueId ? (
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
                                    ) : (
                                        technique?.gi
                                    )}
                                />
                            </ListItem>
                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})}
        </form>
    )
}

export default TechniqueList
