import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Collection } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CollectionList from '../../../components/CollectionList'
import CollectionFilter, { useDetermineFilterOptions, useHandleFilterChange } from '../../../components/CollectionFilter'
import { transformTechniqueForBackend, postTechnique } from '../../../util/Utilities'
import { Technique } from 'common'
import { postCollectionTechniques } from '../../../util/Utilities'


interface TechniqueDTO {
    title: string,
    videoSrc: string | undefined,
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

const emptyTechniqueDTO: TechniqueDTO = {
    title: '',
    videoSrc: undefined,
    description: '',
    globalNotes: undefined,
    gi: '',
    hierarchy: '',
    type: '',
    typeDescription: undefined,
    position: '',
    positionDescription: undefined,
    openGuard: undefined,
    openGuardDescription: undefined,
}

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

function CoachCollections(): JSX.Element {
    const navigate = useNavigate();
    const navigateToNewCollection = () => { navigate('/newCollection') }

    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No collection data available')

    // List of collections state
    const [collectionsList, setCollectionsList] = React.useState<Collection[]>([])

    // Technique editing states for in-place technique editing
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string | null>(null);
    const [editedTechnique, setEditedTechnique] = React.useState<TechniqueDTO>(emptyTechniqueDTO);

    // State containing index, technique pairs for drag and drop
    const [dragDropTechniques, setDragDropTechniques] = React.useState<{ index: number, technique: Technique }[]>([]);

    // Collection editing states
    const [editingCollectionId, setEditingCollectionId] = React.useState<string | null>(null);
    const [editingCollection, setEditingCollection] = React.useState<Collection | null>(null);
    const [editingTechniquesCollection, setEditingTechniquesCollection] = React.useState<Collection | null>(null);

    const handleTechniqueEditClick = (technique: Technique) => {
        setEditingTechniqueId(technique.techniqueId);
        setEditedTechnique({
            title: technique.title,
            videoSrc: technique.videoSrc || undefined,
            description: technique.description,
            globalNotes: technique.globalNotes || undefined,
            gi: technique.gi,
            hierarchy: technique.hierarchy,
            type: technique.type.title,
            typeDescription: technique.type.description|| undefined,
            position: technique.position.title,
            positionDescription: technique.position.description,
            openGuard: technique.openGuard?.title || undefined,
            openGuardDescription: technique.openGuard?.description || undefined,
        });
    }

    const handleTechniqueSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validTechnique = transformTechniqueForBackend(fieldValues);
        if (!validTechnique) {
            alert('Not a valid technique posted')
            return
        };

        const status = await postTechnique(editingTechniqueId, validTechnique);

        if (status === 200) {
            const collections = await fetchCollections()
            if (collections) {setCollectionsList(collections)}
            setEditingTechniqueId(null);
            setEditedTechnique(emptyTechniqueDTO);
        }
    }
    
    const handleTechniqueCancelClick = () => {
        setEditingTechniqueId(null);
        setEditedTechnique(emptyTechniqueDTO);
    }

    const handleTechniqueDeleteClick = (techniqueId: string) => {
        // TODO: Call the backend API to delete the technique
        // Handle the UI update after deletion (e.g., remove the technique from the list)
    }

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const [collectionResponse] = await Promise.all([
                fetch('http://192.168.0.156:3000/api/collection')
            ]);

            const collections: Collection[] = await (collectionResponse.json())
            collections.sort((a, b) => a.title.localeCompare(b.title));

            return collections
        } catch (error) {
            setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
            return null
        } finally {
            setLoading(false);
        }
    }

    const handleCollectionTechniqueEditClick = (collection: Collection) => {
        let orderedTechniques: {index: number, technique: Technique}[] = [];
        collection.collectionTechniques.sort((a, b) => a.order - b.order);
        collection.collectionTechniques.forEach(orderedTechnique => {
            orderedTechniques.push({index: orderedTechnique.order, technique: orderedTechnique.technique})
        });
        setEditingTechniquesCollection(collection)
        setDragDropTechniques(orderedTechniques)
    }

    const handleOnReorderDragDropTechniques = (newDragDropOrder: {index: number, technique: Technique}[]) => {
        let newIndex = 1
        let newOrder: {index: number, technique: Technique}[] = []
        newDragDropOrder.forEach(item => {
            newOrder.push({index: newIndex, technique: item.technique})
            newIndex++
        })
        setDragDropTechniques(newOrder)
    }

    const handleDragDropSaveClick = () => {
        setTimeout(async () => {
            editingTechniquesCollection && await postCollectionTechniques(editingTechniquesCollection, dragDropTechniques);
            setEditingTechniquesCollection(null);
            setDragDropTechniques([]);
    
            const collections = await fetchCollections();
            if (collections) {
                setCollectionsList(collections);
            }
        }, 2000);
    };

    const handleDragDropCancelClick = () => {
        setEditingTechniquesCollection(null)
        setDragDropTechniques([])
    }

    React.useEffect(() => {
        fetchCollections().then(collections => {
            if (collections) setCollectionsList(collections); // Only update state if fetchTechniques returns a value
        });
    }, []);

    // Generate options for the filters based on the full techniques list
    const options = useDetermineFilterOptions(collectionsList)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredCollections, handleFilterChange } = useHandleFilterChange(collectionsList)

    return (
        <div>
            <Card>
                <CollectionFilter 
                onFiltersChange={handleFilterChange} 
                options={options}/>
            </Card>
            <Card>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : filteredCollections.length === 0 ? (
                <CardContent>
                    <Typography>{placeholderContent}</Typography>
                </CardContent>
            ) : (
                <Box>
                    <CollectionList 
                    editableCollection
                    filteredCollections={filteredCollections}
                    editableTechniques
                    editingTechniqueId={editingTechniqueId}
                    editingTechnique={editedTechnique}
                    onTechniqueEditClick={handleTechniqueEditClick}
                    onTechniqueSubmitClick={handleTechniqueSaveClick}
                    onTechniqueCancelClick={handleTechniqueCancelClick}
                    onTechniqueDeleteClick={handleTechniqueDeleteClick}

                    editingTechniquesCollection={editingTechniquesCollection}
                    editingCollectionId={editingCollectionId}
                    editingCollection={editingCollection}
                    onCollectionTechniqueEditClick={handleCollectionTechniqueEditClick}
                    onReorderDragDropTechniques={handleOnReorderDragDropTechniques}
                    dragDropTechniques={dragDropTechniques}
                    onDragDropSaveClick={handleDragDropSaveClick}
                    onDragDropCancelClick={handleDragDropCancelClick}/>
                </Box>
            )}
            </Card>
            <Fab // Should only exist on coach version of techniques
            color="primary" 
            aria-label="add" 
            style={{position: 'fixed', bottom: '16px', right: '16px'}}
            onClick={navigateToNewCollection}
            >
                <AddIcon/>
            </Fab>
        </div>
    );
};

export default CoachCollections
