import { useAuth0 } from "@auth0/auth0-react";
import { Box, CardContent, CircularProgress, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Technique } from "common";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "../../slices/auth";
import { fetchTechniquesAsync } from "../../slices/techniques";
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
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const [placeholderContent, setPlaceholderContent] = React.useState('')

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

    const { techniques, loading } = useSelector((state: RootState) => state.techniques);
    const { techniqueSuggestions } = useSelector((state: RootState) => state.suggestions);

    React.useEffect(() => {
        if (techniques.length === 0 && !loading) {
            dispatch(fetchTechniquesAsync());
        }
    }, [dispatch, techniques.length, loading]);

    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange(techniques)

    const [expandedTechniqueId, setExpandedTechniqueId] = React.useState("");

    const handleAccordionChange = (techniqueId: string) => {
        setExpandedTechniqueId(prevExpandedTechniqueId =>
            prevExpandedTechniqueId === techniqueId ? "" : techniqueId
        );
    }

    return (
        <>
            <Card>
                <TechniqueFilter
                    onTechniqueFiltersChange={handleTechniqueFilterChange}
                    options={techniqueSuggestions} />
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
                    <Box>
                        <TechniqueList
                        filteredTechniques={filteredTechniques}
                        expandedTechniqueId={expandedTechniqueId}
                        onAccordionChange={handleAccordionChange}
                        editable={props.editable}
                        onEditClick={props.onTechniqueEditClick}
                        />
                    </Box>
                )}
            </Card>
        </>
    )
};
