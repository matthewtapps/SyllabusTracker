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
import { styled } from '@mui/material/styles'
import { Technique, Collection, Gi, Hierarchy } from 'common'
import TechniquesList from '../../../components/TechniqueList'
import TechniqueFilter, { useDetermineFilterOptions, useHandleFilterChange } from '../../../components/TechniqueFilter'
import DragDropTechniquesList from '../../../components/DragDropTechniques'

const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    },
    '&:not(:last-child)': {
        borderBottom: '1px solid #7c6f64'
    }
});

const TextField = styled((props: TextFieldProps) => (
    <MuiTextField {...props} />
))(({ theme }) => ({
    backgroundColor: '#3c3836',
    marginTop: "10px"
}))

const Card = styled(MuiCard)({
        backgroundColor: "#3c3836",
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
});

const Button = styled(MuiButton)({
        marginTop: "10px"
})

const Typography = styled(MuiTypography)({
    '&.DashboardCard-heading': {
        padding: "10px",
    },
})

const NewCollection: React.FC = () => {
    
    const [collection, setCollection] = React.useState<{
        title: string,
        description: string,
        globalNotes: string,
        gi: undefined | string,
        type: undefined | string,
        position: undefined | string,
        openGuard: undefined | string,
        hierarchy: undefined | string,
    }>({
        title: '',
        description: '',
        globalNotes: '',
        gi: undefined,
        type: undefined,
        position: undefined,
        openGuard: undefined,
        hierarchy: undefined,
    })
    
    // Autocomplete suggestions
    const [techniques, setTechniques] = React.useState<Technique[]>([]);
    const [collectionTitleSuggestions, setCollectionTitleSuggestions] = React.useState<string[]>([]);
    
    // Generate options for the filters based on the full techniques list
    const options = useDetermineFilterOptions(techniques)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleFilterChange } = useHandleFilterChange(techniques)
    
    // Module field displays
    const [showOpenGuardField, setShowOpenGuardField] = React.useState(false)

    // Selected techniques with indexes
    const [selectedTechniques, setSelectedTechniques] = React.useState<{ index: number, technique: Technique }[]>([]);

    const handleTechniqueCheck = (techniqueId: string) => {
        setSelectedTechniques(prevSelectedTechniques => {
            const foundTechnique = prevSelectedTechniques.find(item => item.technique.techniqueId === techniqueId);
            if (foundTechnique) {
                return prevSelectedTechniques.filter(item => item.technique.techniqueId !== techniqueId);
            } else {
                const techniqueToAdd = techniques.find(technique => technique.techniqueId === techniqueId);
                if (techniqueToAdd) {
                    return [...prevSelectedTechniques, { index: prevSelectedTechniques.length, technique: techniqueToAdd }];
                } else {
                    return prevSelectedTechniques;
                }
            }
        });
    };

    // New collection input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCollection(prevTechnique => ({ ...prevTechnique, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const validCollection = transformCollectionForBackend(collection);
            
        if (!validCollection) {
            alert('Not a valid technique posted')
            return
        };

        const collectionStatus = await postCollection(validCollection);
        
        let collectionTechniquesStatus
        if (selectedTechniques) { collectionTechniquesStatus = await postCollectionTechniques(selectedTechniques) }

        



        };

    React.useEffect(() => {
        (async () => {
            try {
                const techniqueResponse = await fetch('http://192.168.0.156:3000/api/technique')
                const techniques = (await techniqueResponse.json())
                setTechniques(techniques)

            } catch (error) { alert(`Error fetching data: ${error}`);}
            
            try {

                interface TitleObject {
                    title: string
                }

                const collectionTitleResponse = await fetch('http://192.168.0.156:3000/api/collection/titles')                
                const collectionTitles = (await collectionTitleResponse.json()).map((titleObj: TitleObject) => titleObj.title);
                setCollectionTitleSuggestions(collectionTitles)

            } catch (error) {
                alert(`Error fetching data: ${error}`);
            }
        })();
    }, []);

    return (
        <Card>
            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Collection Details</Typography>
                </AccordionSummary>
                <AccordionDetails>            
                    <form onSubmit={handleSubmit}>
                        <Autocomplete
                            options={collectionTitleSuggestions}
                            freeSolo
                            inputValue={collection.title}
                            onInputChange={(event, newValue) => {
                                setCollection(prevTechnique => ({ ...prevTechnique, title: newValue }));
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
                                    label="Collection Title"
                                    variant="outlined"
                                />
                            )}
                        />

                        <TextField
                            fullWidth
                            label="Collection Description"
                            name="description"
                            value={collection.description}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Optional: Global Notes"
                            name="globalNotes"
                            value={collection.globalNotes}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <Autocomplete
                            options={options.giOptions}
                            inputValue={collection.gi}
                            onInputChange={(event, newValue) => {
                                setCollection(prevGi => ({ ...prevGi, gi: newValue }));
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
                            inputValue={collection.hierarchy}
                            onInputChange={(event, newValue) => {
                                setCollection(prevHierarchy => ({ ...prevHierarchy, hierarchy: newValue }));
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
                            inputValue={collection.type}
                            onInputChange={(event, newValue) => {
                                setCollection(prevType => ({ ...prevType, type: newValue }));
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
                            inputValue={collection.position}
                            onInputChange={(event, newValue) => {
                                setCollection(prevPosition => ({ ...prevPosition, position: newValue }));
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
                                inputValue={collection.openGuard}
                                onInputChange={(event, newValue) => {
                                    setCollection(prevOpenGuard => ({ ...prevOpenGuard, openGuard: newValue }));
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

            <Accordion disableGutters sx={{borderTop: '1px solid #7c6f64'}}>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Order Techniques</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DragDropTechniquesList selectedTechniques={selectedTechniques} onReorder={(newOrder) => setSelectedTechniques(newOrder)}/>
                </AccordionDetails>
            </Accordion>

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
    );
};

const transformCollectionForBackend = (collection: any): Collection | null => {
    if (collection.gi && !Object.values(Gi).includes(collection.gi)) {
      alert('Invalid Gi value');
      return null;
    }
  
    if (collection.hierarchy && !Object.values(Hierarchy).includes(collection.hierarchy)) {
      alert('Invalid Hierarchy value');
      return null;
    }

    return {
      ...collection,
      gi: collection.gi as Gi,
      hierarchy: collection.hierarchy as Hierarchy,
    };
  }

const postCollection = async (collection: Collection) => {
    try {
        const response = await fetch('http://localhost:3000/api/newCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        return response.status
        console.log('Success:', responseData);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting collection: ${error}`);
            return error
        }
};

const postCollectionTechniques = async (collectionTechniques: { index: number, technique: Technique }[]) => {
    try {
        const response = await fetch('http://localhost:3000/api/addToCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collectionTechniques),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Success:', responseData);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting collection: ${error}`);
        }
};

export default NewCollection;
