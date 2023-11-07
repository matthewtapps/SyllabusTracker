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
import TechniqueFilter, { useDetermineFilterOptions, useHandleFilterChange } from '../../../components/TechniqueFilter'
import { useDebounce } from 'usehooks-ts'


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
    const [editedTechnique, setEditedTechnique] = React.useState<TechniqueDTO>({
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
    });
    
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
            typeDescription: technique.type.description|| undefined,
            position: technique.position.title,
            positionDescription: technique.position.description,
            openGuard: technique.openGuard?.title || undefined,
            openGuardDescription: technique.openGuard?.description || undefined,
        });
    }

    const handleSaveClick = async () => {
        // TODO: Call the backend API to update the technique
        // After successful update, clear the editing states
        setEditingTechniqueId(null);
        setEditedTechnique({
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
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditedTechnique((prevTechnique: TechniqueDTO) => ({ ...prevTechnique, [name]: value }));
    };

    type SomeFunction = (...args: any[]) => void;
    type Timer = ReturnType<typeof setTimeout>;
    
    function useDebounce<Func extends SomeFunction>(func: Func, delay: number) {
        const [timer, setTimer] = React.useState<Timer>(); //Create timer state
    
        const debouncedFunction = ((...args) => {
            const newTimer = setTimeout(() => {
                func(...args);
            }, delay);
            clearTimeout(timer); //Cancel previous timers
            setTimer(newTimer); //Save latest timer
        }) as Func;

        return debouncedFunction;
    };

    const debouncedHandleInputChange = useDebounce(handleInputChange, 10000)

    const handleCancelClick = () => {
        setEditingTechniqueId(null);
        setEditedTechnique({
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
        });
    }

    const handleDeleteClick = (techniqueId: string) => {
        // TODO: Call the backend API to delete the technique
        // Handle the UI update after deletion (e.g., remove the technique from the list)
    }

    React.useEffect(() => {
        (async () => {
            try {
                const [techniqueResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/technique')
                ]);

                const techniques: Technique[] = await (techniqueResponse.json())
                setTechniquesList(techniques)
                
                setLoading(false)

            } catch (error) {
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
                
                setLoading(false)
            }
        })();
    }, []);

    // Generate options for the filters based on the full techniques list
    const options = useDetermineFilterOptions(techniquesList)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleFilterChange } = useHandleFilterChange(techniquesList)

    return (
        <div>
            <Card>
                <TechniqueFilter 
                onFiltersChange={handleFilterChange} 
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
                editingTechniqueId={editingTechniqueId}
                editingTechnique={editedTechnique}
                onEditClick={handleEditClick}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
                onDeleteClick={handleDeleteClick}
                onInputChange={debouncedHandleInputChange}
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
        </div>
    );
};

export default CoachTechniques
