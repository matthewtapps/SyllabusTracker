import { User, useAuth0 } from '@auth0/auth0-react';
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
import { useEditStudentTechniqueMutation, useGetSelectedStudentTechniquesQuery, useGetTechniquesQuery, usePostStudentTechniquesMutation } from '../../../services/syllabusTrackerApi';
import { postStudentTechniquesAsync, updateStudentTechniqueAsync } from '../../../slices/student';
import { decodeAndAddRole } from '../../../util/Utilities';
import { CircleIcon, Option } from '../../Buttons/CircleIcon';
import Pageloader from '../../Base/PageLoader';


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

interface StudentTechniqueListProps {
    filteredTechniques?: Technique[];
    ordered?: boolean;
    elevation: number;
    editable?: boolean;
    selectedStudent: User;
}

StudentTechniqueList.defaultProps = {
    elevation: 3,
    ordered: false,
    editable: false,
}

function StudentTechniqueList(props: StudentTechniqueListProps): JSX.Element {
    const selectedStudent = props.selectedStudent
    const iconColor = (techniqueStatus: TechniqueStatus | undefined): string => {
        if (techniqueStatus === TechniqueStatus.Started) {
            return "#d79921";
        } else if (techniqueStatus === TechniqueStatus.Passed) {
            return "#689d6a";
        } else {
            return "#665c54";
        }
    }

    const { data: techniques, isLoading, isSuccess, isError, error } = useGetTechniquesQuery()
    const { data: selectedStudentTechniques, isLoading: stLoading, isSuccess: stSuccess, isError: stIsError, error: stError } = useGetSelectedStudentTechniquesQuery(selectedStudent.user_id)
    const [postStudentTechniques, { isLoading: isPostingStudentTechnique }] = usePostStudentTechniquesMutation()
    const [updateStudentTechniques] = useEditStudentTechniqueMutation()

    const techniquesToDisplay = props.filteredTechniques || techniques!

    const handleIndicatorFill = (technique: Technique) => {
        if (stSuccess) {
            const matchingTechnique = selectedStudentTechniques.find(st =>
                st.technique.techniqueId === technique.techniqueId
            )
            return iconColor(matchingTechnique?.status)
        } else return "#665c54"
    }

    const menuActions = {
        [Option.Assign]: async (technique: Technique) => {
            stSuccess &&
            selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId)
                ? postStudentTechniques({ studentId: selectedStudent.user_id, techniques: [technique], status: TechniqueStatus.NotYetStarted })
                : updateStudentTechniques({ studentId: selectedStudent.user_id, techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.NotYetStarted } });
        },
        [Option.Started]: async (technique: Technique) => {
            stSuccess &&
            selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId)
                ? postStudentTechniques({ studentId: selectedStudent.user_id, techniques: [technique], status: TechniqueStatus.Started })
                : updateStudentTechniques({ studentId: selectedStudent.user_id, techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Started } });
        },
        [Option.Passed]: async (technique: Technique) => {
            stSuccess &&
            selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId)
                ? postStudentTechniques({ studentId: selectedStudent.user_id, techniques: [technique], status: TechniqueStatus.Passed })
                : updateStudentTechniques({ studentId: selectedStudent.user_id, techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Passed } });
        },
        [Option.Unassign]: async (technique: Technique) => {
            stSuccess &&
            selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId)
                && updateStudentTechniques({ studentId: selectedStudent.user_id, techniqueId: technique.techniqueId, updatedData: { status: TechniqueStatus.Unassigned } })
        }
    };

    const handleAction = (technique: Technique) => async (option: Option) => {
        if (stSuccess) {
            const action = menuActions[option];
            await action(technique);
        }
    };

    let { user } = useAuth0();
    if (user) { user = decodeAndAddRole(user) }
    if (!user) { throw new Error(`Missing user when trying to load student technique list`) }
    return (
        <>
            {
                (isLoading || stLoading) ? <Pageloader />
                    : (isSuccess && stSuccess && selectedStudentTechniques) ?
                        techniquesToDisplay.map((technique, index) => {
                            const matchedStudentTechnique = selectedStudentTechniques.find(st => { return technique.techniqueId === st.technique.techniqueId })
                            let currentOrder = props.ordered ? index + 1 : null
                            return (
                                <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}>
                                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" >
                                        <Box display="flex" flexDirection="row" width="100%">
                                            {isPostingStudentTechnique && <LinearProgress style={{ width: "100%" }} />}
                                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                                <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                                    <Box display="flex" alignItems="center" marginLeft="0px">
                                                        {props.ordered && !isPostingStudentTechnique && (
                                                            <Typography variant="body1" style={{ marginRight: "8px" }}>{currentOrder + ". "}</Typography>
                                                        )}
                                                        <Typography variant="body1">{!isPostingStudentTechnique && technique?.title}</Typography>
                                                    </Box>
                                                    {!isPostingStudentTechnique && (
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
                        : isError &&
                        <CardContent>
                            <Typography>{`Failed to fetch techniques: ${error}`}</Typography>
                        </CardContent>
            }
        </>
    )
}

export default StudentTechniqueList
