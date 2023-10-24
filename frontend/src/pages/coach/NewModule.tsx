import React from 'react'
import MuiCard from "@mui/material/Card"
import MuiAccordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MuiTextField, { TextFieldProps} from '@mui/material/TextField'
import MuiButton from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import MuiTypography from '@mui/material/Typography'
import NavBar from '../../components/NavBar'
import { styled } from '@mui/material/styles'
import { Technique, Module, Gi, Hierarchy } from 'common'
import TechniquesList from '../../components/TechniqueList'
import TechniqueFilter, { useDetermineFilterOptions, useHandleFilterChange } from '../../components/TechniqueFilter'

const Accordion = styled(MuiAccordion)({
    '&.MuiAccordion-root' : {
    backgroundColor: `#3c3836`,
    }
});

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

const Typography = styled(MuiTypography)({
    '&.DashboardCard-heading': {
        padding: "10px",
    },
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
    const [moduleTitleSuggestions, setModuleTitleSuggestions] = React.useState<string[]>([]);
    
    // Generate options for the filters based on the full techniques list
    const options = useDetermineFilterOptions(techniques)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleFilterChange } = useHandleFilterChange(techniques)
    
    // Module field displays
    const [showOpenGuardField, setShowOpenGuardField] = React.useState(false)

    // Selected techniques
    const [selectedTechniques, setSelectedTechniques] = React.useState<string[]>([])

    const handleTechniqueCheck = (techniqueId: string) => {
        setSelectedTechniques(prevChecked => {
            if (prevChecked.includes(techniqueId)) {
                return prevChecked.filter(id => id !== techniqueId);
            } else {
                return [...prevChecked, techniqueId];
            }
        });
    };

    // New module input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setModule(prevTechnique => ({ ...prevTechnique, [name]: value }));
    };

    React.useEffect(() => {
        (async () => {
            try {
                const [moduleTitleResponse, techniqueResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/module/titles'),
                    fetch('http://192.168.0.156:3000/api/technique'),
                ]);

                interface TitleObject {
                    title: string
                }
                
                const techniques = (await techniqueResponse.json())
                const moduleTitles = (await moduleTitleResponse.json()).map((titleObj: TitleObject) => titleObj.title);
    
                setTechniques(techniques)
                setModuleTitleSuggestions(moduleTitles);

            } catch (error) {
                alert(`Error fetching data: ${error}`);
            }
        })();
    }, []);

    return (
        <div>
            <Card>
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="h6">Module Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>            
                        <form onSubmit={handleSubmit}>
                            <Autocomplete
                                options={moduleTitleSuggestions}
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
                                options={options.giOptions}
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
                                options={options.hierarchyOptions}
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
                                options={options.typeOptions}
                                inputValue={module.type}
                                onInputChange={(event, newValue) => {
                                    setModule(prevType => ({ ...prevType, type: newValue }));
                                    options.typeOptions.filter(option => 
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
                                options={options.positionOptions}
                                inputValue={module.position}
                                onInputChange={(event, newValue) => {
                                    setModule(prevPosition => ({ ...prevPosition, position: newValue }));
                                    options.positionOptions.filter(option => 
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
                                    options={options.openGuardOptions}
                                    freeSolo
                                    inputValue={module.openGuard}
                                    onInputChange={(event, newValue) => {
                                        setModule(prevOpenGuard => ({ ...prevOpenGuard, openGuard: newValue }));
                                        options.openGuardOptions.filter(option => 
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
                    </AccordionDetails>
                </Accordion>
                                    
                <TechniqueFilter 
                    onFiltersChange={handleFilterChange} 
                    options={options}/>

                <Accordion disableGutters defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="h6">Select Techniques</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TechniquesList 
                        filteredTechniques={filteredTechniques} 
                        checkbox
                        elevation={0} 
                        checkedTechniques={selectedTechniques}
                        onTechniqueCheck={handleTechniqueCheck}
                        />
                    </AccordionDetails>
                </Accordion>
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
            alert(`Error posting module: ${error}`);
        }
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

export default NewModule;
