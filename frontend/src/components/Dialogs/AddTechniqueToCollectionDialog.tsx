import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Collection, Technique } from 'common';
import React from 'react';
import { usePostNewTechniqueMutation } from '../../services/syllabusTrackerApi';
import { transformTechniqueForPost } from '../../util/Utilities';
import TechniqueList from '../Lists/Base Lists/TechniqueList';
import TechniqueFilter, { useHandleTechniqueFilterChange } from '../Lists/List Filters/TechniqueFilter';
import { NewTechniqueDialog } from './NewTechniqueDialog';


const Card = styled(MuiCard)({
    backgroundColor: `#3c3836`,
    '&.MuiCard-root': {
        margin: "10px",
        marginBottom: "0px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

const Button = styled((props: ButtonProps) => (
    <MuiButton sx={{ width: "100%", marginX: "10px" }} variant='contained' {...props} />
))(({ theme }) => ({}));

interface AddTechniqueToCollectionDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSave: (selectedTechniques: { index: number, technique: Technique }[]) => void;
    editingTechniquesCollection: Collection | null;
};

export const AddTechniqueToCollectionDialog = (props: AddTechniqueToCollectionDialogProps) => {
    const [selectedTechniques, setSelectedTechniques] = React.useState<{ index: number, technique: Technique }[]>([])
    const [cleanedTechniques, setCleanedTechniques] = React.useState<Technique[]>([]);
    const { filteredTechniques, handleTechniqueFilterChange } = useHandleTechniqueFilterChange()
    const [postTechnique] = usePostNewTechniqueMutation()

    React.useEffect(() => {

        setCleanedTechniques(filteredTechniques.filter(t => !props.editingTechniquesCollection?.collectionTechniques?.some(ct => ct.technique.techniqueId === t.techniqueId)));
    }, [filteredTechniques, setCleanedTechniques, props.editingTechniquesCollection?.collectionTechniques])

    const handleTechniqueCheck = (techniqueId: string) => {
        setSelectedTechniques(prevSelectedTechniques => {
            const foundTechnique = prevSelectedTechniques.find(item => item.technique.techniqueId === techniqueId);
            if (foundTechnique) {
                return prevSelectedTechniques.filter(item => item.technique.techniqueId !== techniqueId);
            } else {
                const techniqueToAdd = cleanedTechniques!.find(technique => technique.techniqueId === techniqueId);
                if (techniqueToAdd) {
                    return [...prevSelectedTechniques, { index: prevSelectedTechniques.length, technique: techniqueToAdd }];
                } else {
                    return prevSelectedTechniques;
                }
            }
        });

    };

    interface filtersObject {
        title: string,
        hierarchy: string | null,
        type: string | null,
        position: string | null,
        openGuard: string | null,
        gi: string | null;
    }

    const handleTechniqueFilterMatchClick = (collection: Collection): {
        title: string,
        hierarchy: string | null,
        type: string | null,
        position: string | null,
        openGuard: string | null,
        gi: string | null;
    } => {

        let collectionObject: filtersObject = {
            title: "",
            hierarchy: null,
            type: null,
            position: null,
            openGuard: null,
            gi: null
        }

        if (collection.hierarchy) { collectionObject.hierarchy = collection.hierarchy }
        if (collection.type) { collectionObject.type = collection.type.title }
        if (collection.position) { collectionObject.position = collection.position.title }
        if (collection.openGuard) { collectionObject.position = collection.openGuard.title }
        if (collection.gi) { collectionObject.gi = collection.gi }

        return collectionObject
    }

    const [newTechniqueDialogOpen, setNewTechniqueDialogOpen] = React.useState(false)

    const handleNewTechniqueClick = () => {
        setNewTechniqueDialogOpen(true)
    }

    const handleNewTechniqueCancel = () => {
        setNewTechniqueDialogOpen(false);
    }

    const handleNewTechniqueSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const fieldValues = Object.fromEntries(formData.entries())
        const validTechnique = transformTechniqueForPost(fieldValues);
        postTechnique(validTechnique)
        setNewTechniqueDialogOpen(false)
    }

    const handleAddTechniques = (selectedTechniques: { index: number, technique: Technique }[]) => {
        setCleanedTechniques(prevCleanedTechniques => {
            return prevCleanedTechniques.filter(technique =>
                !selectedTechniques.some(st => st.technique.techniqueId === technique.techniqueId)
            )
        })
        setSelectedTechniques([])
        props.onSave(selectedTechniques)
    }

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={props.onCancel} scroll="paper" maxWidth="md" fullWidth>
                <DialogTitle sx={{ padding: "0px", marginBottom: "10px" }}>
                    <Card>
                        <TechniqueFilter
                            onTechniqueFiltersChange={handleTechniqueFilterChange}
                            matchTechniqueFilters={props.editingTechniquesCollection && (handleTechniqueFilterMatchClick(props.editingTechniquesCollection))} />
                    </Card>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Button disabled={(selectedTechniques.length === 0)} onClick={(event) => { event.stopPropagation(); handleAddTechniques(selectedTechniques); props.onClose(); }}>Add</Button>
                            <Button onClick={(event) => { event.stopPropagation(); props.onClose(); }}>Cancel</Button>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Button onClick={handleNewTechniqueClick}>Create New Technique</Button>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent dividers={true} sx={{ padding: "0px" }}>
                    <Card>
                        <TechniqueList
                            filteredTechniques={cleanedTechniques ?? filteredTechniques}
                            checkbox
                            elevation={1}
                            checkedTechniques={selectedTechniques}
                            onTechniqueCheck={handleTechniqueCheck}
                        />
                    </Card>
                    <div style={{ paddingTop: "10px" }} />
                </DialogContent>
            </Dialog>
            <NewTechniqueDialog
                dialogOpen={newTechniqueDialogOpen}
                onClose={handleNewTechniqueCancel}
                onCancel={handleNewTechniqueCancel}
                onSave={handleNewTechniqueSaveClick}
            />
        </>
    )
};
