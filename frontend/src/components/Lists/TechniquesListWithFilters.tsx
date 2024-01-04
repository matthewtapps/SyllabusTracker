import { Box, CardContent, CircularProgress, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Technique } from "common";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTechniquesIfOld } from "../../slices/techniques";
import { AppDispatch, RootState } from "../../store/store";
import TechniqueList from "./Base Lists/TechniqueList";
import TechniqueFilter, { useHandleTechniqueFilterChange } from "./List Filters/TechniqueFilter";


const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

interface TechniqueListWithFiltersProps {
    onTechniqueEditClick?: (technique: Technique) => void;
    editable: boolean,
    elevation: number,
}

TechniqueListWithFilters.defaultProps = {
    elevation: 3,
    editable: false,
}

export function TechniqueListWithFilters(props: TechniqueListWithFiltersProps): JSX.Element {
    const { techniques, techniquesLoading, checkingAge } = useSelector((state: RootState) => state.techniques);

    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange(techniques)

    return (
        <>
            <Card>
                <TechniqueFilter
                    onTechniqueFiltersChange={handleTechniqueFilterChange}
                />
            </Card>
            <Card>
                {(techniquesLoading || checkingAge) ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : filteredTechniques.length === 0 ? (
                    <CardContent>
                        <Typography>No techniques for current filters</Typography>
                    </CardContent>
                ) : (
                    <TechniqueList
                        filteredTechniques={filteredTechniques}
                        editable={props.editable}
                        onEditClick={props.onTechniqueEditClick}
                    />
                )}
            </Card>
        </>
    )
};
