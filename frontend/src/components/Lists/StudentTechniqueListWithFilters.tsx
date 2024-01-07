import { User } from "@auth0/auth0-react";
import { Box, CardContent, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Technique, TechniqueStatus } from "common";
import React from "react";
import { useGetSelectedStudentTechniquesQuery } from "../../services/syllabusTrackerApi";
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
    selectedStudent: User,
}

StudentTechniqueListWithFilters.defaultProps = {
    elevation: 3,
    editable: false,
}

export function StudentTechniqueListWithFilters(props: StudentTechniqueListWithFiltersProps): JSX.Element {
    const selectedStudent = props.selectedStudent

    const { data: selectedStudentTechniques, isLoading, isSuccess, isError, error } = useGetSelectedStudentTechniquesQuery(selectedStudent.user_id)

    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange()

    const [showAssignedTechniques, setShowAssignedTechniques] = React.useState(false)

    const handleAssignedFiltersCheck = () => { setShowAssignedTechniques(!showAssignedTechniques) }

    const [assignedFilteredTechniques, setAssignedFilteredTechniques] = React.useState<Technique[]>([]);

    React.useEffect(() => {
        if (isSuccess) {
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
        }
    }, [filteredTechniques, selectedStudentTechniques, isSuccess]);

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
                {isLoading ? <Pageloader />
                    : isSuccess ?
                        <Box>
                            <StudentTechniqueList
                                filteredTechniques={showAssignedTechniques ? assignedFilteredTechniques : filteredTechniques}
                                editable={props.editable}
                                selectedStudent={selectedStudent}
                            />
                        </Box>
                        : isError ?
                        <CardContent>
                            <Typography>{`Failed to fetch selected student techniques: ${error}`}</Typography>
                        </CardContent>
                        :
                        <CardContent>
                            <Typography>No techniques available for selected filters.</Typography>
                        </CardContent>
                }
            </Card>
        </>
    )
};
