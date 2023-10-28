import React from 'react'
import MuiCard from "@mui/material/Card"
import CardContent from '@mui/material/CardContent'
import MuiTextField, { TextFieldProps} from '@mui/material/TextField'
import MuiButton from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { Technique, Gi, Hierarchy } from 'common'
import theme from '../../../theme/Theme'

const TextField = styled((props: TextFieldProps) => (
    <MuiTextField {...props} />
))(({ theme }) => ({
    backgroundColor: '#3c3836',
    marginTop: "10px"
}))

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        backgroundColor: "#3c3836",
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
    }
});

const Button = styled(MuiButton)({
    '&.MuiButton-root': {
        marginTop: "10px"
    }
})

const NewTechnique: React.FC = () => {
    
    // Technique for submitting to server
    const [technique, setTechnique] = React.useState<{
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
    }>({
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
    })
    
    // Autocomplete suggestions
    const [titleSuggestions, setTitleSuggestions] = React.useState<string[]>([]);
    const [giSuggestions, setGiSuggestions] = React.useState<string[]>([]);
    const [hierarchySuggestions, setHierarchySuggestions] = React.useState<string[]>([]);
    const [typeSuggestions, setTypeSuggestions] = React.useState<string[]>([]);
    const [positionSuggestions, setPositionSuggestions] = React.useState<string[]>([]);
    const [openGuardSuggestions, setOpenGuardSuggestions] = React.useState<string[]>([]);

    // Technique field displays
    const [showTypeDescription, setShowTypeDescription] = React.useState(false)
    const [showPositionDescription, setShowPositionDescription] = React.useState(false)
    const [showOpenGuardField, setShowOpenGuardField] = React.useState(false)
    const [showOpenGuardDescription, setShowOpenGuardDescription] = React.useState(false)

    // Errors
    const [titleError, setTitleError] = React.useState(false);

    // Card border for success status
    const [borderStatus, setBorderStatus] = React.useState('none')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTechnique(prevTechnique => ({ ...prevTechnique, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validTechnique = transformTechniqueForBackend(technique);
        if (!validTechnique) {
            alert('Not a valid technique posted')
            return
        };
        
        const status = await postTechnique(validTechnique);

        if (status === 200) {
            setTechnique({
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
            })
            setBorderStatus(`1px solid ${theme.palette.success.main}`)
            setTimeout(() => {
                setBorderStatus('none')
            }, 3000)
            
        }
    }

    React.useEffect(() => {
        (async () => {
            try {
                const [typeResponse, titleResponse, positionResponse, openGuardResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/technique/types'),
                    fetch('http://192.168.0.156:3000/api/technique/titles'),
                    fetch('http://192.168.0.156:3000/api/technique/positions'),
                    fetch('http://192.168.0.156:3000/api/technique/openGuards')
                ]);

                interface TitleObject {
                    title: string
                }
    
                const types = (await typeResponse.json()).map((typeObj: TitleObject) => typeObj.title);
                const titles = (await titleResponse.json()).map((titleObj: TitleObject) => titleObj.title);
                const positions = (await positionResponse.json()).map((positionObj: TitleObject) => positionObj.title);
                const openGuards = (await openGuardResponse.json()).map((openGuardObj: TitleObject) => openGuardObj.title);
    
                setTypeSuggestions(types);
                setTitleSuggestions(titles);
                setPositionSuggestions(positions);
                setOpenGuardSuggestions(openGuards);
                setGiSuggestions(['Yes Gi', 'No Gi', 'Both']);
                setHierarchySuggestions(['Top', 'Bottom']);
            } catch (error) {
                alert(`Error fetching data: ${error}`);
            }
        })();
    }, []);

    return (
        <div>
            <Card sx={{border: borderStatus}}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Autocomplete
                            options={titleSuggestions}
                            freeSolo
                            inputValue={technique.title}
                            onInputChange={(event, newValue) => {
                                setTechnique(prevTechnique => ({ ...prevTechnique, title: newValue }));
                                setTitleError(titleSuggestions.includes(newValue));
                            }}
                            openOnFocus={false}
                            filterOptions={(options, { inputValue }) => {
                                return inputValue ? options.filter(option => 
                                    option.toLowerCase().includes(inputValue.toLowerCase())
                                ) : [];
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Technique Title"
                                    variant="outlined"
                                    error={titleError}
                                    helperText={titleError ? "Technique already exists" : ''}
                                />
                            )}
                        />

                        <TextField
                            fullWidth
                            label="Video Source"
                            name="videoSrc"
                            value={technique.videoSrc}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Technique Description"
                            name="description"
                            value={technique.description}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Global Notes"
                            name="globalNotes"
                            value={technique.globalNotes}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <Autocomplete
                            options={giSuggestions}
                            inputValue={technique.gi}
                            onInputChange={(event, newValue) => {
                                setTechnique(prevGi => ({ ...prevGi, gi: newValue }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Gi or No Gi"
                                    variant="outlined"
                                />
                            )}
                        />
                        <Autocomplete
                            options={hierarchySuggestions}
                            inputValue={technique.hierarchy}
                            onInputChange={(event, newValue) => {
                                setTechnique(prevHierarchy => ({ ...prevHierarchy, hierarchy: newValue }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Hierarchy"
                                    variant="outlined"
                                />
                            )}
                        />
                        <Autocomplete
                            freeSolo
                            options={typeSuggestions}
                            inputValue={technique.type}
                            onInputChange={(event, newValue) => {
                                setTechnique(prevType => ({ ...prevType, type: newValue }));
                                const matchingSuggestions = typeSuggestions.filter(option => 
                                    option.toLowerCase().includes(newValue.toLowerCase())
                                );
                                setShowTypeDescription(matchingSuggestions.length === 0);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Type"
                                    variant="outlined"
                                />
                            )}
                        />
                        {showTypeDescription && (
                            <TextField
                                fullWidth
                                label="Type Description"
                                name="typeDescription"
                                value={technique.typeDescription}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        )}
                        <Autocomplete
                            freeSolo
                            options={positionSuggestions}
                            inputValue={technique.position}
                            onInputChange={(event, newValue) => {
                                setTechnique(prevPosition => ({ ...prevPosition, position: newValue }));
                                const matchingSuggestions = positionSuggestions.filter(option => 
                                    option.toLowerCase().includes(newValue.toLowerCase())
                                );
                                setShowPositionDescription(matchingSuggestions.length === 0);
                                setShowOpenGuardField(newValue.toLowerCase() === "open guard");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Position"
                                    variant="outlined"
                                />
                            )}
                        />
                        {showPositionDescription && (
                            <TextField
                                fullWidth
                                label="Position Description"
                                name="positionDescription"
                                value={technique.positionDescription}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        )}
                        {showOpenGuardField && (
                            <Autocomplete
                                options={openGuardSuggestions}
                                freeSolo
                                inputValue={technique.openGuard}
                                onInputChange={(event, newValue) => {
                                    setTechnique(prevOpenGuard => ({ ...prevOpenGuard, openGuard: newValue }));
                                    const matchingSuggestions = openGuardSuggestions.filter(option => 
                                        option.toLowerCase().includes(newValue.toLowerCase())
                                    );
                                    setShowOpenGuardDescription(matchingSuggestions.length === 0);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Open Guard"
                                        name="openGuard"
                                        variant="outlined"
                                    />
                                )}
                            />
                        )}
                        {showOpenGuardDescription && showOpenGuardField && (
                            <TextField
                                fullWidth
                                label="Open Guard Description"
                                name="openGuardDescription"
                                value={technique.openGuardDescription}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        )}
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

const transformTechniqueForBackend = (technique: any): Technique | null => {
    if (!Object.values(Gi).includes(technique.gi)) {
      alert('Invalid Gi value');
      return null;
    }
  
    if (!Object.values(Hierarchy).includes(technique.hierarchy)) {
      alert('Invalid Hierarchy value');
      return null;
    }

    return {
      ...technique,
      gi: technique.gi as Gi,
      hierarchy: technique.hierarchy as Hierarchy,
    };
  }

const postTechnique = async (technique: Technique) => {
    try {
        const response = await fetch('http://192.168.0.156:3000/api/technique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(technique),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Success:', responseData);
        
        return response.status
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting technique: ${error}`);
            return error
        }
};

export default NewTechnique;
