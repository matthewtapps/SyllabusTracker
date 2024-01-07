import { CardContent, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Technique } from "common";
import { useGetTechniquesQuery } from "../../services/syllabusTrackerApi";
import Pageloader from "../Base/PageLoader";
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
    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange()

    const { isLoading, isSuccess, error } = useGetTechniquesQuery()

    return (
        <>
            <Card>
                <TechniqueFilter
                    onTechniqueFiltersChange={handleTechniqueFilterChange}
                />
            </Card>
            <Card>
                {isLoading ? <Pageloader />
                    : isSuccess ?
                        <TechniqueList
                            filteredTechniques={filteredTechniques}
                            editable={props.editable}
                            onEditClick={props.onTechniqueEditClick}
                        />
                        :
                        <CardContent>
                            <Typography>{`Failed to fetch techniques: ${error}`}</Typography>
                        </CardContent>
                }
            </Card>
        </>
    )
};
