import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { Collection, CollectionTechnique } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CollectionList from '../../../components/CollectionList'
import CollectionFilter, { useHandleCollectionFilterChange } from '../../../components/CollectionFilter'
import { transformTechniqueForBackend, postTechnique, deleteCollection, fetchCollectionTechniques, fetchCollections, fetchTechniques } from '../../../util/Utilities'
import { Technique } from 'common'
import Dialog from '@mui/material/Dialog'
import TechniqueFilter, { useDetermineTechniqueFilterOptions, useHandleTechniqueFilterChange} from '../../../components/TechniqueFilter'
import TechniqueList from '../../../components/TechniqueList'
import MuiButton, { ButtonProps } from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { postCollectionTechniques, transformCollectionForBackend, postCollection } from '../../../util/Utilities'
import { EditTechniqueDialog } from '../../../components/EditTechniqueDialog'
import { EditCollectionDialog } from '../../../components/EditCollectionDialog'
import { NewCollectionDialog } from '../../../components/NewCollectionDialog'
import { useAuth0 } from '@auth0/auth0-react'


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

const Button = styled((props: ButtonProps) => (
    <MuiButton sx={{width: "100%", marginX: "10px"}} variant='contained' {...props} />
))(({ theme }) => ({}));

function CoachCollections(): JSX.Element {
    const { getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);

                // Now that we have the token, we can fetch data
                const collections = await fetchCollections(token);
                if (collections) {
                    setCollectionsList(collections);
                    setLoading(false);

                    const techniques = await fetchTechniques(token);
                    if (techniques) {
                        setTechniques(techniques);
                        setTechniqueSuggestions(generateTechniqueSuggestions(techniques));
                        if (collections && techniques) {
                            setCollectionSuggestions(generateCollectionSuggestions(collections, techniques));
                        }
                    }
                }

                const collectionTechniques = await fetchCollectionTechniques(token);
                if (collectionTechniques) {
                    setCollectionTechniques(collectionTechniques);
                }
            } catch (error) {
                console.log(error);
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
                setLoading(false);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently]);

    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No collection data available')

    // List of collections state
    const [collectionsList, setCollectionsList] = React.useState<Collection[]>([])

    // Technique editing states for in-place technique editing
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string | null>(null);
    const [editedTechnique, setEditedTechnique] = React.useState<TechniqueDTO>(emptyTechniqueDTO);
    const [editingTechniqueDialogOpen, setEditingTechniqueDialogOpen] = React.useState(false)

    // State containing index, technique pairs for drag and drop
    const [dragDropTechniques, setDragDropTechniques] = React.useState<{ index: number, technique: Technique }[]>([]);

    // Collection editing states
    const [editingCollectionId, setEditingCollectionId] = React.useState<string>("");
    const [editingCollection, setEditingCollection] = React.useState<Collection | null>(null);
    const [editingTechniquesCollection, setEditingTechniquesCollection] = React.useState<Collection | null>(null);
    const [editingCollectionDialogOpen, setEditingCollectionDialogOpen] = React.useState(false);

    // New collection fab state
    const [showFab, setShowFab] = React.useState(true)

    // Collection technique states
    const [collectionTechniques, setCollectionTechniques] = React.useState<CollectionTechnique[] | null>(null);

    // Technique filtering and selecting dialogue box below //
    // Autocomplete suggestions for technique filtering
    const [addTechniqueToCollectionDialogueOpen, setAddTechniqueToCollectionDialogueOpen] = React.useState(false);
    
    const handleOpenAddTechniqueDialogue = () => {
        setAddTechniqueToCollectionDialogueOpen(true);
    
        const dragDropTechniqueIds = new Set(dragDropTechniques.map(item => item.technique.techniqueId));
    
        setCleanedTechniques(techniques.filter(t => !dragDropTechniqueIds.has(t.techniqueId)));
    }

    const handleCloseAddTechniqueDialogue = () => {
        setAddTechniqueToCollectionDialogueOpen(false)
        setSelectedTechniques([])
    }

    const handleSaveAddTechniqueDialogue = () => {
        let updatedCollectionTechniques = dragDropTechniques
        let length = updatedCollectionTechniques?.length
        
        selectedTechniques.forEach(indexTechniquePair => {
            updatedCollectionTechniques?.push({index: length + 1, technique: indexTechniquePair.technique})
            length++
        })

        setDragDropTechniques(updatedCollectionTechniques)
    }

    // State of list of techniques to show in add technique list/extra list with already-existing techniques removed to avoid double-adding
    const [techniques, setTechniques] = React.useState<Technique[]>([]);
    const [cleanedTechniques, setCleanedTechniques] = React.useState<Technique[]>([]);
    
    // Generate options for the filters based on the full techniques list
    const techniqueOptions = useDetermineTechniqueFilterOptions(cleanedTechniques)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange(cleanedTechniques)

    // Suggestions for editing techniques in-place
    const [techniqueSuggestions, setTechniqueSuggestions] = React.useState<{
        titleOptions: string[],
        positionOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        openGuardOptions: string[],
        giOptions: string[]
    }>({
        titleOptions: [],
        positionOptions: [],
        hierarchyOptions: [],
        typeOptions: [],
        openGuardOptions: [],
        giOptions: []
    })

    const generateTechniqueSuggestions = (techniqueList: Technique[]): {
        titleOptions: string[],
        positionOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        openGuardOptions: string[],
        giOptions: string[]
    } => {
        let generatedSuggestions: {
            titleOptions: string[],
            positionOptions: string[],
            hierarchyOptions: string[],
            typeOptions: string[],
            openGuardOptions: string[],
            giOptions: string[]
        } = { 
            titleOptions: [],
            positionOptions: [],
            hierarchyOptions: ["Top", "Bottom"],
            typeOptions: [],
            openGuardOptions: [],
            giOptions: ["Yes Gi", "No Gi", "Both"]
        }
        techniqueList.forEach(technique => {
            if (!generatedSuggestions.titleOptions.includes(technique.title)) {generatedSuggestions.titleOptions.push(technique.title)}
            if (!generatedSuggestions.positionOptions.includes(technique.position?.title)) {generatedSuggestions.positionOptions.push(technique.position.title)}
            if (!generatedSuggestions.typeOptions.includes(technique.type?.title)) {generatedSuggestions.typeOptions.push(technique.type.title)}
            if (technique.openGuard && (!generatedSuggestions.openGuardOptions.includes(technique.openGuard?.title))) {generatedSuggestions.openGuardOptions.push(technique.openGuard?.title)}
        })
        return generatedSuggestions
    }

    // Selected techniques for adding to collection
    const [selectedTechniques, setSelectedTechniques] = React.useState<{ index: number, technique: Technique }[]>([]);

    const handleTechniqueCheck = (techniqueId: string) => {
        setSelectedTechniques(prevSelectedTechniques => {
            const foundTechnique = prevSelectedTechniques.find(item => item.technique.techniqueId === techniqueId);
            if (foundTechnique) {
                return prevSelectedTechniques.filter(item => item.technique.techniqueId !== techniqueId);
            } else {
                const techniqueToAdd = techniques.find(technique => technique.techniqueId === techniqueId);
                if (techniqueToAdd) {
                    return [...prevSelectedTechniques, { index: prevSelectedTechniques.length, technique: techniqueToAdd }];
                } else {
                    return prevSelectedTechniques;
                }
            }
        });
    };

    const handleTechniqueEditClick = (technique: Technique) => {
        setEditingTechniqueDialogOpen(true)
        setEditingTechniqueId(technique.techniqueId);
        setEditedTechnique({
            title: technique.title,
            videoSrc: technique.videoSrc || undefined,
            description: technique.description,
            globalNotes: technique.globalNotes || undefined,
            gi: technique.gi,
            hierarchy: technique.hierarchy,
            type: technique.type.title,
            typeDescription: technique.type.description || undefined,
            position: technique.position.title,
            positionDescription: technique.position.description,
            openGuard: technique.openGuard?.title || undefined,
            openGuardDescription: technique.openGuard?.description || undefined,
        });
        setShowFab(false)
    }

    const handleTechniqueSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        console.log(fieldValues)
        const validTechnique = transformTechniqueForBackend(fieldValues);
        console.log(validTechnique)
        if (!validTechnique) {
            alert('Not a valid technique posted')
            return
        };
        
        const postedTechnique = await postTechnique(editingTechniqueId, validTechnique, accessToken);        

        if (postedTechnique) {
            setCollectionTechniques((prevTechniques) => {
                const updatedTechniques = [...prevTechniques as CollectionTechnique[]];
                const indexToUpdate = updatedTechniques.findIndex(collectionTechnique => collectionTechnique.technique.techniqueId === editingTechniqueId);
                
                if ((indexToUpdate !== -1) && (editingTechniqueId)) {
                    updatedTechniques[indexToUpdate] = { 
                        ...updatedTechniques[indexToUpdate],
                        technique : {
                            ...validTechnique, 
                            techniqueId: editingTechniqueId,
                            position: {
                                title: validTechnique.position.title,
                                description: validTechnique.position.description
                            },
                            type: {
                                title: validTechnique.type.title,
                                description: validTechnique.type.description
                            },
                        }
                    }
                }

                if (validTechnique.openGuard) {
                    updatedTechniques[indexToUpdate] = {
                        ...updatedTechniques[indexToUpdate],
                        technique: {
                            ...updatedTechniques[indexToUpdate].technique,
                            openGuard: {
                                title: validTechnique.openGuard.title,
                                description: validTechnique.openGuard.description
                            }
                        }
                    }
                }

                return updatedTechniques;
            });
    
            setEditingTechniqueDialogOpen(false);
            setShowFab(true);
        }
    }
    
    const handleTechniqueCancelClick = () => {
        setEditingTechniqueDialogOpen(false);
        setShowFab(true)
    }

    const handleTechniqueDeleteClick = (techniqueId: string) => {
        // TODO: Call the backend API to delete the technique
        // Handle the UI update after deletion (e.g., remove the technique from the list)
    }
    

    const handleCollectionTechniqueEditClick = (collection: Collection) => {
        
        let filteredAndSortedTechniques: CollectionTechnique[] = []

        if (collectionTechniques) {filteredAndSortedTechniques = collectionTechniques
                        .filter(ct => ct.collection.collectionId === collection.collectionId)
                        .sort((a, b) => a.order - b.order)
                    }

        let orderedTechniques: {index: number, technique: Technique}[] = [];

        filteredAndSortedTechniques.forEach(orderedTechnique => {
            orderedTechniques.push({index: orderedTechnique.order, technique: orderedTechnique.technique})
        });
        setEditingTechniquesCollection(collection)
        setDragDropTechniques(orderedTechniques)
        setShowFab(false)
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

    const handleDragDropSaveClick = async () => {
        editingTechniquesCollection && await postCollectionTechniques(editingTechniquesCollection.collectionId, dragDropTechniques, accessToken);
        setEditingTechniquesCollection(null);
        setDragDropTechniques([]);

        const collections = await fetchCollectionTechniques(accessToken);
        if (collections) {
            setCollectionTechniques(collections);
        }
        setShowFab(true)
        setSelectedTechniques([])
    };

    const handleDragDropCancelClick = () => {
        setEditingTechniquesCollection(null)
        setDragDropTechniques([])
        setShowFab(true)
    }

    const handleDragDropDeleteClick = (deletedTechnique: {index: number, technique: Technique}) => {
        let newDragDropTechniques = dragDropTechniques.filter(item => item.technique !== deletedTechnique.technique)

        setDragDropTechniques(newDragDropTechniques)
    }

    interface filtersObject {
        title: string,
        hierarchy: string | null,
        type: string | null,
        position: string | null,
        openGuard: string | null,
        gi: string | null;
    }

    const handleTechniqueFilterMatchClick = (collection: Collection): {
        title: string,
        hierarchy: string | null,
        type: string | null,
        position: string | null,
        openGuard: string | null,
        gi: string | null;
    } => {

        let collectionObject: filtersObject = {
            title: "",
            hierarchy: null,
            type: null,
            position: null,
            openGuard: null,
            gi: null
        }

        if (collection.hierarchy) {collectionObject.hierarchy = collection.hierarchy}
        if (collection.type) {collectionObject.type = collection.type.title}
        if (collection.position) {collectionObject.position = collection.position.title}
        if (collection.openGuard) {collectionObject.position = collection.openGuard.title}
        if (collection.gi) {collectionObject.gi = collection.gi}
        
        return collectionObject
    }

    const handleCollectionEditClick = (collection: Collection) => {
        setEditingCollectionId(collection.collectionId);
        setEditingCollection(collection);
        setEditingCollectionDialogOpen(true)
        setShowFab(false);
    }

    const handleCollectionCancelClick = () => {
        setEditingCollectionDialogOpen(false)
        setShowFab(true);
    }

    const handleCollectionSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validCollection = transformCollectionForBackend(fieldValues);
        if (!validCollection) {
            alert('Not a valid technique posted')
            return
        };
        
        const postedCollection = await postCollection(editingCollectionId, validCollection, accessToken);

        if (postedCollection) {
            setCollectionsList((prevCollections) => {
                const updatedCollections = [...prevCollections];
                const indexToUpdate = updatedCollections.findIndex(collection => collection.collectionId === postedCollection.collectionId);
                
                if (indexToUpdate !== -1) {
                    updatedCollections[indexToUpdate] = { 
                        ...postedCollection, 
                    };
                }
                return updatedCollections;
            });
    
            setEditingCollectionDialogOpen(false)
            setShowFab(true);
        }
    }
    
    const handleCollectionDeleteClick = () => {
        const status = deleteCollection(editingCollectionId, accessToken)
        
        if (status !== null) {setCollectionsList((prevCollections) => {
            let newCollections = [
                ...prevCollections.filter(collection => {
                    return collection.collectionId !== editingCollectionId
                })
            ]

            return newCollections
        });

        setEditingCollectionDialogOpen(false)
        setShowFab(true);
        }
    }
        
    // Generated list of filtered collections which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange(collectionsList)

    const [collectionSuggestions, setCollectionSuggestions] = React.useState<{
        titleOptions: string[],
        positionOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        openGuardOptions: string[],
        giOptions: string[]
    }>({
        titleOptions: [],
        positionOptions: [],
        hierarchyOptions: [],
        typeOptions: [],
        openGuardOptions: [],
        giOptions: []
    })

    const generateCollectionSuggestions = (collectionList: Collection[], techniqueList: Technique[]): {
        titleOptions: string[],
        positionOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        openGuardOptions: string[],
        giOptions: string[]
    } => {
        let generatedSuggestions: {
            titleOptions: string[],
            positionOptions: string[],
            hierarchyOptions: string[],
            typeOptions: string[],
            openGuardOptions: string[],
            giOptions: string[]
        } = { 
            titleOptions: [],
            positionOptions: [],
            hierarchyOptions: ["Top", "Bottom"],
            typeOptions: [],
            openGuardOptions: [],
            giOptions: ["Yes Gi", "No Gi", "Both"]
        }
        collectionList.forEach(collection => {
            if (!generatedSuggestions.titleOptions.includes(collection.title)) {generatedSuggestions.titleOptions.push(collection.title)}

        })

        techniqueList.forEach(technique => {
            if (!generatedSuggestions.positionOptions.includes(technique.position?.title)) {generatedSuggestions.positionOptions.push(technique.position.title)}
            if (!generatedSuggestions.typeOptions.includes(technique.type?.title)) {generatedSuggestions.typeOptions.push(technique.type.title)}
            if (technique.openGuard && (!generatedSuggestions.openGuardOptions.includes(technique.openGuard?.title))) {generatedSuggestions.openGuardOptions.push(technique.openGuard?.title)}
        })

        return generatedSuggestions
    }

    // New collection states and functions below
    // New collection dialog state
    const [newCollectionDialogOpen, setNewCollectionDialogOpen] = React.useState(false);

    const handleNewCollectionOpen = () => {
        setNewCollectionDialogOpen(true)
    }

    const handleNewCollectionCancel = () => {
        setNewCollectionDialogOpen(false)
    }

    const handleNewCollectionSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validCollection = transformCollectionForBackend(fieldValues);
        if (!validCollection) {
            alert('Not a valid technique posted')
            return
        };
        
        const postedCollection = await postCollection(null, validCollection, accessToken)

        if (postedCollection) {
            setCollectionsList((prevCollections) => {
                const updatedCollections = [...prevCollections];
                updatedCollections.unshift(postedCollection)
                return updatedCollections
            });
    
            setShowFab(true);
            setNewCollectionDialogOpen(false);
        }
    }

    return (
        <div>
            <Card>
                <CollectionFilter 
                onCollectionFiltersChange={handleCollectionFilterChange} 
                options={collectionSuggestions}/>
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
                    onTechniqueEditClick={handleTechniqueEditClick}
                    editingTechniquesCollection={editingTechniquesCollection}

                    collectionTechniques={collectionTechniques}
                    onCollectionTechniqueEditClick={handleCollectionTechniqueEditClick}
                    onCollectionEditClick={handleCollectionEditClick}

                    onReorderDragDropTechniques={handleOnReorderDragDropTechniques}
                    dragDropTechniques={dragDropTechniques}
                    onDragDropSaveClick={handleDragDropSaveClick}
                    onDragDropCancelClick={handleDragDropCancelClick}
                    onAddNewTechniqueClick={handleOpenAddTechniqueDialogue}
                    onDragDropDeleteClick={handleDragDropDeleteClick}/>
                </Box>
            )}
            </Card>
            {showFab && (
                <Fab // Should only exist on coach version of techniques
                color="primary" 
                aria-label="add" 
                style={{position: 'fixed', bottom: '16px', right: '16px'}}
                onClick={handleNewCollectionOpen}
                >
                    <AddIcon/>
                </Fab>
            )}

            <Dialog open={addTechniqueToCollectionDialogueOpen} onClose={handleCloseAddTechniqueDialogue} scroll="paper">
                <DialogTitle sx={{padding: "0px", marginBottom: "10px"}}>
                    <Card>
                        <TechniqueFilter 
                            onTechniqueFiltersChange={handleTechniqueFilterChange} 
                            options={techniqueOptions}
                            matchTechniqueFilters={editingTechniquesCollection && (handleTechniqueFilterMatchClick(editingTechniquesCollection))}/>
                    </Card> 
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Button disabled={(selectedTechniques.length === 0)} onClick={(event) => { event.stopPropagation(); handleSaveAddTechniqueDialogue(); handleCloseAddTechniqueDialogue(); }}>Add</Button>
                        <Button onClick={(event) => { event.stopPropagation(); handleCloseAddTechniqueDialogue(); }}>Cancel</Button>
                    </Box>  
                </DialogTitle>

                <DialogContent dividers={true} sx={{padding: "0px"}}> 
                    <Card>
                        <TechniqueList 
                            filteredTechniques={filteredTechniques} 
                            checkbox
                            elevation={1} 
                            checkedTechniques={selectedTechniques}
                            onTechniqueCheck={handleTechniqueCheck}
                            />
                    </Card>
                    <div style={{paddingTop: "10px"}}/>
                </DialogContent>
            </Dialog>

            <EditTechniqueDialog
                dialogOpen={editingTechniqueDialogOpen}
                onClose={handleTechniqueCancelClick}
                onCancel={handleTechniqueCancelClick}
                onDelete={handleTechniqueDeleteClick}
                onSave={handleTechniqueSaveClick}
                editingTechnique={editedTechnique}
                editingTechniqueId={editingTechniqueId || ""}
                editingTechniqueOptions={techniqueSuggestions}
                wasSubmitted={false}
                techniqueList={techniques}
            />

            <EditCollectionDialog
                dialogOpen={editingCollectionDialogOpen}
                onClose={handleCollectionCancelClick}
                onCancel={handleCollectionCancelClick}
                onDelete={handleCollectionDeleteClick}
                onSave={handleCollectionSaveClick}
                editingCollection={editingCollection}
                editingCollectionId={editingCollectionId}
                editingCollectionOptions={collectionSuggestions}
                wasSubmitted={false}
                techniqueList={techniques}
            />

            <NewCollectionDialog
                dialogOpen={newCollectionDialogOpen}
                onClose={handleNewCollectionCancel}
                onSave={handleNewCollectionSave}
                onCancel={handleNewCollectionCancel}
                wasSubmitted={false}
                techniqueList={techniques}
                collectionOptions={collectionSuggestions}
            />
        </div>
    );
};

export default CoachCollections
