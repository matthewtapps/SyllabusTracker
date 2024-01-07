import { Box, CircularProgress } from "@mui/material"

function Pageloader(): JSX.Element {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
        </Box>
    )
}

export default Pageloader
