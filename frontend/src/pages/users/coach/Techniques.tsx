import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { Technique } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import TechniqueList from '../../../components/TechniqueList'
import TechniqueFilter, { useDetermineTechniqueFilterOptions, useHandleTechniqueFilterChange } from '../../../components/TechniqueFilter'
import { transformTechniqueForBackend, postTechnique, deleteTechnique, fetchTechniques } from '../../../util/Utilities'
import { EditTechniqueDialog } from '../../../components/EditTechniqueDialog'
import { NewTechniqueDialog } from '../../../components/NewTechniqueDialog'
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

function CoachTechniques(): JSX.Element {
    const { getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);

                const techniques = await fetchTechniques(token);
                if (techniques) {
                    setTechniquesList(techniques);
                    setTechniqueSuggestions(generateTechniqueSuggestions(techniques));
                    setLoading(false);                    
                }

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently]);

    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [showFab, setShowFab] = React.useState(true)

    // List of techniques state
    const [techniquesList, setTechniquesList] = React.useState<Technique[]>([])

    // Technique editing states and functions
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string | null>(null);
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
        const fieldValues = Object.fromEntries(formData.entries())
        console.log(fieldValues, editingTechniqueId)
        const validTechnique = transformTechniqueForBackend(fieldValues);
        console.log(validTechnique)
        if (!validTechnique) {
            alert('Not a valid technique posted')
            return
        };
        
        const postedTechnique = await postTechnique(editingTechniqueId, validTechnique, accessToken);        

        if (postedTechnique) {
            setTechniquesList((prevTechniques) => {
                const updatedTechniques = [...prevTechniques];
                const indexToUpdate = updatedTechniques.findIndex(technique => technique.techniqueId === editingTechniqueId);
                
                if ((indexToUpdate !== -1) && (editingTechniqueId)) {
                    updatedTechniques[indexToUpdate] = { 
                        ...postedTechnique
                    };
                }

                return updatedTechniques;
            });
    
            setEditingTechniqueDialogOpen(false)
        }
    }
    
    const handleCancelClick = () => {
        setEditingTechniqueDialogOpen(false)
        setNewTechniqueDialogOpen(false)
    } // Doesn't care which dialog is getting cancelled

    const handleDeleteClick = (techniqueId: string) => {
        const status = deleteTechnique(techniqueId, accessToken)
        
        if (status !== null) {setTechniquesList((techniques) => {
            let newTechniques = [
                ...techniques.filter(technique => {
                    return technique.techniqueId !== editingTechniqueId
                })
            ]

            return newTechniques
        });

        setEditingTechniqueDialogOpen(false)
        setShowFab(true);
        }
    }

    const handleNewTechniqueClick = () => {
        setNewTechniqueDialogOpen(true)
        setEditedTechnique(emptyTechniqueDTO)
        setEditingTechniqueId(null)
        setShowFab(false)
    }

    const handleNewTechniqueSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validTechnique = transformTechniqueForBackend(fieldValues);
        if (!validTechnique) {
            alert('Not a valid technique posted')
            return
        };
        
        const postedTechnique = await postTechnique(null, validTechnique, accessToken);        

        if (postedTechnique) {
            setTechniquesList((prevTechniques) => {
                const updatedTechniques = [...prevTechniques];
                updatedTechniques.unshift(postedTechnique)
                return updatedTechniques
            });
    
            setNewTechniqueDialogOpen(false)
            setShowFab(true);
        }
    }

    // Generate options for the filters based on the full techniques list
    const options = useDetermineTechniqueFilterOptions(techniquesList)
    
    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleTechniqueFilterChange: handleFilterChange } = useHandleTechniqueFilterChange(techniquesList)

    // Autocomplete suggestions when editing techniques
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
            giOptions: ["Gi", "No Gi", "Both"]
        }
        techniqueList.forEach(technique => {
            if (!generatedSuggestions.titleOptions.includes(technique.title)) {generatedSuggestions.titleOptions.push(technique.title)}
            if (!generatedSuggestions.positionOptions.includes(technique.position?.title)) {generatedSuggestions.positionOptions.push(technique.position.title)}
            if (!generatedSuggestions.typeOptions.includes(technique.type?.title)) {generatedSuggestions.typeOptions.push(technique.type.title)}
            if (technique.openGuard && (!generatedSuggestions.openGuardOptions.includes(technique.openGuard?.title))) {generatedSuggestions.openGuardOptions.push(technique.openGuard?.title)}
        })
        return generatedSuggestions
    }

    return (
        <div>
            <Card>
                <TechniqueFilter 
                onTechniqueFiltersChange={handleFilterChange} 
                options={options}/>
            </Card>
            <Card>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : filteredTechniques.length === 0 ? (
                <CardContent>
                    <Typography>No technique data available</Typography>
                </CardContent>
            ) : (
                <TechniqueList
                filteredTechniques={filteredTechniques}
                editable
                onEditClick={handleEditClick}
                />
            )}
            </Card>
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
                editingTechniqueId={editingTechniqueId || ""}
                editingTechniqueOptions={techniqueSuggestions}
                wasSubmitted={false}
                techniqueList={techniquesList}
            />
            <NewTechniqueDialog
                dialogOpen={newTechniqueDialogOpen}
                onClose={handleCancelClick}
                onCancel={handleCancelClick}
                onSave={handleNewTechniqueSaveClick}
                wasSubmitted={false}
                techniqueList={techniquesList}
                techniqueOptions={techniqueSuggestions}
            />
        </div>
    );
};

export default CoachTechniques
