import React from 'react'
import NavBar from '../NavBar'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { Technique } from 'common'

interface ModulesListProps {
    listItems: Technique[],
    firstName: string,
    title: string,
}

//function ModulesList(props: ModulesListProps): JSX.Element {
//
//    const [selectedIndex, setSelectedIndex] = React.useState(1);
//    
//    const handleListItemClick = (
//        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
//        index: number,
//    ) => {
//        setSelectedIndex(index);
//    };
//
//    return (
//    <div>
//        <Box sx={{ flexGrow: 1 }}>
//            <NavBar text={props.title}/>
//        </Box>
//    {props.listItems.map((prop, index) => (
//            <React.Fragment>
//                <List key={'technique-' + prop.techniqueId}
//                sx={{backgroundColor: "#3c3836", 
//                color: "#fbf1c7", 
//                marginX: 2,
//                marginY: 1,
//                paddingY: 0,
//                border: 1,
//                borderRadius: 2,
//                boxShadow: 4
//            }}
//                component="nav"
//                >
//                    <ListItemButton
//                    selected={selectedIndex === index}
//                    onClick={(event) => handleListItemClick(event, index)}
//                    >
//                        <ListItemText primary={prop.name}/>
//                        <ListItemIcon sx={{justifyContent: 'right'}}>
//                            <ArrowForwardIosOutlinedIcon sx={{color: "#fbf1c7", stroke: 1}}/>
//                        </ListItemIcon>
//                    </ListItemButton>
//                </List>
//            </React.Fragment>
//        ))};
//    </div>s
//    )};
//
//export default ModulesList
//