import { User } from '@auth0/auth0-react';
import { Box, CardContent, Typography, styled } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { Collection, TechniqueStatus } from 'common';
import React from 'react';
import { useGetSelectedStudentTechniquesQuery } from '../../services/syllabusTrackerApi';
import Pageloader from '../Base/PageLoader';
import StudentCollectionList from './Base Lists/StudentCollectionList';
import CollectionFilter, { useHandleCollectionFilterChange } from './List Filters/CollectionFilter';

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: '10px',
        marginTop: '10px',
        marginRight: '10px',
        borderRadius: '2',
        boxShadow: '3'
    }
});

interface StudentCollectionListWithFiltersProps {
    editable: boolean;
    selectedStudent: User;
}

StudentCollectionListWithFilters.defaultProps = {
    editable: false,
}

export function StudentCollectionListWithFilters(props: StudentCollectionListWithFiltersProps): JSX.Element {
    const selectedStudent = props.selectedStudent
    const { data: selectedStudentTechniques, isLoading, isSuccess, isError, error } = useGetSelectedStudentTechniquesQuery(selectedStudent.user_id)

    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange();

    const [showAssignedCollections, setShowAssignedCollections] = React.useState(false)

    const handleAssignedFiltersCheck = () => {
        setShowAssignedCollections(prevState => !prevState);
    }

    const [assignedFilteredCollections, setAssignedFilteredCollections] = React.useState<Collection[]>([]);

    React.useEffect(() => {
        if (isSuccess) {
            const filterCollectionsByAssignedTechniques = () => {
                const assignedCollections = filteredCollections.filter(collection =>
                    collection.collectionTechniques && collection.collectionTechniques.length > 0 &&
                    collection.collectionTechniques.some(collectionTechnique =>
                        selectedStudentTechniques.some(studentTechnique =>
                            studentTechnique.technique.techniqueId === collectionTechnique.technique.techniqueId &&
                            (studentTechnique.status === TechniqueStatus.NotYetStarted ||
                                studentTechnique.status === TechniqueStatus.Started ||
                                studentTechnique.status === TechniqueStatus.Passed)
                        )
                    )
                );
                setAssignedFilteredCollections(assignedCollections)
            };

            filterCollectionsByAssignedTechniques();
        }
    }, [filteredCollections, selectedStudentTechniques, isSuccess]);

    return (
        <>
            <Card>
                <CollectionFilter
                    onCollectionFiltersChange={handleCollectionFilterChange}
                    showAssignedCollections={showAssignedCollections}
                    onAssignedFilterCheck={handleAssignedFiltersCheck}
                />
            </Card>
            <Card>
                {isLoading ? <Pageloader />
                    : isSuccess ?
                        <Box>
                            <StudentCollectionList
                                filteredCollections={showAssignedCollections ? assignedFilteredCollections : filteredCollections}
                                editable={props.editable}
                                selectedStudent={selectedStudent}
                            />
                        </Box>
                        : isError ?
                            <CardContent>
                                <Typography>{`Failed to fetch selected student collections: ${error}`}</Typography>
                            </CardContent>
                            :
                            <CardContent>
                                <Typography>No collections available for selected filters.</Typography>
                            </CardContent>
                }
            </Card>
        </>
    )
};
