

import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore'
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Descriptions } from 'common';


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
    name: 'type' | 'position' | 'openGuard',
    wasSubmitted: boolean,
    required: boolean,
    options: string[] | undefined,
    descriptions: Descriptions,
    descriptionLabel: string,
    onPositionBlur: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
    hidden: boolean,
    disabled: boolean,
    defaultValue: string | undefined,
    descriptionDefaultValue: string | undefined,
} & TextFieldProps;

TextFieldWithDescriptionField.defaultProps = {
    required: false,
    options: undefined,
    hidden: false,
    disabled: false,
    onPositionBlur: undefined,
    defaultValue: undefined,
    descriptionDefaultValue: undefined,
}

export function TextFieldWithDescriptionField({ name, wasSubmitted, required, options, descriptions, descriptionLabel, hidden, disabled, onPositionBlur, defaultValue, descriptionDefaultValue, ...otherProps }: TextFieldWithDescriptionFieldProps) {
    const [titleValue, setTitleValue] = React.useState(defaultValue || '');
    const [descriptionValue, setDescriptionValue] = React.useState(descriptionDefaultValue || '');
    const [touched, setTouched] = React.useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = React.useState(false);

    const titleError = ((wasSubmitted || touched) && required && titleValue === '');
    const descriptionError = ((wasSubmitted || touched) && (titleValue.length > 0 || required) && descriptionValue === '');

    const handleTitleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        setTitleValue(event.target.value || '');
        setDescriptionValue((event.target.value && descriptions[name][event.target.value].description) || '');
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
        if (descriptionError) {
            setDescriptionExpanded(true);
        }
    }, [descriptionError]);

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
                    defaultValue={defaultValue}
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
                            aria-describedby={titleError ? `${name}-error` : undefined}
                            error={titleError}
                        />
                    )}
                />
            </AccordionSummary>

            <AccordionDetails>
                <TextField
                    {...otherProps}
                    id={`${name}-description-input`}
                    required={required || titleValue.length > 0}
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
                    error={descriptionError}
                />
            </AccordionDetails>
        </Accordion>
    );
};
