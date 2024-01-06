import AddIcon from '@mui/icons-material/Add'
import { Card, CardContent, Typography } from '@mui/material'
import Fab from '@mui/material/Fab'
import { Collection, CollectionTechnique, Technique } from 'common'
import React from 'react'
import Pageloader from '../../../components/Base/PageLoader'
import { AddTechniqueToCollectionDialog } from '../../../components/Dialogs/AddTechniqueToCollectionDialog'
import { EditCollectionDialog } from '../../../components/Dialogs/EditCollectionDialog'
import { EditTechniqueDialog } from '../../../components/Dialogs/EditTechniqueDialog'
import { NewCollectionDialog } from '../../../components/Dialogs/NewCollectionDialog'
import { CollectionListWithFilters } from '../../../components/Lists/CollectionListWithFilters'
import { useDeleteCollectionMutation, useEditCollectionMutation, useEditTechniqueMutation, useGetCollectionTechniquesQuery, usePostNewCollectionMutation, useSetCollectionTechniquesMutation } from '../../../services/syllabusTrackerApi'
import { transformCollectionForPost, transformCollectionForPut, transformTechniqueForPut } from '../../../util/Utilities'


interface TechniqueDTO {
    title: string,
    videos: { title: string, hyperlink: string }[],
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
    videos: [],
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

function CoachCollections(): JSX.Element {
    const { data: collectionTechniques, isLoading, isSuccess, error } = useGetCollectionTechniquesQuery()
    const [postCollectionTechniques] = useSetCollectionTechniquesMutation()
    const [updateCollection] = useEditCollectionMutation()
    const [deleteCollection] = useDeleteCollectionMutation()
    const [editTechnique] = useEditTechniqueMutation()
    const [postCollection] = usePostNewCollectionMutation()

    // Technique editing states for in-place technique editing
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string>("");
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
    const [showNewCollectionFab, setShowNewCollectionFab] = React.useState(true)

    // Technique filtering and selecting dialogue box below //
    // Autocomplete suggestions for technique filtering
    const [addTechniqueToCollectionDialogueOpen, setAddTechniqueToCollectionDialogueOpen] = React.useState(false);

    const handleOpenAddTechniqueDialogue = () => {
        setAddTechniqueToCollectionDialogueOpen(true);
    }

    const handleCloseAddTechniqueDialogue = () => {
        setAddTechniqueToCollectionDialogueOpen(false)
    }

    const handleSaveAddTechniqueDialogue = (selectedTechniques: { index: number, technique: Technique }[]) => {
        let updatedCollectionTechniques = dragDropTechniques
        let length = updatedCollectionTechniques?.length

        selectedTechniques.forEach(indexTechniquePair => {
            updatedCollectionTechniques?.push({ index: length + 1, technique: indexTechniquePair.technique })
            length++
        })

        setDragDropTechniques(updatedCollectionTechniques)
    }

    const handleTechniqueEditClick = (technique: Technique) => {
        setEditingTechniqueDialogOpen(true)
        setEditingTechniqueId(technique.techniqueId);
        setEditedTechnique({
            title: technique.title,
            videos: technique.videos || [],
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
        setShowNewCollectionFab(false)
    }

    const handleTechniqueSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validTechnique = transformTechniqueForPut(fieldValues);

        editTechnique(validTechnique)
        setEditingTechniqueDialogOpen(false);
        setShowNewCollectionFab(true);
    }

    const handleTechniqueCancelClick = () => {
        setEditingTechniqueDialogOpen(false);
        setShowNewCollectionFab(true)
    }

    const handleTechniqueDeleteClick = (techniqueId: string) => {
        // TODO because this is slightly confusing and I don't want people deleting stuff by accident
    }

    const handleCollectionTechniqueEditClick = (collection: Collection) => {

        let filteredAndSortedTechniques: CollectionTechnique[] = []

        if (collectionTechniques) {
            filteredAndSortedTechniques = collectionTechniques
                .filter(ct => ct.collection.collectionId === collection.collectionId)
                .sort((a, b) => a.order - b.order)
        }

        let orderedTechniques: { index: number, technique: Technique }[] = [];

        filteredAndSortedTechniques.forEach(orderedTechnique => {
            orderedTechniques.push({ index: orderedTechnique.order, technique: orderedTechnique.technique })
        });
        setEditingTechniquesCollection(collection)
        setDragDropTechniques(orderedTechniques)
        setShowNewCollectionFab(false)
    }

    const handleReorderDragDropTechniques = (newDragDropOrder: { index: number, technique: Technique }[]) => {
        let newIndex = 1
        let newOrder: { index: number, technique: Technique }[] = []
        newDragDropOrder.forEach(item => {
            newOrder.push({ index: newIndex, technique: item.technique })
            newIndex++
        })
        setDragDropTechniques(newOrder)
    }

    const handleDragDropSaveClick = async (collectionId: string) => {
        postCollectionTechniques({
            collectionId: collectionId,
            collectionTechniques: dragDropTechniques
        })
        setEditingTechniquesCollection(null);
        setDragDropTechniques([]);
        setShowNewCollectionFab(true)
    };

    const handleDragDropCancelClick = () => {
        setEditingTechniquesCollection(null)
        setDragDropTechniques([])
        setShowNewCollectionFab(true)
    };

    const handleDragDropDeleteClick = (deletedTechnique: { index: number, technique: Technique }) => {
        let newDragDropTechniques = dragDropTechniques.filter(item => item.technique !== deletedTechnique.technique)
        setDragDropTechniques(newDragDropTechniques)
    };

    const handleCollectionEditClick = (collection: Collection) => {
        setEditingCollectionId(collection.collectionId);
        setEditingCollection(collection);
        setEditingCollectionDialogOpen(true)
        setShowNewCollectionFab(false);
    }

    const handleCollectionCancelClick = () => {
        setEditingCollectionDialogOpen(false)
        setShowNewCollectionFab(true);
    }

    const handleCollectionSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries());
        const fieldValuesWithId = {
            ...fieldValues,
            collectionId: editingCollectionId
        }
        const validCollection = transformCollectionForPut(fieldValuesWithId);

        updateCollection(validCollection)
        setEditingCollectionDialogOpen(false);
        setShowNewCollectionFab(true);
    }

    const handleCollectionDeleteClick = () => {
        deleteCollection(editingCollectionId)
        setEditingCollectionDialogOpen(false);
        setShowNewCollectionFab(true);
    };

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
        const validCollection = transformCollectionForPost(fieldValues);

        await postCollection(validCollection)
            .unwrap()
            .then(postedCollection => {
                setNewCollectionDialogOpen(false);
                handleCollectionTechniqueEditClick(postedCollection);
                handleOpenAddTechniqueDialogue();
                setLastAddedCollectionId(postedCollection.collectionId);
            })
    }

    const [lastAddedCollectionId, setLastAddedCollectionId] = React.useState<null | string>(null);

    const handleAccordionChange = () => {
        setLastAddedCollectionId(null);
    }

    return (
        <div>
            {isLoading
                ? <Pageloader />
                : isSuccess ?
                    <>
                        <CollectionListWithFilters
                            editable
                            onAccordionChange={handleAccordionChange}
                            lastAddedCollectionId={lastAddedCollectionId}
                            editingTechniquesCollection={editingTechniquesCollection}
                            onTechniqueEditClick={handleTechniqueEditClick}
                            onCollectionTechniqueEditClick={handleCollectionTechniqueEditClick}
                            onCollectionEditClick={handleCollectionEditClick}
                            dragDropTechniques={dragDropTechniques}
                            onReorderDragDropTechniques={handleReorderDragDropTechniques}
                            onDragDropSaveClick={handleDragDropSaveClick}
                            onDragDropCancelClick={handleDragDropCancelClick}
                            onDragDropDeleteClick={handleDragDropDeleteClick}
                            onOpenAddTechniqueDialogue={handleOpenAddTechniqueDialogue}
                        />

                        <AddTechniqueToCollectionDialog
                            dialogOpen={addTechniqueToCollectionDialogueOpen}
                            onClose={handleCloseAddTechniqueDialogue}
                            onCancel={handleCloseAddTechniqueDialogue}
                            onSave={handleSaveAddTechniqueDialogue}
                            editingTechniquesCollection={editingTechniquesCollection}
                        />

                        <EditTechniqueDialog
                            dialogOpen={editingTechniqueDialogOpen}
                            onClose={handleTechniqueCancelClick}
                            onCancel={handleTechniqueCancelClick}
                            onDelete={handleTechniqueDeleteClick}
                            onSave={handleTechniqueSaveClick}
                            editingTechnique={editedTechnique}
                            editingTechniqueId={editingTechniqueId}
                        />

                        <EditCollectionDialog
                            dialogOpen={editingCollectionDialogOpen}
                            onClose={handleCollectionCancelClick}
                            onCancel={handleCollectionCancelClick}
                            onDelete={handleCollectionDeleteClick}
                            onSave={handleCollectionSaveClick}
                            editingCollection={editingCollection}
                            editingCollectionId={editingCollectionId}
                        />

                        <NewCollectionDialog
                            dialogOpen={newCollectionDialogOpen}
                            onClose={handleNewCollectionCancel}
                            onSave={handleNewCollectionSave}
                            onCancel={handleNewCollectionCancel}
                        />

                        {showNewCollectionFab && (
                            <Fab
                                color="primary"
                                aria-label="add"
                                style={{ position: 'fixed', bottom: '16px', right: '16px' }}
                                onClick={handleNewCollectionOpen}
                            >
                                <AddIcon />
                            </Fab>
                        )}
                    </>
                    : <Card><CardContent><Typography>{`Collection technique data failed to fetch: ${error}`}</Typography></CardContent></Card>
            }
        </div>
    );
};

export default CoachCollections
