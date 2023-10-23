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
import ListItem from '@mui/material/ListItem'
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import TechniquesList from '../../components/TechniqueList'

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

const ListItemText = styled((props: ListItemTextProps) => (
    <MuiListItemText primaryTypographyProps={{variant: 'body1'}} secondaryTypographyProps={{variant: 'body2'}}{...props} />
))(({ theme }) => ({}))

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
    const [techniqueTitleSuggestions, setTechniqueTitleSuggestions] = React.useState<string[]>([]);
    const [giSuggestions, setGiSuggestions] = React.useState<string[]>([]);
    const [typeSuggestions, setTypeSuggestions] = React.useState<string[]>([]);
    const [positionSuggestions, setPositionSuggestions] = React.useState<string[]>([]);
    const [openGuardSuggestions, setOpenGuardSuggestions] = React.useState<string[]>([]);
    const [hierarchySuggestions, setHierarchySuggestions] = React.useState<string[]>([]);
    const [filters, setFilters] = React.useState({
        title: '',
        hierarchy: '',
        type: '',
        position: '',
        openGuard: '',
        gi: ''
    });

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
                const [moduleTitleResponse, techniqueResponse, typeResponse, positionResponse, openGuardResponse, techniqueTitleResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/module/titles'),
                    fetch('http://192.168.0.156:3000/api/technique'),
                    fetch('http://192.168.0.156:3000/api/technique/types'),
                    fetch('http://192.168.0.156:3000/api/technique/positions'),
                    fetch('http://192.168.0.156:3000/api/technique/openGuards'),
                    fetch('http://192.168.0.156:3000/api/technique/titles')
                ]);

                interface TitleObject {
                    title: string
                }
                
                const techniques = (await techniqueResponse.json())
                const types = (await typeResponse.json()).map((typeObj: TitleObject) => typeObj.title);
                const moduleTitles = (await moduleTitleResponse.json()).map((titleObj: TitleObject) => titleObj.title);
                const positions = (await positionResponse.json()).map((positionObj: TitleObject) => positionObj.title);
                const openGuards = (await openGuardResponse.json()).map((openGuardObj: TitleObject) => openGuardObj.title);
                const techniqueTitles = (await techniqueTitleResponse.json()).map((titleObj: TitleObject) => titleObj.title);
    
                setTechniques(techniques)
                setTypeSuggestions(types);
                setModuleTitleSuggestions(moduleTitles);
                setTechniqueTitleSuggestions(techniqueTitles);
                setPositionSuggestions(positions);
                setOpenGuardSuggestions(openGuards);
                setGiSuggestions(['Yes Gi', 'No Gi', 'Both']);
                setHierarchySuggestions(['Top', 'Bottom']);

            } catch (error) {
                alert(`Error fetching data: ${error}`);
            }
        })();
    }, []);

    const giFilterMatch = (filterValue: string, techniqueValue: string) => {
        return techniqueValue === 'Both' || techniqueValue.includes(filterValue);
    };

    const filteredTechniques = techniques.filter(technique => {
        return (!filters.title || technique.title.toLowerCase().includes(filters.title.toLowerCase())) &&
               (!filters.hierarchy || technique.hierarchy.includes(filters.hierarchy)) &&
               (!filters.type || technique.type.title.includes(filters.type)) &&
               (!filters.position || technique.position.title.includes(filters.position)) &&
               (!filters.openGuard || (technique.openGuard && technique.openGuard.title.includes(filters.openGuard))) &&
               (!filters.gi || giFilterMatch(filters.gi, technique.gi));
    });

    return (
        <div>
        <NavBar text="New Module"/>
        <Card>
            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Details</Typography>
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
                            options={typeSuggestions}
                            inputValue={module.type}
                            onInputChange={(event, newValue) => {
                                setModule(prevType => ({ ...prevType, type: newValue }));
                                typeSuggestions.filter(option => 
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
                            options={positionSuggestions}
                            inputValue={module.position}
                            onInputChange={(event, newValue) => {
                                setModule(prevPosition => ({ ...prevPosition, position: newValue }));
                                positionSuggestions.filter(option => 
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
                                    openGuardSuggestions.filter(option => 
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
            <Accordion disableGutters={true}>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <TextField
                        label="Filter Techniques"
                        value={filters.title}
                        onChange={e => setFilters(prev => ({ ...prev, title: e.target.value }))}
                        onClick={e => e.stopPropagation()}
                        variant="outlined"
                        sx={{marginTop: "0px"}}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Autocomplete
                        options={giSuggestions}
                        value={filters.gi}
                        onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, gi: newValue }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Yes Gi or No Gi"
                                sx={{marginRight: "10px"}}
                            />
                        )}
                    />
                    <Autocomplete
                        options={hierarchySuggestions}
                        value={filters.hierarchy}
                        onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, hierarchy: newValue }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Hierarchy"
                                sx={{marginTop: "10px"}}
                            />
                        )}
                    />
                    <Autocomplete
                        options={typeSuggestions}
                        value={filters.type}
                        onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, type: newValue }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Type"
                                variant="outlined"
                                sx={{marginTop: "10px"}}
                            />
                        )}
                    />
                    <Autocomplete
                        options={positionSuggestions}
                        value={filters.position}
                        onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, position: newValue }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Position"
                                variant="outlined"
                                sx={{marginTop: "10px"}}
                            />
                        )}
                    />
                    { openGuardSuggestions && (
                    <Autocomplete
                        options={openGuardSuggestions}
                        value={filters.openGuard}
                        onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, openGuard: newValue }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Open Guard"
                                variant="outlined"
                                sx={{marginTop: "10px"}}
                            />
                        )}
                    />
                    )}
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Select Techniques</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TechniquesList filteredTechniques={filteredTechniques} checkbox/>
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

export default NewModule;
