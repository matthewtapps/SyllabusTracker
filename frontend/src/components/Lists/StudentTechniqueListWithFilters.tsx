import { Box, CardContent, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Technique, TechniqueStatus } from "common";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Pageloader from "../Base/PageLoader";
import StudentTechniqueList from "./Base Lists/StudentTechniqueList";
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

interface StudentTechniqueListWithFiltersProps {
    editable: boolean,
    elevation: number,
}

StudentTechniqueListWithFilters.defaultProps = {
    elevation: 3,
    editable: false,
}

export function StudentTechniqueListWithFilters(props: StudentTechniqueListWithFiltersProps): JSX.Element {
    const { techniques, techniquesLoading, checkingAge } = useSelector((state: RootState) => state.techniques);
    const { selectedStudentTechniques } = useSelector((state: RootState) => state.student)

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
                    showAssignedTechniques={showAssignedTechniques}
                    onAssignedFiltersCheck={handleAssignedFiltersCheck}
                    />
            </Card>
            <Card>
                {(techniquesLoading || checkingAge) ? (
                    <Pageloader />
                ) : filteredTechniques.length === 0 ? (
                    <CardContent>
                        <Typography>No techniques found with current filters</Typography>
                    </CardContent>
                ) : (
                    <Box>
                        <StudentTechniqueList
                            filteredTechniques={showAssignedTechniques ? assignedFilteredTechniques : filteredTechniques}
                            editable={props.editable}
                        />
                    </Box>
                )}
            </Card>
        </>
    )
};
