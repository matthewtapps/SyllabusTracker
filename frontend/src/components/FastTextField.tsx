import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type FastTextFieldProps = {
    name: string,
    wasSubmitted: boolean,
    required: boolean,
} & TextFieldProps;

FastTextField.defaultProps = {
    required: false
}

export function FastTextField({ name, wasSubmitted, required, ...otherProps }: FastTextFieldProps) {
    const [fieldValue, setFieldValue] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const displayErrorMessage = ((wasSubmitted || touched) && required && fieldValue === '');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(event.target.value);
    };
    
    return (
        <TextField
            {...otherProps}
            id={`${name}-input`}
            required={required}
            name={name}
            type="text"
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            size="small"
            aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
            error={displayErrorMessage}
            helperText={displayErrorMessage ? "Required" : undefined}
        />
    );
};
