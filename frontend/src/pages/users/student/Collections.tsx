import React from 'react';
import { StudentCollectionListWithFilters } from '../../../components/Lists/StudentCollectionListWithFilters';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Pageloader from '../../../components/Base/PageLoader';


function StudentCollections(): JSX.Element {
    const { loading } = useSelector((state: RootState) => state.collections)
    const { collectionSuggestionsLoading } = useSelector((state: RootState) => state.suggestions)
    const { techniqueSuggestionsLoading } = useSelector((state: RootState) => state.suggestions)
    const { techniquesLoading } = useSelector((state: RootState) => state.techniques)
    const { loading: descriptionsLoading } = useSelector((state: RootState) => state.descriptions)
    const { loading: selectedStudentTechniquesLoading } = useSelector((state: RootState) => state.student)
    const { loading: collectionTechniquesLoading } = useSelector((state: RootState) => state.collectionTechniques)

    return (
        <div>
            {(loading || 
            collectionSuggestionsLoading || 
            techniqueSuggestionsLoading || 
            techniquesLoading || 
            descriptionsLoading || 
            selectedStudentTechniquesLoading || 
            collectionTechniquesLoading) 
            ? <Pageloader />
            : <StudentCollectionListWithFilters />
            }
        </div>
    );
};

export default StudentCollections
