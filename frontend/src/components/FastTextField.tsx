import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type FastTextFieldProps = {
    name: string,
    wasSubmitted: boolean,
} & TextFieldProps;

export function FastTextField({ name, wasSubmitted, ...otherProps }: FastTextFieldProps) {
    const [touched, setTouched] = React.useState(false)
    const displayErrorMessage = (wasSubmitted || touched)
    return (
        <TextField
            {...otherProps}
            id={`${name}-input`}
            name={name}
            type="text"
            onBlur={() => setTouched(true)}
            size="small"
            aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
        />
    )
}
