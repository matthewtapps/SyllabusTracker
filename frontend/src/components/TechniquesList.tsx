import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Technique } from 'common'

interface TechniquesListprops {
    listItems: Technique[],
    title: string
}

function TechniquesList(props: TechniquesListprops): JSX.Element {
    
    let content = []
    
    content.push(
        <Typography variant="h3">{props.title}</Typography>
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
