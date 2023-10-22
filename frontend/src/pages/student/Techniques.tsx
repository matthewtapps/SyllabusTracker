import React from 'react'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'
import MuiListItemText, { ListItemTextProps} from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import { Card } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Technique } from 'common'
import { styled } from '@mui/material/styles'
import NavBar from '../../components/NavBar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'


interface FrontendTechnique extends Technique {
    _type: { title: string; description: string; };
    _position: { title: string; description: string; };
    _openGuard: { title: string; description: string; } | null;
  }

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: `#3c3836`,
    color: `#fbf1c7`,
    '&:last-child': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.secondary}`,
    backgroundColor: `#3c3836`,
    color: `#fbf1c7`
}))

const AccordionDetails = styled((props: AccordionDetailsProps) => (
    <MuiAccordionDetails {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.secondary}`,
    backgroundColor: `#282828`,
    color: `#fbf1c7`
}))

const ListItem = styled((props: ListItemProps) => (
    <MuiListItem {...props} />
))(({ theme }) => ({
    margin: '0px',
    padding: '0px'
}))

const ListItemText = styled((props: ListItemTextProps) => (
    <MuiListItemText primaryTypographyProps={{variant: 'h6'}} secondaryTypographyProps={{variant: 'body1'}}{...props} />
))(({ theme }) => ({
    '& .MuiListItemText-primary': {
        color: `#fbf1c7`,
        
    },
    '& .MuiListItemText-secondary': {
        color: `#fbf1c7`,
    },
}))

function StudentTechniques(): JSX.Element {
    const [loading, setLoading] = React.useState(true);
    const [techniquesList, setTechniquesList] = React.useState<FrontendTechnique[]>([])
    const [hierarchyOptions] = React.useState<string[]>(['Top', 'Bottom']);
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [positionOptions, setPositionOptions] = React.useState<string[]>([]);
    const [openGuardOptions, setOpenGuardOptions] = React.useState<string[]>([]);
    const [giOptions] = React.useState<string[]>(['Yes Gi', 'No Gi']);
    const [filters, setFilters] = React.useState({
        title: '',
        hierarchy: '',
        type: '',
        position: '',
        openGuard: '',
        gi: ''
    });

    React.useEffect(() => {
        (async () => {
            try {
                const [techniqueResponse] = await Promise.all([
                    fetch('http://localhost:3000/api/technique')
                ]);

                const techniques: FrontendTechnique[] = await (techniqueResponse.json())
                setTechniquesList(techniques)

                const types: string[] = []
                const positions: string[] = []
                const openGuards: string[] = []

                techniques.forEach(technique => {
                    if (!types.includes(technique._type.title)) {
                        types.push(technique._type.title);
                    }
                    if (!positions.includes(technique._position.title)) {
                        positions.push(technique._position.title);
                    }
                    if (technique._openGuard && !openGuards.includes(technique._openGuard.title)) {
                        openGuards.push(technique._openGuard.title);
                    }
                });
                
                setTypeOptions(types)
                setPositionOptions(positions)
                setOpenGuardOptions(openGuards)
                setLoading(false)

            } catch (error) {
                alert(`Error fetching data: ${error}`);
                setLoading(false)
            }
        })();
    }, []);

    const giFilterMatch = (filterValue: string, techniqueValue: string) => {
        return techniqueValue === 'Both' || techniqueValue.includes(filterValue);
    };

    const filteredTechniques = techniquesList.filter(technique => {
        return (!filters.title.toLowerCase() || technique.title.includes(filters.title.toLowerCase())) &&
               (!filters.hierarchy || technique.hierarchy.includes(filters.hierarchy)) &&
               (!filters.type || technique._type.title.includes(filters.type)) &&
               (!filters.position || technique._position.title.includes(filters.position)) &&
               (!filters.openGuard || (technique._openGuard && technique._openGuard.title.includes(filters.openGuard))) &&
               (!filters.gi || giFilterMatch(filters.gi, technique.gi));
    });

    return (
        <div>
            <NavBar text="All Techniques"/>
            <Card sx={{
                backgroundColor: "#3c3836",
                color: "#fbf1c7",
                margin: 2,
                border: 1,
                borderRadius: 2,
                boxShadow: 3
            }}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: "#fbf1c7"}}/>}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={filters.title}
                            onChange={e => setFilters(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Autocomplete
                            freeSolo={false}
                            options={giOptions}
                            value={filters.gi}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, gi: newValue }))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Yes Gi or No Gi"
                                    variant="outlined"
                                />
                            )}
                        />
                        <Autocomplete
                            freeSolo={false}
                            options={hierarchyOptions}
                            value={filters.hierarchy}
                            onInputChange={(event, newValue) => setFilters(prev => ({ ...prev, hierarchy: newValue }))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Hierarchy"
                                    variant="outlined"
                                    sx={{marginTop: "10px"}}
                                />
                            )}
                        />
                        <Autocomplete
                            freeSolo={false}
                            options={typeOptions}
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
                            freeSolo={false}
                            options={positionOptions}
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
                        { openGuardOptions && (
                        <Autocomplete
                            freeSolo={false}
                            options={openGuardOptions}
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
            </Card>
            <Card sx={{
                backgroundColor: "#3c3836",
                color: "#fbf1c7",
                margin: 2,
                border: 1,
                borderRadius: 2,
                boxShadow: 3
            }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : (
                filteredTechniques.map(technique => (
                    <React.Fragment key={technique.techniqueId}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{color: "#fbf1c7"}}/>}
                                aria-controls="panel1a-content"
                            >
                                <Typography variant="h5">{technique.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ListItem>
                                    <ListItemText primary="Description" secondary={technique.description} />
                                </ListItem>

                                <ListItem>
                                    <ListItemText primary="Position" secondary={technique._position.title} />
                                </ListItem>

                                <ListItem>
                                    <ListItemText secondary={technique._position.description} />
                                </ListItem>

                                <ListItem>
                                    <ListItemText primary="Hierarchy" secondary={technique.hierarchy} />
                                </ListItem>

                                <ListItem>
                                    <ListItemText primary="Type" secondary={technique._type.title} />
                                </ListItem>

                                <ListItem>
                                    <ListItemText secondary={technique._type.description} />
                                </ListItem>

                                {technique._openGuard && (
                                    <div>
                                        <ListItem>
                                            <ListItemText primary="Open Guard" secondary={technique._openGuard.title} />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText secondary={technique._openGuard.description} />
                                        </ListItem>
                                    </div>
                                )}

                                <ListItem>
                                    <ListItemText primary="Gi or No Gi" secondary={technique.gi} />
                                </ListItem>
                                
                                {technique.globalNotes && (
                                    <ListItem>
                                        <ListItemText primary="Global Notes" secondary={technique.globalNotes} />
                                    </ListItem>
                                )}

                            </AccordionDetails>
                        </Accordion>
                    </React.Fragment>
                )))
            }
            </Card>
        </div>
        );};

export default StudentTechniques
