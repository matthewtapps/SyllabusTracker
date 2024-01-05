import { useAuth0 } from '@auth0/auth0-react';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CardContent } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { default as Card, default as MuiCard } from '@mui/material/Card';
import MuiLinearProgress from '@mui/material/LinearProgress';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Role, Technique, TechniqueStatus } from 'common';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postStudentTechniquesAsync, updateStudentTechniqueAsync } from '../../../slices/student';
import { AppDispatch, RootState } from '../../../store/store';
import { decodeAndAddRole } from '../../../util/Utilities';
import { CircleIcon, Option } from '../../Buttons/CircleIcon';


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

const LinearProgress = styled(MuiLinearProgress)({
    '.MuiLinearProgress-bar': {
        transition: 'none'
      }
})

interface ExtendedListItemTextProps extends ListItemTextProps {
    smalltext: boolean
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
    const { selectedStudentTechniques, postingOrUpdatingStudentTechniqueIds } = useSelector((state: RootState) => state.student)

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
                await dispatch(postStudentTechniquesAsync({ techniques: [technique], status: TechniqueStatus.NotYetStarted })).unwrap();
            } else dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.NotYetStarted } }));
        },
        [Option.Started]: async (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (!matchedTechnique) {
                await dispatch(postStudentTechniquesAsync({ techniques: [technique], status: TechniqueStatus.Started })).unwrap();
            } else dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Started } }));
        },
        [Option.Passed]: async (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (!matchedTechnique) {
                await dispatch(postStudentTechniquesAsync({ techniques: [technique], status: TechniqueStatus.Passed })).unwrap();
            } else dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Passed } }));
        },
        [Option.Unassign]: async (technique: Technique) => {
            const matchedTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            if (matchedTechnique) dispatch(updateStudentTechniqueAsync({ techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Unassigned } }));
        }
    };

    const handleAction = (technique: Technique) => async (option: Option) => {
        const action = menuActions[option];
        if (action) {
            await action(technique);
        }
    };
    let { user } = useAuth0();
    if (user) { user = decodeAndAddRole(user) }
    if (!user) { throw new Error(`Missing user when trying to load student technique list`) }
    return (
        <div>
            {techniquesToDisplay.length > 0 ? (
                techniquesToDisplay.map((technique, index) => {
                    const matchedStudentTechnique = selectedStudentTechniques.find(st => { return technique.techniqueId === st.technique.techniqueId })
                    let currentOrder = props.ordered ? index + 1 : null;
                    const techniqueLoadingStatus = postingOrUpdatingStudentTechniqueIds.includes(technique.techniqueId)
                    return (
                        <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}>
                            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" >
                                <Box display="flex" flexDirection="row" width="100%">
                                    {techniqueLoadingStatus && <LinearProgress style={{width: "100%"}}/>}
                                    <Box display="flex" flexDirection="column" flexGrow={1}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                            <Box display="flex" alignItems="center" marginLeft="0px">
                                                {props.ordered && !techniqueLoadingStatus && (
                                                    <Typography variant="body1" style={{ marginRight: "8px" }}>{currentOrder + ". "}</Typography>
                                                )}
                                                <Typography variant="body1">{!techniqueLoadingStatus && technique?.title}</Typography>
                                            </Box>
                                            {!techniqueLoadingStatus && (
                                                <CircleIcon
                                                    fill={handleIndicatorFill(technique)}
                                                    onClick={props.editable ? (event) => event.stopPropagation() : undefined}
                                                    onMenuItemClick={props.editable ? handleAction(technique) : undefined}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SubCard elevation={0}>
                                    {((user?.role === Role.Student && matchedStudentTechnique?.coachNotes) || user?.role === Role.Coach) && (
                                        <ListItem key={`${technique.techniqueId}-coach-notes`}>
                                            <ListItemText sx={{ margin: "0px" }}
                                                smalltext={props.ordered ? true : false}
                                                primary="Coach Notes"
                                                secondary={matchedStudentTechnique?.coachNotes || "--"}
                                            />
                                        </ListItem>
                                    )}

                                    {((user?.role === Role.Coach && matchedStudentTechnique?.studentNotes) || user?.role === Role.Student) && (
                                        <ListItem key={`${technique.techniqueId}-student-notes`}>
                                            <ListItemText sx={{ margin: "0px" }}
                                                smalltext={props.ordered ? true : false}
                                                primary={user?.role === Role.Student ? "My Notes" : "Student Notes"}
                                                secondary={matchedStudentTechnique?.studentNotes || "--"}
                                            />
                                        </ListItem>
                                    )}

                                    {technique?.globalNotes && (
                                        <ListItem key={`${technique.techniqueId}-global-notes`}>
                                            <ListItemText
                                                smalltext={props.ordered ? true : false}
                                                primary="Global Notes"
                                                secondary={technique?.globalNotes} />
                                        </ListItem>
                                    )}

                                    {technique?.videos && technique.videos.map((video, index) => (
                                        <ListItem key={`${technique.techniqueId}-video-${index}`}>
                                            <ListItemText
                                                smalltext={props.ordered ? true : false}
                                                primary={video.title}
                                                secondary={video.hyperlink} />
                                        </ListItem>
                                    ))}

                                    <ListItem key={`${technique.techniqueId}-description`}>
                                        <ListItemText sx={{ margin: "0px" }}
                                            smalltext={props.ordered ? true : false}
                                            primary="Description"
                                            secondary={technique?.description}
                                        />
                                    </ListItem>


                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-position`}>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    primary="Position"
                                                    secondary={technique?.position?.title}
                                                />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-position-description`}>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    secondary={technique?.position.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>

                                    <ListItem key={`${technique.techniqueId}-hierarchy`}>
                                        <ListItemText
                                            smalltext={props.ordered ? true : false}
                                            primary="Hierarchy"
                                            secondary={technique?.hierarchy}
                                        />
                                    </ListItem>

                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-type`}>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    primary="Type"
                                                    secondary={technique?.type.title}
                                                />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${technique.techniqueId}-type-description`}>
                                                <ListItemText
                                                    smalltext={props.ordered ? true : false}
                                                    secondary={technique?.type.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>

                                    {technique?.openGuard && (
                                        <SubAccordion elevation={0} disableGutters square>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem key={`${technique.techniqueId}-open-guard`}>
                                                    <ListItemText
                                                        smalltext={props.ordered ? true : false}
                                                        primary="Open Guard"
                                                        secondary={technique?.openGuard?.title}
                                                    />
                                                </ListItem>
                                            </AccordionSummary>

                                            <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem key={`${technique.techniqueId}-open-guard-description`}>
                                                    <ListItemText
                                                        smalltext={props.ordered ? true : false}
                                                        secondary={technique?.openGuard?.description} />
                                                </ListItem>
                                            </AccordionDetails>
                                        </SubAccordion>
                                    )}

                                    <ListItem key={`${technique.techniqueId}-gi`}>
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
