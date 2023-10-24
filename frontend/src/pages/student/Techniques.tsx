import React from 'react'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'
import MuiListItemText, { ListItemTextProps} from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Technique } from 'common'
import { styled } from '@mui/material/styles'
import NavBar from '../../components/NavBar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import TechniquesList from '../../components/TechniqueList'


const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters {...props} />
))(({ theme }) => ({
    backgroundColor: `#3c3836`,
}))

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

function StudentTechniques(): JSX.Element {
    const navigate = useNavigate();
    const navigateToNewTechnique = () => { navigate('/newtechnique') }

    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No technique data available')
    const [techniquesList, setTechniquesList] = React.useState<Technique[]>([])
    const [hierarchyOptions] = React.useState<string[]>(['Top', 'Bottom']);
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [positionOptions, setPositionOptions] = React.useState<string[]>([]);
    const [openGuardOptions, setOpenGuardOptions] = React.useState<string[]>([]);
    const [giOptions] = React.useState<string[]>(['Yes Gi', 'No Gi']);
    const [filters, setFilters] = React.useState({
        title: '',
        hierarchy: null as null | string,
        type: null as null | string,
        position: null as null | string,
        openGuard: null as null | string,
        gi: null as null | string,
    });

    React.useEffect(() => {
        (async () => {
            try {
                const [techniqueResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/technique')
                ]);

                const techniques: Technique[] = await (techniqueResponse.json())
                setTechniquesList(techniques)

                const types: string[] = []
                const positions: string[] = []
                const openGuards: string[] = []

                techniques.forEach(technique => {
                    if (!types.includes(technique.type.title)) {
                        types.push(technique.type.title);
                    }
                    if (!positions.includes(technique.position.title)) {
                        positions.push(technique.position.title);
                    }
                    if (technique.openGuard && !openGuards.includes(technique.openGuard.title)) {
                        openGuards.push(technique.openGuard.title);
                    }
                });
                
                setTypeOptions(types)
                setPositionOptions(positions)
                setOpenGuardOptions(openGuards)
                setLoading(false)

            } catch (error) {
                setPlaceholderContent(`Error fetching data: ${error}`)
                setLoading(false)
            }
        })();
    }, []);

    const giFilterMatch = (filterValue: string, techniqueValue: string) => {
        return techniqueValue === 'Both' || techniqueValue.includes(filterValue);
    };

    const filteredTechniques = techniquesList.filter(technique => {
        return (!filters.title || technique.title.toLowerCase().includes(filters.title.toLowerCase())) &&
               (!filters.hierarchy || technique.hierarchy.includes(filters.hierarchy)) &&
               (!filters.type || technique.type.title.includes(filters.type)) &&
               (!filters.position || technique.position.title.includes(filters.position)) &&
               (!filters.openGuard || (technique.openGuard && technique.openGuard.title.includes(filters.openGuard))) &&
               (!filters.gi || giFilterMatch(filters.gi, technique.gi));
    });

    return (
        <div>
            <NavBar text="Techniques"/>
            <Card>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <TextField
                            label="Filter"
                            value={filters.title}
                            onChange={e => setFilters(prev => ({ ...prev, title: e.target.value }))}
                            onClick={e => e.stopPropagation()}
                            variant="outlined"
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Autocomplete
                            options={giOptions}
                            value={filters.gi}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, gi: newValue || null }))}
                            isOptionEqualToValue={(option, value) => option === value}
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
                            options={hierarchyOptions}
                            value={filters.hierarchy}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, hierarchy: newValue || null }))}
                            isOptionEqualToValue={(option, value) => option === value}
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
                            options={typeOptions}
                            value={filters.type}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, type: newValue || null }))}
                            isOptionEqualToValue={(option, value) => option === value}
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
                            options={positionOptions}
                            value={filters.position}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, position: newValue || null }))}
                            isOptionEqualToValue={(option, value) => option === value}
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
                        { openGuardOptions && (
                        <Autocomplete
                            options={openGuardOptions}
                            value={filters.openGuard}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, openGuard: newValue || null }))}
                            isOptionEqualToValue={(option, value) => option === value}
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
                <TechniquesList filteredTechniques={filteredTechniques}/>
            )}
            </Card>
            <Fab 
            color="primary" 
            aria-label="add" 
            style={{position: 'fixed', bottom: '16px', right: '16px'}}
            onClick={navigateToNewTechnique}
            >
                <AddIcon/>
            </Fab>
        </div>
        );};

export default StudentTechniques
