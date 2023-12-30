import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Technique } from 'common';
import { FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';



const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

interface TechniqueFilterProps {
    onTechniqueFiltersChange: (filters: TechniqueFilters) => void;
    options: {
        giOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        positionOptions: string[],
        openGuardOptions: string[]
    };
    matchTechniqueFilters?: {
        title: string,
        hierarchy: string | null,
        type: string | null,
        position: string | null,
        openGuard: string | null,
        gi: string | null;
    } | null
}

export interface TechniqueFilters {
    title: string;
    hierarchy: string | null;
    type: string | null;
    position: string | null;
    openGuard: string | null;
    gi: string | null;
}

export const useDetermineTechniqueFilterOptions = (techniques: Technique[]) => {
    // Autocomplete options for filters
    const [hierarchyOptions] = React.useState<string[]>(['Top', 'Bottom']);
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [positionOptions, setPositionOptions] = React.useState<string[]>([]);
    const [openGuardOptions, setOpenGuardOptions] = React.useState<string[]>([]);
    const [giOptions] = React.useState<string[]>(['Yes Gi', 'No Gi', 'Both']);

    // Object of the above to pass to filter component
    const options = {
        giOptions: giOptions,
        hierarchyOptions: hierarchyOptions,
        typeOptions: typeOptions,
        positionOptions: positionOptions,
        openGuardOptions: openGuardOptions
    }

    React.useEffect(() => {
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
    }, [techniques]);

    return options
}

export const useHandleTechniqueFilterChange = (techniquesList: Technique[]) => {
    const [filteredTechniques, setFilteredTechniques] = React.useState<Technique[]>([]);

    const handleTechniqueFilterChange = React.useCallback((newFilters: TechniqueFilters) => {
        const giFilterMatch = (filterValue: string, techniqueValue: string) => {
            return techniqueValue === 'Both' || techniqueValue.includes(filterValue);
        };
        const updatedFilteredTechniques = techniquesList.filter(technique => {
            return (!newFilters.title || technique.title.toLowerCase().includes(newFilters.title.toLowerCase())) &&
                   (!newFilters.hierarchy || technique.hierarchy.includes(newFilters.hierarchy)) &&
                   (!newFilters.type || technique.type.title.includes(newFilters.type)) &&
                   (!newFilters.position || technique.position.title.includes(newFilters.position)) &&
                   (!newFilters.openGuard || (technique.openGuard && technique.openGuard.title.includes(newFilters.openGuard))) &&
                   (!newFilters.gi || giFilterMatch(newFilters.gi, technique.gi));
        });
    
        setFilteredTechniques(updatedFilteredTechniques);

    },[techniquesList]);

    return { filteredTechniques, handleTechniqueFilterChange };
}

function TechniqueFilter(props: TechniqueFilterProps): JSX.Element {
    const [filters, setFilters] = React.useState<TechniqueFilters>({
        title: '',
        hierarchy: null as null | string,
        type: null as null | string,
        position: null as null | string,
        openGuard: null as null | string,
        gi: null as null | string,
    });

    let onTechniqueFiltersChange = props.onTechniqueFiltersChange

    const handleMatchFiltersClick = () => {
        props.matchTechniqueFilters && setFilters(props.matchTechniqueFilters)
    }

    React.useEffect(() => {
        onTechniqueFiltersChange(filters);
    }, [onTechniqueFiltersChange, filters]);

    return (
        <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Box display="flex" flexDirection="column" maxWidth="95%">
                <TextField
                    fullWidth
                    label="Filter Techniques"
                    value={filters.title}
                    onChange={e => {
                        const newFilters = { ...filters, title: e.target.value };
                        setFilters(newFilters);
                        props.onTechniqueFiltersChange(newFilters);
                    }}
                    onClick={e => e.stopPropagation()}
                    variant="outlined"
                    size="small"
                />
                {props.matchTechniqueFilters && (
                    <Button variant="contained" fullWidth size="small" sx={{marginTop: "5px"}} onClick={handleMatchFiltersClick}>Match to Collection Filters</Button>
                )}
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                
                <FormControl fullWidth size="small" sx={{ marginTop: "10px" }}>
                    <InputLabel id="gi-select-label">Yes Gi or No Gi</InputLabel>
                    <Select
                        labelId="gi-select-label"
                        id="gi-select"
                        value={filters.gi || ''}
                        label="Yes Gi or No Gi"
                        onChange={(e) => {
                            const newFilters = { ...filters, gi: e.target.value || null };
                            setFilters(newFilters);
                            props.onTechniqueFiltersChange(newFilters);
                        }}
                    >
                    <MenuItem value=""><em>None</em></MenuItem>
                        {props.options.giOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={{ marginTop: "10px" }}>
                    <InputLabel id="hierarchy-select-label">Hierarchy</InputLabel>
                    <Select
                        labelId="hierarchy-select-label"
                        id="hierarchy-select"
                        value={filters.hierarchy || ''}
                        label="Hierarchy"
                        onChange={(e) => {
                            const newFilters = { ...filters, hierarchy: e.target.value || null };
                            setFilters(newFilters);
                            props.onTechniqueFiltersChange(newFilters);
                        }}
                    >
                    <MenuItem value=""><em>None</em></MenuItem>
                        {props.options.hierarchyOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Autocomplete
                    options={props.options.typeOptions}
                    value={filters.type}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, type: newValue || null };
                        setFilters(newFilters);
                        props.onTechniqueFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Type"
                            variant="outlined"
                            sx={{marginTop: "10px"}}
                            size="small"
                        />
                    )}
                />
                <Autocomplete
                    options={props.options.positionOptions}
                    value={filters.position}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, position: newValue || null };
                        setFilters(newFilters);
                        props.onTechniqueFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Position"
                            variant="outlined"
                            sx={{marginTop: "10px"}}
                            size="small"
                        />
                    )}
                />
                { props.options.openGuardOptions && (
                <Autocomplete
                    options={props.options.openGuardOptions}
                    value={filters.openGuard}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, openGuard: newValue || null };
                        setFilters(newFilters);
                        props.onTechniqueFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Open Guard"
                            variant="outlined"
                            sx={{marginTop: "10px"}}
                            size="small"
                        />
                    )}
                />
                )}
            </AccordionDetails>
        </Accordion>
    );
}

export default TechniqueFilter;
