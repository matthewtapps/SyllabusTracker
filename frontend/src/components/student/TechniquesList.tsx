import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { Card } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Technique } from 'common'

interface TechniquesListprops {
    listItems: Technique[],
    firstName: string,
    title: string
}

function TechniquesList(props: TechniquesListprops): JSX.Element {
    
    let content = []
    
    content.push(
        <Card elevation={0} square={true} sx={{
            margin: 2, 
            backgroundColor: "#3c3836", 
            color: "#fbf1c7", 
            border: 1,
            borderRadius: 2,}}>
            <Typography variant="h3" marginLeft={2}>Hi, {props.firstName}!</Typography>
            <Typography variant="h4" marginLeft={2}>{props.title}</Typography>
        </Card>
    )

    for (let prop of props.listItems) {
        let key = 'technique-' + prop.techniqueId 
        content.push(
            <React.Fragment key={key}>
                <Accordion 
                disableGutters={true} 
                square={true} 
                sx={{backgroundColor: "#3c3836", color: "#fbf1c7"}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{color: "#fbf1c7"}}/>}
                        aria-controls="panel1a-content"
                    >
                        <Typography>{prop.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                    sx={{backgroundColor: "#3c3836", color: "#fbf1c7"}}>
                        <Typography>
                        {'Section: ' + prop.section + ', Subsection: ' + prop.subSection}
                        </Typography>
                    </AccordionDetails>
                    <AccordionDetails
                    sx={{backgroundColor: "#3c3836", color: "#fbf1c7"}}>
                        <Typography>
                        {'Section: ' + prop.section + ', Subsection: ' + prop.subSection}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </React.Fragment>
        );
    };
    return <div>{content}</div>
};

export default TechniquesList
