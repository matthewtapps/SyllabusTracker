import React from 'react'
import { CollectionListWithFilters } from '../../../components/Lists/CollectionListWithFilters'


function StudentCollections(): JSX.Element {
    const [expandedCollectionId, setExpandedCollectionId] = React.useState("");
    const handleAccordionChange = (collectionId: string) => {
        setExpandedCollectionId(prevExpandedCollectionId => 
            prevExpandedCollectionId === collectionId ? "" : collectionId
        );
    }

    return (
        <div>
            <CollectionListWithFilters
            onAccordionChange={handleAccordionChange}
            expandedCollectionId={expandedCollectionId}
            />
        </div>
    );
};

export default StudentCollections
