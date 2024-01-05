import Edit from '@mui/icons-material/Edit';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button, CardContent } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { default as Card, default as MuiCard } from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Technique } from 'common';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { EditNoteSharp, PublicSharp, VideocamSharp } from '@mui/icons-material';


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
    videos: string | undefined,
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
            secondaryTypographyProps={{ component: 'div' }}
            primaryTypographyProps={{ component: 'div' }}
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
    filteredTechniques?: Technique[];
    checkbox?: boolean;
    ordered?: boolean;
    elevation: number;
    editable?: boolean;
    checkedTechniques?: { index: number, technique: Technique }[];
    onTechniqueCheck?: (techniqueId: string) => void;
    editingTechniqueId?: string | null;
    editingTechnique?: TechniqueDTO | null;
    onEditClick?: (technique: Technique) => void;
}

TechniqueList.defaultProps = {
    checkbox: false,
    elevation: 3,
    ordered: false,
    editable: false,
}

function TechniqueList(props: TechniquesListProps): JSX.Element {
    const { techniques } = useSelector((state: RootState) => state.techniques);

    const techniquesToDisplay = props.filteredTechniques || techniques

    return (
        <div>
            {techniquesToDisplay.length > 0 ? (
                techniquesToDisplay.map((technique, index) => {
                    let currentOrder = props.ordered ? index + 1 : null;
                    return (
                        <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
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
                                            <Typography variant="h6">{technique.title}</Typography>
                                        </Box>
                                    )}

                                    <Box display="flex" flexDirection="column" flexGrow={1}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                            {!props.checkbox && (
                                                <Box display="flex" alignItems="center" marginLeft="0px">
                                                    {props.ordered && (
                                                        <Typography variant="body1" style={{ marginRight: "8px" }}>{currentOrder + ". "}</Typography>
                                                    )}
                                                    <Typography variant="body1">{technique?.title}</Typography>
                                                </Box>
                                            )}
                                            {props.editable && !(props.editingTechniqueId === technique.techniqueId) && !(props.editingTechniqueId) && (
                                                <Edit onClick={(event) => { event.stopPropagation(); props.onEditClick?.(technique); }} />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SubCard elevation={0}>
                                    <ListItem key={`${technique.techniqueId}-description`}>
                                        <ListItemText sx={{ margin: "0px" }}
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Description"
                                            secondary={technique?.description}
                                        />
                                    </ListItem>

                                    {technique?.globalNotes && (
                                        <ListItem key={`${technique.techniqueId}-globalNotes`}>
                                            <ListItemText
                                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                                primary="Global Notes"
                                                secondary={technique?.globalNotes} />
                                        </ListItem>
                                    )}

                                    {technique?.videos && technique.videos.map((video, index) => (
                                        <ListItem key={`${technique.techniqueId}-video-${index}`}>
                                            <ListItemText
                                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                                primary={"Video: " + video.title}
                                                secondary={<Button variant="contained" sx={{ minWidth: "85px", marginLeft: "5px", marginTop: "5px" }}><VideocamSharp /></Button>}
                                            />
                                        </ListItem>
                                    ))}

                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-position`}>
                                                <ListItemText
                                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                                    primary="Position"
                                                    secondary={technique?.position?.title}
                                                />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-positionDescription`}>
                                                <ListItemText
                                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                                    secondary={technique?.position.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>

                                    <ListItem key={`${technique.techniqueId}-hierarchy`}>
                                        <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Hierarchy"
                                            secondary={technique?.hierarchy}
                                        />
                                    </ListItem>

                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-type`}>
                                                <ListItemText
                                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                                    primary="Type"
                                                    secondary={technique?.type.title}
                                                />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-typeDescription`}>
                                                <ListItemText
                                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                                    secondary={technique?.type.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>

                                    {technique?.openGuard && (
                                        <SubAccordion elevation={0} disableGutters square>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem key={`${technique.techniqueId}-openGuard`}>
                                                    <ListItemText
                                                        smalltext={(props.checkbox || props.ordered) ? true : false}
                                                        primary="Open Guard"
                                                        secondary={technique?.openGuard?.title}
                                                    />
                                                </ListItem>
                                            </AccordionSummary>

                                            <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem key={`${technique.techniqueId}-openGuardDescription`}>
                                                    <ListItemText
                                                        smalltext={(props.checkbox || props.ordered) ? true : false}
                                                        secondary={technique?.openGuard?.description} />
                                                </ListItem>
                                            </AccordionDetails>
                                        </SubAccordion>
                                    )}

                                    <ListItem key={`${technique.techniqueId}-gi`}>
                                        <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Gi or No Gi"
                                            secondary={technique?.gi}
                                        />
                                    </ListItem>
                                </SubCard>
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            ) : (
                <Card style={{ backgroundColor: `#3c3836` }} elevation={0}>
                    <CardContent>
                        <Typography variant='body1'>No techniques available</Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default TechniqueList
