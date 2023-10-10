import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider/Divider'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { styled } from '@mui/material/styles'
import { Technique } from 'common'

interface ModulesListProps {
    listItems: Technique[],
    firstName: string,
    title: string
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginLeft: 2,
    paddingTop: 2,
    paddingBottom: 2,
    color: '#fbf1c7',
    backgroundColor: "#3c3836"
}))

function ModulesList(props: ModulesListProps): JSX.Element {

    const [selectedIndex, setSelectedIndex] = React.useState(1);
    
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    let content = []
    
    content.push(
        <div>
            <StyledPaper elevation={0} square={true}>
                <Typography variant="h3" marginLeft={2}>Hi, {props.firstName}!</Typography>
                <Typography variant="h4" marginLeft={2}>{props.title}</Typography>
            </StyledPaper>
        </div>
    )

    for (let prop of props.listItems) {
        let i = 0
        let key = 'technique-' + prop.techniqueId 
        content.push(
            <React.Fragment>
                <List key={key}
                sx={{backgroundColor: "#3c3836", 
                color: "#fbf1c7", 
                marginX: 2,
                marginY: 1,
                paddingY: 0,
                border: 1,
                borderRadius: 2,
                boxShadow: 4
            }}
                component="nav"
                >
                    <ListItemButton
                    selected={selectedIndex === i}
                    onClick={(event) => handleListItemClick(event, i)}
                    >
                        <ListItemText primary={prop.name}/>
                        <ListItemIcon sx={{justifyContent: 'right'}}>
                            <ArrowForwardIosOutlinedIcon sx={{color: "#fbf1c7", stroke: 1}}/>
                        </ListItemIcon>
                    </ListItemButton>
                </List>
            </React.Fragment>
        );
        i++
    };
    return <div>{content}</div>
};

export default ModulesList
