import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Technique } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import TechniqueList from '../../../components/TechniqueList'
import TechniqueFilter, { useDetermineTechniqueFilterOptions, useHandleTechniqueFilterChange } from '../../../components/TechniqueFilter'
import { transformTechniqueForBackend, postTechnique } from '../../../util/Utilities'
import { EditTechniqueDialog } from '../../../components/EditTechniqueDialog'


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
    const navigate = useNavigate();
    const navigateToNewTechnique = () => { navigate('/newtechnique') }

    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No technique data available')

    // List of techniques state
    const [techniquesList, setTechniquesList] = React.useState<Technique[]>([])

    // Technique editing states and functions
    const [editingTechniqueId, setEditingTechniqueId] = React.useState<string | null>(null);
    const [editedTechnique, setEditedTechnique] = React.useState<TechniqueDTO>(emptyTechniqueDTO);
    
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
    }

    const handleSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
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
        
        const status = await postTechnique(editingTechniqueId, validTechnique);        

        if (status === 200) {
            setTechniquesList((prevTechniques) => {
                const updatedTechniques = [...prevTechniques];
                const indexToUpdate = updatedTechniques.findIndex(technique => technique.techniqueId === editingTechniqueId);
                
                if ((indexToUpdate !== -1) && (editingTechniqueId)) {
                    updatedTechniques[indexToUpdate] = { 
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
                    };
                }

                if (validTechnique.openGuard) {
                    updatedTechniques[indexToUpdate] = {
                        ...updatedTechniques[indexToUpdate],
                        openGuard: {
                            title: validTechnique.openGuard.title,
                            description: validTechnique.openGuard.description
                        }
                    }
                }

                return updatedTechniques;
            });
    
            setEditingTechniqueId(null);
            setEditedTechnique(emptyTechniqueDTO);
        }
    }
    
    const handleCancelClick = () => {
        setEditingTechniqueId(null);
        setEditedTechnique(emptyTechniqueDTO);
    }

    const handleDeleteClick = (techniqueId: string) => {
        // TODO: Call the backend API to delete the technique
        // Handle the UI update after deletion (e.g., remove the technique from the list)
    }

    const handleClose = () => {
        setEditingTechniqueId(null);
        setEditedTechnique(emptyTechniqueDTO);
    }

    const fetchTechniques = async () => {
        setLoading(true);
        try {
            const [techniqueResponse] = await Promise.all([
                fetch('http://192.168.0.156:3000/api/technique')
            ]);

            const techniques: Technique[] = await (techniqueResponse.json())
            techniques.sort((a, b) => a.title.localeCompare(b.title));

            return techniques
        } catch (error) {
            setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
            return null
        } finally {
            setLoading(false); // Set loading to false in both cases
        }
    }

    // Generate options for the filters based on the full techniques list
    const options = useDetermineTechniqueFilterOptions(techniquesList)
    
    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleTechniqueFilterChange: handleFilterChange } = useHandleTechniqueFilterChange(techniquesList)

    // Autocomplete suggestions when editing techniques
    const [techniqueSuggestions, setTechniqueSuggestions] = React.useState<{
        techniqueTitleOptions: string[],
        techniquePositionOptions: string[],
        techniqueHierarchyOptions: string[],
        techniqueTypeOptions: string[],
        techniqueOpenGuardOptions: string[],
        techniqueGiOptions: string[]
    }>({
        techniqueTitleOptions: [],
        techniquePositionOptions: [],
        techniqueHierarchyOptions: [],
        techniqueTypeOptions: [],
        techniqueOpenGuardOptions: [],
        techniqueGiOptions: []
    })

    const generateTechniqueSuggestions = (techniqueList: Technique[]): {
        techniqueTitleOptions: string[],
        techniquePositionOptions: string[],
        techniqueHierarchyOptions: string[],
        techniqueTypeOptions: string[],
        techniqueOpenGuardOptions: string[],
        techniqueGiOptions: string[]
    } => {
        let generatedSuggestions: {
            techniqueTitleOptions: string[],
            techniquePositionOptions: string[],
            techniqueHierarchyOptions: string[],
            techniqueTypeOptions: string[],
            techniqueOpenGuardOptions: string[],
            techniqueGiOptions: string[]
        } = { 
            techniqueTitleOptions: [],
            techniquePositionOptions: [],
            techniqueHierarchyOptions: ["Top", "Bottom"],
            techniqueTypeOptions: [],
            techniqueOpenGuardOptions: [],
            techniqueGiOptions: ["Gi", "No Gi", "Both"]
        }
        techniqueList.forEach(technique => {
            if (!generatedSuggestions.techniqueTitleOptions.includes(technique.title)) {generatedSuggestions.techniqueTitleOptions.push(technique.title)}
            if (!generatedSuggestions.techniquePositionOptions.includes(technique.position?.title)) {generatedSuggestions.techniquePositionOptions.push(technique.position.title)}
            if (!generatedSuggestions.techniqueTypeOptions.includes(technique.type?.title)) {generatedSuggestions.techniqueTypeOptions.push(technique.type.title)}
            if (technique.openGuard && (!generatedSuggestions.techniqueOpenGuardOptions.includes(technique.openGuard?.title))) {generatedSuggestions.techniqueOpenGuardOptions.push(technique.openGuard?.title)}
        })
        return generatedSuggestions
    }

    React.useEffect(() => {
        fetchTechniques().then(techniques => {
            if (techniques) {
                setTechniquesList(techniques); // Sets list of techniques
                setTechniqueSuggestions(generateTechniqueSuggestions(techniques)) // Also generates technique suggestions used for editing techniques
            }; // Only update state if fetchTechniques returns a value
        });
    }, []);

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
                    <Typography>{placeholderContent}</Typography>
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
            onClick={navigateToNewTechnique}
            >
                <AddIcon/>
            </Fab>
            <EditTechniqueDialog
                dialogOpen={editingTechniqueId ? true : false}
                onClose={handleClose}
                onCancel={handleCancelClick}
                onDelete={handleDeleteClick}
                onSave={handleSaveClick}
                editingTechnique={editedTechnique}
                editingTechniqueId={editingTechniqueId || ""}
                editingTechniqueOptions={techniqueSuggestions}
                wasSubmitted={false}
                techniqueList={techniquesList}
            />
        </div>
    );
};

export default CoachTechniques
