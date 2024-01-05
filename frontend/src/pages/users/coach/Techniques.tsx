import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'
import { Technique } from 'common'
import React from 'react'
import { useDispatch } from 'react-redux'
import { EditTechniqueDialog } from '../../../components/Dialogs/EditTechniqueDialog'
import { NewTechniqueDialog } from '../../../components/Dialogs/NewTechniqueDialog'
import { TechniqueListWithFilters } from '../../../components/Lists/TechniquesListWithFilters'
import { deleteTechniqueAsync, postTechniqueAsync, updateTechniqueAsync } from '../../../slices/techniques'
import { AppDispatch } from '../../../store/store'
import { transformTechniqueForPost, transformTechniqueForPut } from '../../../util/Utilities'


interface TechniqueDTO {
    title: string,
    videos: {title: string, hyperlink: string}[],
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

function CoachTechniques(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    const [showFab, setShowFab] = React.useState(true)

    // Technique editing states and functions
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string>("");
    const [editingTechnique, setEditingTechnique] = React.useState<TechniqueDTO>(emptyTechniqueDTO);
    const [editingTechniqueDialogOpen, setEditingTechniqueDialogOpen] = React.useState(false)

    const [newTechniqueDialogOpen, setNewTechniqueDialogOpen] = React.useState(false)
    
    const handleEditClick = (technique: Technique) => {
        setEditingTechniqueId(technique.techniqueId);
        setEditingTechnique({
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
        setEditingTechniqueDialogOpen(true)
        setShowFab(false)
    }

    const handleEditSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries());
        const fieldValuesWithId = {
            ...fieldValues,
            techniqueId: editingTechniqueId
        }
        const validTechnique = transformTechniqueForPut(fieldValuesWithId);

        dispatch(updateTechniqueAsync(validTechnique))
    
        setEditingTechniqueDialogOpen(false)
    }
    
    const handleCancelClick = () => {
        setEditingTechniqueDialogOpen(false)
        setNewTechniqueDialogOpen(false)
    }

    const handleDeleteClick = (techniqueId: string) => {
        dispatch(deleteTechniqueAsync(techniqueId))
        setEditingTechniqueDialogOpen(false)
        setShowFab(true);
    }

    const handleNewTechniqueClick = () => {
        setNewTechniqueDialogOpen(true)
        setEditingTechnique(emptyTechniqueDTO)
        setEditingTechniqueId("")
        setShowFab(false)
    }

    const handleNewTechniqueSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validTechnique = transformTechniqueForPost(fieldValues);

        dispatch(postTechniqueAsync(validTechnique))
        setNewTechniqueDialogOpen(false)
        setShowFab(true);
    }

    return (
        <div>
            <TechniqueListWithFilters
            onTechniqueEditClick={handleEditClick}
            editable
            />
            <Fab
            color="primary" 
            aria-label="add" 
            style={{position: 'fixed', bottom: '16px', right: '16px'}}
            onClick={handleNewTechniqueClick}
            hidden={!showFab}
            >
                <AddIcon/>
            </Fab>
            <EditTechniqueDialog
                dialogOpen={editingTechniqueDialogOpen}
                onClose={handleCancelClick}
                onCancel={handleCancelClick}
                onDelete={handleDeleteClick}
                onSave={handleEditSaveClick}
                editingTechnique={editingTechnique}
                editingTechniqueId={editingTechniqueId}
            />
            <NewTechniqueDialog
                dialogOpen={newTechniqueDialogOpen}
                onClose={handleCancelClick}
                onCancel={handleCancelClick}
                onSave={handleNewTechniqueSaveClick}
            />
        </div>
    );
};

export default CoachTechniques
