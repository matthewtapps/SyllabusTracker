import { Box, CardContent, CircularProgress, Typography, styled } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { Collection, TechniqueStatus } from 'common';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
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
}

StudentCollectionListWithFilters.defaultProps = {
    editable: false,
}

export function StudentCollectionListWithFilters(props: StudentCollectionListWithFiltersProps): JSX.Element {
    const [placeholderContent, setPlaceholderContent] = useState('');
    const { collections, loading } = useSelector((state: RootState) => state.collections);
    const { selectedStudentTechniques } = useSelector((state: RootState) => state.student);

    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange(collections);

    const [showAssignedCollections, setShowAssignedCollections] = React.useState(false)

    const handleAssignedFiltersCheck = () => {
        setShowAssignedCollections(prevState => !prevState);
    }

    const [assignedFilteredCollections, setAssignedFilteredCollections] = React.useState<Collection[]>([]);

    React.useEffect(() => {
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
    }, [filteredCollections, selectedStudentTechniques]);

    React.useEffect(() => {
        showAssignedCollections ? setPlaceholderContent('No assigned collections with current filters')
            : setPlaceholderContent('No collections with current filters')
    }, [showAssignedCollections])

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
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : filteredCollections.length === 0 ? (
                    <CardContent>
                        <Typography>{placeholderContent || (<CircularProgress />)}</Typography>
                    </CardContent>
                ) : (
                    <Box>
                        <StudentCollectionList
                            filteredCollections={showAssignedCollections ? assignedFilteredCollections : filteredCollections}
                            editable={props.editable}
                        />
                    </Box>
                )}
            </Card>
        </>
    )
};
