import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Technique } from 'common'

function AccordionList(props: {props: Array<Technique>}): JSX.Element {
    let content = []
    for (let prop of props.props) {
         content.push(
            <div>
            <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{prop.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                {prop.description}
                </Typography>
            </AccordionDetails>
            </Accordion>
            </div>
        );
    };
    return <tbody>{content}</tbody>
};

export default AccordionList
