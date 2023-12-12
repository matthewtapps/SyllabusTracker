

import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

type TitleTextFieldProps = {
    name: string,
    wasSubmitted: boolean,
    required: boolean,
    options: string[] | undefined,
} & TextFieldProps;

TitleTextField.defaultProps = {
    required: false,
    options: undefined
}

export function TitleTextField({ name, wasSubmitted, required, options, ...otherProps }: TitleTextFieldProps) {
    const [fieldValue, setFieldValue] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const displayErrorMessage = ((wasSubmitted || touched) && required && fieldValue === '');

    const handleChange = (event: React.SyntheticEvent, value: string | null) => {
        setFieldValue(value || '');
    };
    return (
        <Autocomplete
            options={options || []}
            ListboxProps={{onClick: event => event?.stopPropagation()}}
            autoComplete
            autoSelect
            fullWidth
            freeSolo
            onChange={handleChange}
            filterOptions={(options, { inputValue }) => {
                return inputValue ? options.filter(option => 
                    option.toLowerCase().includes(inputValue.toLowerCase())
                ) : [];
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    {...otherProps}
                    id={`${name}-input`}
                    required={required}
                    name={name}
                    type="text"
                    onBlur={() => setTouched(true)}
                    autoComplete={fieldValue}
                    size="small"
                    aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
                    error={displayErrorMessage}
                    helperText={displayErrorMessage ? "Required" : undefined}
                />
            )}
        />
    )
};
