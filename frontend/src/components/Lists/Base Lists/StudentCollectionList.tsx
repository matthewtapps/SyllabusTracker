import ExpandMore from '@mui/icons-material/ExpandMore';
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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { CircleIcon } from '../../Buttons/CircleIcon';
import StudentTechniqueList from './StudentTechniqueList';
import { fetchSelectedStudentTechniquesAsync } from '../../../slices/student';


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
    expandedCollectionId: string;
    onAccordionChange: (collectionId: string) => void;
}

StudentCollectionList.defaultProps = {
    elevation: 3,
    editable: false,
}

function StudentCollectionList(props: StudentCollectionsListProps): JSX.Element {
    const iconColor = (statuses: (TechniqueStatus | null)[]): string => {
        const allPassed = statuses.every(status => status === TechniqueStatus.Passed);
        const anyStartedOrPassed = statuses.some(status => status === TechniqueStatus.Started || status === TechniqueStatus.Passed);
    
        if (allPassed && statuses.length > 0) {
            return "#689d6a";
        } else if (anyStartedOrPassed && statuses.length > 0) {
            return "#d79921";
        } else {
            return "#665c54";
        }
    };

    const { selectedStudentTechniques } = useSelector((state: RootState) => state.student)

    const handleIndicatorFill = (techniques: Technique[]): string => {
        const techniqueStatuses = techniques.map(technique => {
            const matchingTechnique = selectedStudentTechniques.find(st => st.technique.techniqueId === technique.techniqueId);
            return matchingTechnique ? matchingTechnique.status : null;
        }).filter(status => status !== null);
    
        return iconColor(techniqueStatuses);
    };
    
    return (
        <div>
            {props.filteredCollections.map(collection => {
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
                    <Accordion disableGutters elevation={props.elevation} key={collection.collectionId} expanded={props.expandedCollectionId === collection.collectionId}
                        onChange={() => props.onAccordionChange(collection.collectionId)}>
                        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
                            <Box display="flex" flexDirection="row" flexGrow={1} alignItems="center" justifyContent="space-between" maxWidth="97%">
                                <Typography variant="h6">{collection.title}</Typography>
                                {props.editable && (
                                    <CircleIcon 
                                        fill={handleIndicatorFill(collectionTechniques)}
                                    />
                                )}
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SubCard elevation={0}>
                                <SubAccordion elevation={0} disableGutters square defaultExpanded>
                                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                        <ListItem>
                                            <ListItemText primary="Collection Techniques" />
                                        </ListItem>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: "0px" }}>
                                        <StudentTechniqueList
                                            filteredTechniques={collectionTechniques}
                                            elevation={0}
                                            ordered
                                            editable
                                        />
                                    </AccordionDetails>
                                </SubAccordion>

                                <ListItem>
                                    <ListItemText primary="Description" secondary={collection?.description} />
                                </ListItem>

                                {collection.globalNotes && (
                                    <ListItem>
                                        <ListItemText primary="Global Notes" secondary={collection.globalNotes} />
                                    </ListItem>
                                )}

                                {collection.position && (
                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText primary="Position" secondary={collection.position?.title} />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem >
                                                <ListItemText secondary={collection.position?.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>
                                )}

                                {collection.hierarchy && (
                                    <ListItem>
                                        <ListItemText primary=" Hierarchy" secondary={collection.hierarchy} />
                                    </ListItem>
                                )}

                                {collection.type && (
                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText primary="Type" secondary={collection.type?.title} />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText secondary={collection.type?.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>
                                )}

                                {collection.openGuard && (
                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText primary="Open Guard" secondary={collection.openGuard?.title} />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem>
                                                <ListItemText secondary={collection.openGuard?.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>
                                )}

                                {(collection.gi) && (
                                    <ListItem>
                                        <ListItemText primary="Gi or No Gi" secondary={collection.gi} />
                                    </ListItem>
                                )}

                            </SubCard>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </div>
    )
}

export default StudentCollectionList
