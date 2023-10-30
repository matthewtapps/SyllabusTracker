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
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import MuiTextField from '@mui/material/TextField'
import MuiCard from '@mui/material/Card';
import theme from '../theme/Theme';

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

const TextField = styled(MuiTextField)({
})

const SubAccordion = styled(MuiAccordion)({
    backgroundColor: `inherit`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

const ListItem = styled(MuiListItem)({
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px"
})

interface ExtendedListItemTextProps extends ListItemTextProps {
    smalltext: boolean
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

interface TechniquesListProps {
    filteredTechniques: Technique[];
    checkbox?: boolean;
    ordered?: boolean;
    elevation: number;
    editable?: boolean;
    onTechniqueEdit?: (techniuqeId: string, updatedTechniuqe: Technique) => void;
    onTechniqueDelete?: (techniqueId: string) => void;
    checkedTechniques?: {index: number, technique: Technique}[];
    onTechniqueCheck?: (techniqueId: string) => void;
}

TechniqueList.defaultProps = {
    checkbox: false,
    elevation: 3,
    ordered: false,
    editable: false
}

function TechniqueList(props: TechniquesListProps): JSX.Element {

    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string | null>(null);
    const [editedTechnique, setEditedTechnique] = React.useState<Technique | null>(null);

    const handleEditClick = (technique: Technique) => {
        setEditingTechniqueId(technique.techniqueId);
        setEditedTechnique(technique);
    }

    const handleSaveClick = () => {
        if (editedTechnique && props.onTechniqueEdit) {
            props.onTechniqueEdit(editingTechniqueId!, editedTechnique);
        }
        setEditingTechniqueId(null);
        setEditedTechnique(null);
    }

    const handleCancelClick = () => {
        setEditingTechniqueId(null);
        setEditedTechnique(null);
    }

    const handleDeleteClick = (techniqueId: string) => {
        if (props.onTechniqueDelete) {
            props.onTechniqueDelete(techniqueId);
        }
    }

    return (
        <React.Fragment>
            {props.filteredTechniques.map((technique, index) => {
                const SubCard = styled(MuiCard)({
                    backgroundColor: 'inherit',
                })

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

                            {props.ordered && (
                                <Box display="flex" alignItems="center" marginLeft="0px">
                                    <Typography variant="body1">{currentOrder + ". "}</Typography>
                                    <Typography variant="body1" style={{marginLeft: "8px"}}>{technique.title}</Typography>
                                </Box>
                            )}

                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" width="97%">
                                    {!props.checkbox && !props.ordered && (
                                        (editingTechniqueId === technique.techniqueId) ? (
                                            <TextField size="medium" fullWidth defaultValue={technique?.title}/>
                                        ) : (
                                            <Typography variant="h6">{technique?.title}</Typography>
                                        )
                                    )}
                                    {props.editable && !(editingTechniqueId === technique.techniqueId) && (
                                        <Edit onClick={(event) => { event.stopPropagation(); handleEditClick(technique); }}>Edit</Edit>
                                    )}
                                </Box>
                                    
                                {editingTechniqueId === technique.techniqueId && (
                                    <Box display="flex" justifyContent="space-between" sx={{}} alignItems="center" width="97%" mt={1}>
                                        <Button onClick={(event) => { event.stopPropagation(); handleSaveClick(); }}>Save</Button>
                                        <Button onClick={(event) => { event.stopPropagation(); handleCancelClick(); }}>Cancel</Button>
                                        <Button onClick={(event) => { event.stopPropagation(); handleDeleteClick(technique.techniqueId); }}
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
                                secondary={(editingTechniqueId === technique.techniqueId) ? 
                                    <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.description} multiline rows={4}/> : 
                                    technique?.description
                                }
                                />
                            </ListItem>

                            {(technique?.globalNotes || editingTechniqueId === technique.techniqueId) && (
                                <ListItem>
                                    <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false} 
                                    primary="Global Notes"
                                    secondary={(editingTechniqueId === technique.techniqueId) ? 
                                        <TextField size="small" placeholder='Optional' fullWidth style={{marginRight: "20px"}} defaultValue={technique?.globalNotes} multiline rows={4}/> : 
                                        technique?.globalNotes
                                    }
                                    />
                                </ListItem>
                            )}
    
                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false}                                    
                                        primary="Position" 
                                        secondary={(editingTechniqueId === technique.techniqueId) ? 
                                            <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.position.title}/> : 
                                            technique?.position.title
                                        } 
                                        />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem >
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false}  
                                        secondary={(editingTechniqueId === technique.techniqueId) ? 
                                            <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.position.description} multiline rows={4}/> : 
                                            technique?.position.description
                                        }
                                        />
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            <ListItem>
                                <ListItemText
                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                primary="Hierarchy" 
                                secondary={(editingTechniqueId === technique.techniqueId) ? 
                                    <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.hierarchy}/> : 
                                    technique?.hierarchy
                                }
                                />
                            </ListItem>

                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false} 
                                        primary="Type" 
                                        secondary={(editingTechniqueId === technique.techniqueId) ? 
                                            <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.type.title}/> : 
                                            technique?.type.title
                                        }
                                        />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false} 
                                        secondary={(editingTechniqueId === technique.techniqueId) ? 
                                            <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.type.description} multiline rows={4}/> : 
                                            technique?.type.description
                                        }
                                        />
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            {(technique?.openGuard || editingTechniqueId === technique.techniqueId) && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false} 
                                            primary="Open Guard"
                                            secondary={(editingTechniqueId === technique.techniqueId) ? 
                                                <TextField size="small" placeholder='Optional' fullWidth style={{marginRight: "20px"}} defaultValue={technique?.openGuard?.title}/> : 
                                                technique?.openGuard?.title
                                            }
                                            />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}   
                                            secondary={(editingTechniqueId === technique.techniqueId) ? 
                                                <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.openGuard?.description} multiline rows={4}/> : 
                                                technique?.openGuard?.description
                                            }
                                            />
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            <ListItem>
                                <ListItemText
                                smalltext={(props.checkbox || props.ordered) ? true : false}  
                                primary="Gi or No Gi" 
                                secondary={(editingTechniqueId === technique.techniqueId) ? 
                                    <TextField size="small" fullWidth style={{marginRight: "20px"}} defaultValue={technique?.gi}/> : 
                                    technique?.gi
                                }
                                />
                            </ListItem>
                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})}
        </React.Fragment>
    )
}

export default TechniqueList
