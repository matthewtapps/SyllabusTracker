import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Technique } from 'common';


const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

interface TechniqueFilterProps {
    onFiltersChange: (filters: TechniqueFilters) => void;
    options: {
        giOptions: string[],
        hierarchyOptions: string[],
        typeOptions: string[],
        positionOptions: string[],
        openGuardOptions: string[]
    };
}

export interface TechniqueFilters {
    title: string;
    hierarchy: string | null;
    type: string | null;
    position: string | null;
    openGuard: string | null;
    gi: string | null;
}

export const useDetermineFilterOptions = (techniques: Technique[]) => {
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

export const useHandleFilterChange = (techniquesList: Technique[]) => {
    const [filteredTechniques, setFilteredTechniques] = React.useState<Technique[]>([]);

    const handleFilterChange = React.useCallback((newFilters: TechniqueFilters) => {
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

    return { filteredTechniques, handleFilterChange };
}

function TechniqueFilter({ onFiltersChange, options }: TechniqueFilterProps): JSX.Element {
    const [filters, setFilters] = React.useState<TechniqueFilters>({
        title: '',
        hierarchy: null as null | string,
        type: null as null | string,
        position: null as null | string,
        openGuard: null as null | string,
        gi: null as null | string,
    });

    React.useEffect(() => {
        onFiltersChange(filters);
    }, [onFiltersChange, filters]);

    return (
        <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <TextField
                    label="Filter Techniques"
                    value={filters.title}
                    onChange={e => {
                        const newFilters = { ...filters, title: e.target.value };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                    }}
                    onClick={e => e.stopPropagation()}
                    variant="outlined"
                />
            </AccordionSummary>
            <AccordionDetails>
                <Autocomplete
                    options={options.giOptions}
                    value={filters.gi}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, gi: newValue || null };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                    }}                    isOptionEqualToValue={(option, value) => option === value}
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
                    options={options.hierarchyOptions}
                    value={filters.hierarchy}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, hierarchy: newValue || null };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
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
                    options={options.typeOptions}
                    value={filters.type}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, type: newValue || null };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
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
                    options={options.positionOptions}
                    value={filters.position}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, position: newValue || null };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
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
                { options.openGuardOptions && (
                <Autocomplete
                    options={options.openGuardOptions}
                    value={filters.openGuard}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, openGuard: newValue || null };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                    }}                          isOptionEqualToValue={(option, value) => option === value}
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
    );
}

export default TechniqueFilter;
