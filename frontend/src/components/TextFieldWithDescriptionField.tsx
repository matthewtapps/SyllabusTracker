

import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'


const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    margin: "0px",
    padding: "0px",
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    },
});

const AccordionSummary = styled(MuiAccordionSummary)({
    margin: "0px",
    padding: "0px"
})

const AccordionDetails = styled(MuiAccordionDetails)({
    margin: "0px",
    padding: "0px"
})

type TextFieldWithDescriptionFieldProps = {
    name: string,
    wasSubmitted: boolean,
    required: boolean,
    options: string[] | undefined,
    descriptions: Descriptions,
    descriptionLabel: string,
    onPositionBlur: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
    hidden: boolean,
    disabled: boolean,
} & TextFieldProps;

TextFieldWithDescriptionField.defaultProps = {
    required: false,
    options: undefined,
    hidden: false,
    disabled: false,
    onPositionBlur: undefined,
}

interface DescriptionMap {
    [key: string]: string | undefined;
}

interface Descriptions {
    [key: string]: DescriptionMap;
}

export function TextFieldWithDescriptionField({ name, wasSubmitted, required, options, descriptions, descriptionLabel, hidden, disabled, onPositionBlur, ...otherProps }: TextFieldWithDescriptionFieldProps) {
    const [titleValue, setTitleValue] = React.useState('');
    const [descriptionValue, setDescriptionValue] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = React.useState(false);
    const displayErrorMessage = ((wasSubmitted || touched) && required && (titleValue === '' || descriptionValue === ''));

    const handleTitleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        setTitleValue(event.target.value || '');
        setDescriptionValue((event.target.value && descriptions[name][event.target.value]) || '');
        if (onPositionBlur) onPositionBlur(event);
    };

    const handleDescriptionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        setDescriptionValue(event.target.value)
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescriptionValue(event.target.value);
    };

    const handleAccordionChange = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setDescriptionExpanded(isExpanded);
    };

    React.useEffect(() => {
        if (displayErrorMessage && descriptionValue === '') {
            setDescriptionExpanded(true);
        }
    }, [displayErrorMessage, descriptionValue]);

    return (
        <Accordion hidden={hidden} disableGutters expanded={descriptionExpanded} onChange={handleAccordionChange}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
                <Autocomplete
                    options={options || []}
                    ListboxProps={{ onClick: event => event?.stopPropagation() }}
                    autoComplete
                    autoSelect
                    fullWidth
                    freeSolo
                    disabled={disabled}
                    onBlur={handleTitleBlur}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            {...otherProps}
                            id={`${name}-input`}
                            required={required}
                            name={name}
                            type="text"
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
                            error={displayErrorMessage}
                            helperText={displayErrorMessage ? "Required" : undefined}
                        />
                    )}
                />
            </AccordionSummary>

            <AccordionDetails>
                <TextField
                    {...otherProps}
                    id={`${name}-description-input`}
                    required={required}
                    name={`${name}Description`}
                    type="text"
                    onBlur={handleDescriptionBlur}
                    value={descriptionValue}
                    disabled={disabled}
                    size="small"
                    multiline
                    onChange={handleDescriptionChange}
                    rows={4}
                    label={descriptionLabel}
                    error={displayErrorMessage && descriptionValue === ''}
                    helperText={displayErrorMessage && descriptionValue === '' ? "Required" : undefined}
                />
            </AccordionDetails>
        </Accordion>
    );
};
