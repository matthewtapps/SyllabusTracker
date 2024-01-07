import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, CardContent, Checkbox, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Collection } from 'common';
import React from 'react';
import { useGetCollectionSuggestionsQuery, useGetCollectionsQuery } from '../../../services/syllabusTrackerApi';
import Pageloader from '../../Base/PageLoader';


const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

interface CollectionFilterProps {
    onCollectionFiltersChange: (filters: CollectionFilters) => void;
    onAssignedFilterCheck?: () => void;
    showAssignedCollections: boolean;
}

export interface CollectionFilters {
    title: string;
    hierarchy: string | null;
    type: string | null;
    position: string | null;
    openGuard: string | null;
    gi: string | null;
}

export const useHandleCollectionFilterChange = () => {
    const { data: collectionsList, isSuccess } = useGetCollectionsQuery()
    const [filteredCollections, setFilteredCollections] = React.useState<Collection[]>([]);
    const [currentFilters, setCurrentFilters] = React.useState<CollectionFilters>({
        title: '',
        hierarchy: null,
        type: null,
        position: null,
        openGuard: null,
        gi: null,
    });

    const giFilterMatch = (filterValue: string, collectionValue: string) => {
        return collectionValue === 'Both' || collectionValue.includes(filterValue);
    };

    React.useEffect(() => {
        if (isSuccess) {
            const filterCollections = (filters: CollectionFilters) => {
                return collectionsList.filter(collection => {
                    return (!filters.title || collection.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                        (!filters.hierarchy || (collection.hierarchy && collection.hierarchy.includes(filters.hierarchy))) &&
                        (!filters.type || (collection.type && collection.type.title.includes(filters.type))) &&
                        (!filters.position || (collection.position && collection.position.title.includes(filters.position))) &&
                        (!filters.openGuard || (collection.openGuard && collection.openGuard.title.includes(filters.openGuard))) &&
                        (!filters.gi || (collection.gi && giFilterMatch(filters.gi, collection.gi)));
                });
            };

            setFilteredCollections(filterCollections(currentFilters));
        }
    }, [collectionsList, currentFilters, isSuccess]);

    const handleCollectionFilterChange = (newFilters: CollectionFilters) => {
        setCurrentFilters(newFilters);
    };

    return { filteredCollections, handleCollectionFilterChange };
};

CollectionFilter.defaultProps = {
    showAssignedCollections: false,
}

function CollectionFilter(props: CollectionFilterProps): JSX.Element {
    const { data: collectionSuggestions, isLoading, isSuccess } = useGetCollectionSuggestionsQuery()
    const [filters, setFilters] = React.useState<CollectionFilters>({
        title: '',
        hierarchy: null as null | string,
        type: null as null | string,
        position: null as null | string,
        openGuard: null as null | string,
        gi: null as null | string,
    });

    const onFiltersChange = props.onCollectionFiltersChange

    React.useEffect(() => {
        onFiltersChange(filters);
    }, [onFiltersChange, filters]);


    return (
        <>
            {isLoading ? <CardContent><Pageloader /></CardContent>
                : isSuccess &&
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box display="flex" flexDirection="column">
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "95%" }}
                                label="Filter Collections"
                                value={filters.title}
                                onChange={e => {
                                    const newFilters = { ...filters, title: e.target.value };
                                    setFilters(newFilters);
                                    onFiltersChange(newFilters);
                                }}
                                onClick={e => e.stopPropagation()}
                                variant="outlined"
                                size="small"
                            />
                            {props.onAssignedFilterCheck && (
                                <Box display="flex" flexDirection="row" alignItems="center" justifyItems="flex-start">
                                    <Checkbox checked={props.showAssignedCollections} onClick={event => { event.stopPropagation(); props.onAssignedFilterCheck?.() }} />
                                    <Typography variant="body1">Show Assigned Only</Typography>
                                </Box>
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
                                    onFiltersChange(newFilters);
                                }}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {collectionSuggestions.gi.map(option => (
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
                                    onFiltersChange(newFilters);
                                }}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {collectionSuggestions.hierarchy.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            options={collectionSuggestions.type}
                            value={filters.type}
                            onInputChange={(event, newValue) => {
                                const newFilters = { ...filters, type: newValue || null };
                                setFilters(newFilters);
                                onFiltersChange(newFilters);
                            }}
                            isOptionEqualToValue={(option, value) => option === value}
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
                            options={collectionSuggestions.position}
                            value={filters.position}
                            onInputChange={(event, newValue) => {
                                const newFilters = { ...filters, position: newValue || null };
                                setFilters(newFilters);
                                onFiltersChange(newFilters);
                            }}
                            isOptionEqualToValue={(option, value) => option === value}
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
                        {collectionSuggestions.openguard && (
                            <Autocomplete
                                options={collectionSuggestions.openguard}
                                value={filters.openGuard}
                                onInputChange={(event, newValue) => {
                                    const newFilters = { ...filters, openGuard: newValue || null };
                                    setFilters(newFilters);
                                    onFiltersChange(newFilters);
                                }}
                                isOptionEqualToValue={(option, value) => option === value}
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
            }
        </>
    );
}

export default CollectionFilter;
