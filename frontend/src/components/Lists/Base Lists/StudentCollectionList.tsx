import { User } from '@auth0/auth0-react';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CardContent } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Collection, CollectionTechnique, Technique, TechniqueStatus } from 'common';
import React from 'react';
import { useGetSelectedStudentTechniquesQuery } from '../../../services/syllabusTrackerApi';
import Pageloader from '../../Base/PageLoader';
import { ProgressBarIcon } from '../../Buttons/ProgressBarIcon';
import StudentTechniqueList from './StudentTechniqueList';


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
    paddingBottom: "0px",
    paddingLeft: "0px"
})

const BaseListItemText: React.FC<ListItemTextProps> = (props) => {
    return (
        <MuiListItemText
            {...props}
            secondaryTypographyProps={{ component: 'div' }}
            primaryTypographyProps={{ component: 'div' }}
        />
    );
}

const ListItemText = styled(BaseListItemText)<ListItemTextProps>(({ theme }) => {
    let primaryVariant = 'h6';
    let secondaryVariant = 'body1';

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
    backgroundColor: 'inherit'
})

interface StudentCollectionsListProps {
    filteredCollections: Collection[];
    elevation: number;
    editable: boolean;
    selectedStudent: User;
}

StudentCollectionList.defaultProps = {
    elevation: 3,
    editable: false,
}

function StudentCollectionList(props: StudentCollectionsListProps): JSX.Element {
    const selectedStudent = props.selectedStudent

    const { data: selectedStudentTechniques, isLoading, isSuccess, error } = useGetSelectedStudentTechniquesQuery(selectedStudent.user_id)

    const fetchStatuses = (techniques: Technique[]): TechniqueStatus[] => {
        if (isSuccess) {
            const techniqueStatuses = techniques.map(technique => {
                const matchingTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
                return matchingTechnique ? matchingTechnique.status : TechniqueStatus.NotYetStarted;
            }).filter(status => status !== null);

            return techniqueStatuses
        } else return []
    }

    return (
        <>
            {isLoading ? <CardContent><Pageloader /></CardContent>
                : isSuccess ?
                    props.filteredCollections.map(collection => {
                        let unsortedTechniques: CollectionTechnique[] = []
                        if (collection.collectionTechniques) {
                            unsortedTechniques = [...collection.collectionTechniques];
                        }
                        let collectionTechniques: Technique[] = []
                        unsortedTechniques.sort((a, b) => a.order - b.order)
                        unsortedTechniques.forEach(collectionTechnique => {
                            collectionTechniques.push(collectionTechnique.technique)
                        });
                        return (
                            <Accordion disableGutters elevation={props.elevation} key={collection.collectionId}>
                                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
                                    <Box display="flex" flexDirection="row" flexGrow={1} alignItems="center" justifyContent="space-between" maxWidth="97%">
                                        <Typography variant="h6">{collection.title}</Typography>
                                        <ProgressBarIcon statuses={fetchStatuses(collectionTechniques)}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <SubCard elevation={0}>
                                        <SubAccordion elevation={0} disableGutters square defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                <ListItem key={`${collection.collectionId}-collection-techniques`}>
                                                    <ListItemText primary="Collection Techniques" />
                                                </ListItem>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ padding: "0px" }}>
                                                <StudentTechniqueList
                                                    filteredTechniques={collectionTechniques}
                                                    elevation={0}
                                                    ordered
                                                    editable={props.editable}
                                                    selectedStudent={selectedStudent}
                                                />
                                            </AccordionDetails>
                                        </SubAccordion>

                                        <ListItem key={`${collection.collectionId}-description`}>
                                            <ListItemText primary="Description" secondary={collection?.description} />
                                        </ListItem>

                                        {collection.globalNotes && (
                                            <ListItem key={`${collection.collectionId}-global-notes`}>
                                                <ListItemText primary="Global Notes" secondary={collection.globalNotes} />
                                            </ListItem>
                                        )}

                                        {collection.position && (
                                            <SubAccordion elevation={0} disableGutters square>
                                                <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                    <ListItem key={`${collection.collectionId}-position`}>
                                                        <ListItemText primary="Position" secondary={collection.position?.title} />
                                                    </ListItem>
                                                </AccordionSummary>

                                                <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                                    <ListItem key={`${collection.collectionId}-position-description`}>
                                                        <ListItemText secondary={collection.position?.description} />
                                                    </ListItem>
                                                </AccordionDetails>
                                            </SubAccordion>
                                        )}

                                        {collection.hierarchy && (
                                            <ListItem key={`${collection.collectionId}-hierarchy`}>
                                                <ListItemText primary=" Hierarchy" secondary={collection.hierarchy} />
                                            </ListItem>
                                        )}

                                        {collection.type && (
                                            <SubAccordion elevation={0} disableGutters square>
                                                <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                    <ListItem key={`${collection.collectionId}-type`}>
                                                        <ListItemText primary="Type" secondary={collection.type?.title} />
                                                    </ListItem>
                                                </AccordionSummary>

                                                <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                                    <ListItem key={`${collection.collectionId}-type-description`}>
                                                        <ListItemText secondary={collection.type?.description} />
                                                    </ListItem>
                                                </AccordionDetails>
                                            </SubAccordion>
                                        )}

                                        {collection.openGuard && (
                                            <SubAccordion elevation={0} disableGutters square>
                                                <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                                    <ListItem key={`${collection.collectionId}-open-guard`}>
                                                        <ListItemText primary="Open Guard" secondary={collection.openGuard?.title} />
                                                    </ListItem>
                                                </AccordionSummary>

                                                <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                                    <ListItem key={`${collection.collectionId}-open-guard-description`}>
                                                        <ListItemText secondary={collection.openGuard?.description} />
                                                    </ListItem>
                                                </AccordionDetails>
                                            </SubAccordion>
                                        )}

                                        {(collection.gi) && (
                                            <ListItem key={`${collection.collectionId}-gi`}>
                                                <ListItemText primary="Gi or No Gi" secondary={collection.gi} />
                                            </ListItem>
                                        )}

                                    </SubCard>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })
                    : <CardContent>
                        <Typography>{`Failed to fetch student techniques: ${error}`}</Typography>
                    </CardContent>
            }
        </>
    )
}

export default StudentCollectionList
