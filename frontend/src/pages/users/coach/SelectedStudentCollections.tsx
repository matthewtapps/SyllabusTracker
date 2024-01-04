import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { StudentCollectionListWithFilters } from '../../../components/Lists/StudentCollectionListWithFilters'
import { RootState } from '../../../store/store'


function SelectedStudentCollections(): JSX.Element {
    const navigate = useNavigate();
    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
        }
    }, [selectedStudent, navigate]);

    const [expandedCollectionId, setExpandedCollectionId] = React.useState("");

    const handleAccordionChange = (collectionId: string) => {
        setExpandedCollectionId(prevExpandedCollectionId =>
            prevExpandedCollectionId === collectionId ? "" : collectionId
        );
    }

    return (
        <StudentCollectionListWithFilters
            editable
            expandedCollectionId={expandedCollectionId}
            onAccordionChange={handleAccordionChange}
        />
    );
};

export default SelectedStudentCollections;
