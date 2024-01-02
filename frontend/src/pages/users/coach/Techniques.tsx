import React from 'react'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { Technique } from 'common'
import { transformTechniqueForPost, transformTechniqueForPut } from '../../../util/Utilities'
import { EditTechniqueDialog } from '../../../components/Dialogs/EditTechniqueDialog'
import { NewTechniqueDialog } from '../../../components/Dialogs/NewTechniqueDialog'
import { useAuth0 } from '@auth0/auth0-react'
import { TechniqueListWithFilters } from '../../../components/Lists/TechniquesListWithFilters'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store/store'
import { deleteTechniqueAsync, postTechniqueAsync, updateTechniqueAsync } from '../../../slices/techniques'
import { setAccessToken } from '../../../slices/auth'


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

function CoachTechniques(): JSX.Element {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

    const [showFab, setShowFab] = React.useState(true)

    // Technique editing states and functions
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string>("");
    const [editedTechnique, setEditedTechnique] = React.useState<TechniqueDTO>(emptyTechniqueDTO);
    const [editingTechniqueDialogOpen, setEditingTechniqueDialogOpen] = React.useState(false)

    const [newTechniqueDialogOpen, setNewTechniqueDialogOpen] = React.useState(false)
    
    const handleEditClick = (technique: Technique) => {
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
        setEditedTechnique(emptyTechniqueDTO)
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
            <Fab // Should only exist on coach version of techniques
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
                editingTechnique={editedTechnique}
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
