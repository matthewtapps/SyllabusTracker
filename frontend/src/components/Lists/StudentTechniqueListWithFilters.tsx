import { useAuth0 } from "@auth0/auth0-react";
import { Box, CardContent, CircularProgress, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Technique, TechniqueStatus } from "common";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "../../slices/auth";
import { fetchTechniquesAsync } from "../../slices/techniques";
import { AppDispatch, RootState } from "../../store/store";
import StudentTechniqueList from "./Base Lists/StudentTechniqueList";
import TechniqueFilter, { useHandleTechniqueFilterChange } from "./List Filters/TechniqueFilter";
import Pageloader from "../Base/PageLoader";
import { fetchTechniqueSuggestionsAsync } from "../../slices/suggestions";
import { fetchStudentTechniquesAsync } from "../../slices/student";


const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

interface StudentTechniqueListWithFiltersProps {
    editable: boolean,
    elevation: number,
}

StudentTechniqueListWithFilters.defaultProps = {
    elevation: 3,
    editable: false,
}

export function StudentTechniqueListWithFilters(props: StudentTechniqueListWithFiltersProps): JSX.Element {
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

    const { techniques, techniquesLoading: loading } = useSelector((state: RootState) => state.techniques);
    const { techniqueSuggestions } = useSelector((state: RootState) => state.suggestions);
    const { selectedStudentTechniques } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (techniques.length === 0 && !loading) {
            dispatch(fetchTechniquesAsync());
        }
        if (techniqueSuggestions.positionOptions.length === 0) {
            dispatch(fetchTechniqueSuggestionsAsync())
        }
        if (selectedStudentTechniques.length === 0) {
            dispatch(fetchStudentTechniquesAsync())
        }
    }, [dispatch, techniques.length, loading, techniqueSuggestions.positionOptions.length, selectedStudentTechniques.length]);

    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange(techniques)

    const [expandedTechniqueId, setExpandedTechniqueId] = React.useState("");
    const [showAssignedTechniques, setShowAssignedTechniques] = React.useState(false)

    const handleAssignedFiltersCheck = () => {
        showAssignedTechniques ? setShowAssignedTechniques(false) : setShowAssignedTechniques(true)
    }

    const [assignedFilteredTechniques, setAssignedFilteredTechniques] = React.useState<Technique[]>([]);

    React.useEffect(() => {
        const filterTechniquesByAssigned = () => {
            const assignedTechniques = filteredTechniques.filter(technique =>
                selectedStudentTechniques.some(studentTechnique =>
                    studentTechnique.technique.techniqueId === technique.techniqueId &&
                    (studentTechnique.status === TechniqueStatus.NotYetStarted ||
                        studentTechnique.status === TechniqueStatus.Started ||
                        studentTechnique.status === TechniqueStatus.Passed)
                )
            );
            setAssignedFilteredTechniques(assignedTechniques);
        };

        filterTechniquesByAssigned();
    }, [filteredTechniques, selectedStudentTechniques]);

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
                    options={techniqueSuggestions}
                    showAssignedTechniques={showAssignedTechniques}
                    onAssignedFiltersCheck={handleAssignedFiltersCheck}
                    />
            </Card>
            <Card>
                {loading ? (
                    <Pageloader />
                ) : filteredTechniques.length === 0 ? (
                    <CardContent>
                        <Typography>{placeholderContent}</Typography>
                    </CardContent>
                ) : (
                    <Box>
                        <StudentTechniqueList
                            filteredTechniques={showAssignedTechniques ? assignedFilteredTechniques : filteredTechniques}
                            expandedTechniqueId={expandedTechniqueId}
                            onAccordionChange={handleAccordionChange}
                            editable={props.editable}
                        />
                    </Box>
                )}
            </Card>
        </>
    )
};
