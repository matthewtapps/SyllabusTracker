import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button, CardContent } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { default as Card, default as MuiCard } from '@mui/material/Card';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Technique, TechniqueStatus } from 'common';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStudentTechniqueAsync, postStudentTechniquesAsync, updateStudentTechniqueAsync } from '../../../slices/student';
import { AppDispatch, RootState } from '../../../store/store';
import { CircleIcon, Option } from '../../Buttons/CircleIcon';
import { EditNoteSharp, PersonSharp, PublicSharp, VideocamSharp } from '@mui/icons-material';


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
    videos: {title: string, hyperlink: string}[] | undefined,
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
    ordered?: boolean;
    elevation: number;
    editable?: boolean;
    editingTechniqueId?: string | null;
    editingTechnique?: TechniqueDTO | null;
    expandedTechniqueId?: string;
    onAccordionChange?: (techniqueId: string) => void;
}

StudentTechniqueList.defaultProps = {
    elevation: 3,
    ordered: false,
    editable: false,
}

function StudentTechniqueList(props: TechniquesListProps): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    const iconColor = (techniqueStatus: TechniqueStatus | undefined): string => {
        if (techniqueStatus === TechniqueStatus.Started) {
            return "#d79921";
        } else if (techniqueStatus === TechniqueStatus.Passed) {
            return "#689d6a";
        } else {
            return "#665c54";
        }

    }

    const { techniques } = useSelector((state: RootState) => state.techniques);
    const { selectedStudentTechniques } = useSelector((state: RootState) => state.student)

    const techniquesToDisplay = props.filteredTechniques || techniques

    const handleIndicatorFill = (technique: Technique) => {
        const matchingTechnique = selectedStudentTechniques.find(st =>
            st.technique.techniqueId === technique.techniqueId
        )
        return iconColor(matchingTechnique?.status)
    }

    const menuActions = {
        [Option.Assign]: async (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (!matchedTechnique) {
                await dispatch(postStudentTechniquesAsync([technique])).unwrap();
            }
            await dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.NotYetStarted } })).unwrap();
        },
        [Option.Started]: async (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (!matchedTechnique) {
                await dispatch(postStudentTechniquesAsync([technique])).unwrap();
            }
            await dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Started } })).unwrap();
        },
        [Option.Passed]: async (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (!matchedTechnique) {
                await dispatch(postStudentTechniquesAsync([technique])).unwrap();
            }
            await dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Passed } })).unwrap();
        },
        [Option.Unassign]: (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (matchedTechnique) {
                dispatch(deleteStudentTechniqueAsync(matchedTechnique.studentTechniqueId));
            }
        }
    };

    const handleAction = (technique: Technique) => async (option: Option) => {
        const action = menuActions[option];
        if (action) {
            await action(technique);
        }
    };

    return (
        <div>
            {techniquesToDisplay.length > 0 ? (
                techniquesToDisplay.map((technique, index) => {
                    let currentOrder = props.ordered ? index + 1 : null;
                    return (
                        <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}
                            expanded={props.expandedTechniqueId ? props.expandedTechniqueId === technique.techniqueId : undefined}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                            >
                                <Box display="flex" flexDirection="row" width="100%">
                                    <Box display="flex" flexDirection="column" flexGrow={1}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                            <Box display="flex" alignItems="center" marginLeft="0px">
                                                {props.ordered && (
                                                    <Typography variant="body1" style={{ marginRight: "8px" }}>{currentOrder + ". "}</Typography>
                                                )}
                                                <Typography variant="body1">{technique?.title}</Typography>
                                            </Box>
                                            {props.editable && !(props.editingTechniqueId === technique.techniqueId) && !(props.editingTechniqueId) && (
                                                <CircleIcon
                                                    fill={handleIndicatorFill(technique)}
                                                    onClick={(event) => event.stopPropagation()}
                                                    onMenuItemClick={handleAction(technique)}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SubCard elevation={0}>
                                    <ListItem>
                                        <Box display="flex" flexDirection="row" flexGrow={1} alignItems="center" justifyContent="center">
                                            <Button variant="contained" sx={{ minWidth: "85px", marginRight: "10px" }}><EditNoteSharp sx={{ marginX: "2px" }} /><PersonSharp sx={{ marginX: "2px" }} /></Button>
                                            <Button variant="contained" sx={{ minWidth: "85px", marginLeft: "10px" }}><EditNoteSharp sx={{ marginX: "2px" }} /><PublicSharp sx={{ marginX: "2px" }} /></Button>
                                        </Box>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText sx={{ margin: "0px" }}
                                            smalltext={props.ordered ? true : false}
                                            primary="Description"
                                            secondary={technique?.description}
                                        />
                                    </ListItem>

                                    {technique?.globalNotes && (
                                        <ListItem>
                                            <ListItemText
                                                smalltext={props.ordered ? true : false}
                                                primary="Global Notes"
                                                secondary={technique?.globalNotes} />
                                        </ListItem>
                                    )}

                                    {technique?.videos && technique.videos.map(video => (
                                        <ListItem>
                                            <ListItemText
                                                smalltext={props.ordered ? true : false}
                                                primary={video.title}
                                                secondary={video.hyperlink} />
                                        </ListItem>
                                    ))}


                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    primary="Position"
                                                    secondary={technique?.position?.title}
                                                />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem >
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    secondary={technique?.position.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>

                                    <ListItem>
                                        <ListItemText
                                            smalltext={props.ordered ? true : false}
                                            primary="Hierarchy"
                                            secondary={technique?.hierarchy}
                                        />
                                    </ListItem>

                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    primary="Type"
                                                    secondary={technique?.type.title}
                                                />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    secondary={technique?.type.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>

                                    {technique?.openGuard && (
                                        <SubAccordion elevation={0} disableGutters square>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem>
                                                    <ListItemText
                                                        smalltext={props.ordered ? true : false}
                                                        primary="Open Guard"
                                                        secondary={technique?.openGuard?.title}
                                                    />
                                                </ListItem>
                                            </AccordionSummary>

                                            <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem>
                                                    <ListItemText
                                                        smalltext={props.ordered ? true : false}
                                                        secondary={technique?.openGuard?.description} />
                                                </ListItem>
                                            </AccordionDetails>
                                        </SubAccordion>
                                    )}

                                    <ListItem>
                                        <ListItemText
                                            smalltext={props.ordered ? true : false}
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

export default StudentTechniqueList
