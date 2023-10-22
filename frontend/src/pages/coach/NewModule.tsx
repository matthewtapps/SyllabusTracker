import React from 'react'
import MuiCard from "@mui/material/Card"
import CardContent from '@mui/material/CardContent'
import MuiTextField, { TextFieldProps} from '@mui/material/TextField'
import MuiButton from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import NavBar from '../../components/NavBar'
import { styled } from '@mui/material/styles'
import { Technique, Module, Gi, Hierarchy } from 'common'

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
const NewModule: React.FC = () => {
    
    const [module, setModule] = React.useState({
        title: '',
        description: '',
        globalNotes: '',
        gi: '',
        type: '',
        position: '',
        openGuard: '',
        hierarchy: ''
    })
    
    // Autocomplete suggestions
    const [techniques, setTechniques] = React.useState<Technique[]>([]);
    const [titleSuggestions, setTitleSuggestions] = React.useState<string[]>([]);
    const [giSuggestions, setGiSuggestions] = React.useState<string[]>([]);
    const [typeSuggestions, setTypeSuggestions] = React.useState<string[]>([]);
    const [positionSuggestions, setPositionSuggestions] = React.useState<string[]>([]);
    const [openGuardSuggestions, setOpenGuardSuggestions] = React.useState<string[]>([]);
    const [hierarchySuggestions, setHierarchySuggestions] = React.useState<string[]>([]);

    // Module field displays
    const [showOpenGuardField, setShowOpenGuardField] = React.useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setModule(prevTechnique => ({ ...prevTechnique, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validModule = transformModuleForBackend(module);
        if (!validModule) {
            alert('Not a valid technique posted')
            return
        };
        
        await postModule(validModule);
        }

    React.useEffect(() => {
        (async () => {
            try {
                const [titleResponse, techniqueResponse, typeResponse, positionResponse, openGuardResponse] = await Promise.all([
                    fetch('http://localhost:3000/api/module/titles'),
                    fetch('http://localhost:3000/api/technique'),
                    fetch('http://localhost:3000/api/technique/types'),
                    fetch('http://localhost:3000/api/technique/positions'),
                    fetch('http://localhost:3000/api/technique/openGuards'),
                ]);

                interface TitleObject {
                    title: string
                }
                
                const techniques = (await techniqueResponse.json())
                const types = (await typeResponse.json()).map((typeObj: TitleObject) => typeObj.title);
                const titles = (await titleResponse.json()).map((titleObj: TitleObject) => titleObj.title);
                const positions = (await positionResponse.json()).map((positionObj: TitleObject) => positionObj.title);
                const openGuards = (await openGuardResponse.json()).map((openGuardObj: TitleObject) => openGuardObj.title);
    
                setTechniques(techniques)
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
        <NavBar text="New Module"/>
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Autocomplete
                        options={titleSuggestions}
                        freeSolo
                        inputValue={module.title}
                        onInputChange={(event, newValue) => {
                            setModule(prevTechnique => ({ ...prevTechnique, title: newValue }));
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
                                label="Module Title"
                                variant="outlined"
                            />
                        )}
                    />

                    <TextField
                        fullWidth
                        label="Module Description"
                        name="description"
                        value={module.description}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Optional: Global Notes"
                        name="globalNotes"
                        value={module.globalNotes}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <Autocomplete
                        options={giSuggestions}
                        inputValue={module.gi}
                        onInputChange={(event, newValue) => {
                            setModule(prevGi => ({ ...prevGi, gi: newValue }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Optional: Gi or No Gi"
                                variant="outlined"
                                name="gi"
                            />
                        )}
                    />
                    <Autocomplete
                        options={hierarchySuggestions}
                        inputValue={module.hierarchy}
                        onInputChange={(event, newValue) => {
                            setModule(prevHierarchy => ({ ...prevHierarchy, hierarchy: newValue }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Optional: Hierarchy"
                                variant="outlined"
                                name="hierarchy"
                            />
                        )}
                    />
                    <Autocomplete
                        freeSolo
                        options={typeSuggestions}
                        inputValue={module.type}
                        onInputChange={(event, newValue) => {
                            setModule(prevType => ({ ...prevType, type: newValue }));
                            const matchingSuggestions = typeSuggestions.filter(option => 
                                option.toLowerCase().includes(newValue.toLowerCase())
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Optional: Type"
                                variant="outlined"
                                name="type"
                            />
                        )}
                    />

                    <Autocomplete
                        freeSolo
                        options={positionSuggestions}
                        inputValue={module.position}
                        onInputChange={(event, newValue) => {
                            setModule(prevPosition => ({ ...prevPosition, position: newValue }));
                            const matchingSuggestions = positionSuggestions.filter(option => 
                                option.toLowerCase().includes(newValue.toLowerCase())
                            );
                            setShowOpenGuardField(newValue.toLowerCase() === "open guard");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Optional: Position"
                                variant="outlined"
                                name="position"
                            />
                        )}
                    />

                    {showOpenGuardField && (
                        <Autocomplete
                            options={openGuardSuggestions}
                            freeSolo
                            inputValue={module.openGuard}
                            onInputChange={(event, newValue) => {
                                setModule(prevOpenGuard => ({ ...prevOpenGuard, openGuard: newValue }));
                                const matchingSuggestions = openGuardSuggestions.filter(option => 
                                    option.toLowerCase().includes(newValue.toLowerCase())
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Optional: Open Guard"
                                    name="openGuard"
                                    variant="outlined"
                                />
                            )}
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

const transformModuleForBackend = (module: any): Module | null => {
    if (!Object.values(Gi).includes(module.gi)) {
      alert('Invalid Gi value');
      return null;
    }
  
    if (!Object.values(Hierarchy).includes(module.hierarchy)) {
      alert('Invalid Hierarchy value');
      return null;
    }

    return {
      ...module,
      gi: module.gi as Gi,
      hierarchy: module.hierarchy as Hierarchy,
    };
  }

const postModule = async (module: Module) => {
    try {
        const response = await fetch('http://localhost:3000/api/module', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(module),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Success:', responseData);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting technique: ${error}`);
        }
};

export default NewModule;
