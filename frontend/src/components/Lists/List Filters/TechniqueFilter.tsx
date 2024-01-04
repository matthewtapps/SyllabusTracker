import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Technique } from 'common';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';


const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

interface TechniqueFilterProps {
    onTechniqueFiltersChange: (filters: TechniqueFilters) => void;
    matchTechniqueFilters?: {
        title: string,
        hierarchy: string | null,
        type: string | null,
        position: string | null,
        openGuard: string | null,
        gi: string | null;
    } | null;
    showAssignedTechniques: boolean;
    onAssignedFiltersCheck?: () => void;
}

export interface TechniqueFilters {
    title: string;
    hierarchy: string | null;
    type: string | null;
    position: string | null;
    openGuard: string | null;
    gi: string | null;
}

TechniqueFilter.defaultProps = {
    showAssignedTechniques: false
}

export const useHandleTechniqueFilterChange = (techniquesList: Technique[]) => {
    const [filteredTechniques, setFilteredTechniques] = React.useState<Technique[]>([]);
    const [currentFilters, setCurrentFilters] = React.useState<TechniqueFilters>({
        title: '',
        hierarchy: null,
        type: null,
        position: null,
        openGuard: null,
        gi: null,
    });

    const giFilterMatch = (filterValue: string, techniqueValue: string) => {
        return techniqueValue === 'Both' || techniqueValue.includes(filterValue);
    };

    React.useEffect(() => {
        const filterTechniques = (filters: TechniqueFilters) => {
            return techniquesList.filter(technique => {
                return (!filters.title || technique.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                    (!filters.hierarchy || technique.hierarchy.includes(filters.hierarchy)) &&
                    (!filters.type || technique.type.title.includes(filters.type)) &&
                    (!filters.position || technique.position.title.includes(filters.position)) &&
                    (!filters.openGuard || (technique.openGuard && technique.openGuard.title.includes(filters.openGuard))) &&
                    (!filters.gi || giFilterMatch(filters.gi, technique.gi));
            });
        };

        setFilteredTechniques(filterTechniques(currentFilters));
    }, [techniquesList, currentFilters]);

    const handleTechniqueFilterChange = (newFilters: TechniqueFilters) => {
        setCurrentFilters(newFilters);
    };

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

    const { techniqueSuggestions } = useSelector((state: RootState) => state.suggestions);

    return (
        <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" flexDirection="column">
                    {props.onAssignedFiltersCheck && (
                        <Box display="flex" flexDirection="row" alignItems="center" justifyItems="flex-start">
                            <Checkbox checked={props.showAssignedTechniques} onClick={event => { event.stopPropagation(); props.onAssignedFiltersCheck?.() }} />
                            <Typography variant="body1">Show Assigned Only</Typography>
                        </Box>
                    )}
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
                        <Button variant="contained" fullWidth size="small" sx={{ marginTop: "5px" }} onClick={e => { e.stopPropagation(); handleMatchFiltersClick() }}>Match Collection Filters</Button>
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
                        {techniqueSuggestions.giOptions.map(option => (
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
                        {techniqueSuggestions.hierarchyOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Autocomplete
                    options={techniqueSuggestions.typeOptions}
                    value={filters.type}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, type: newValue || null };
                        setFilters(newFilters);
                        props.onTechniqueFiltersChange(newFilters);
                    }} isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Type"
                            variant="outlined"
                            sx={{ marginTop: "10px" }}
                            size="small"
                        />
                    )}
                />
                <Autocomplete
                    options={techniqueSuggestions.positionOptions}
                    value={filters.position}
                    onInputChange={(event, newValue) => {
                        const newFilters = { ...filters, position: newValue || null };
                        setFilters(newFilters);
                        props.onTechniqueFiltersChange(newFilters);
                    }} isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Position"
                            variant="outlined"
                            sx={{ marginTop: "10px" }}
                            size="small"
                        />
                    )}
                />
                {techniqueSuggestions.openGuardOptions && (
                    <Autocomplete
                        options={techniqueSuggestions.openGuardOptions}
                        value={filters.openGuard}
                        onInputChange={(event, newValue) => {
                            const newFilters = { ...filters, openGuard: newValue || null };
                            setFilters(newFilters);
                            props.onTechniqueFiltersChange(newFilters);
                        }} isOptionEqualToValue={(option, value) => option === value}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Open Guard"
                                variant="outlined"
                                sx={{ marginTop: "10px" }}
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
