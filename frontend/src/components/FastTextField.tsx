import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type FastTextFieldProps = {
    name: string,
    wasSubmitted: boolean,
} & TextFieldProps;

export function FastTextField({ name, wasSubmitted, ...otherProps }: FastTextFieldProps) {
    const [value, setValue] = React.useState('')
    const [touched, setTouched] = React.useState(false)
    const displayErrorMessage = (wasSubmitted || touched)
    return (
        <div key={name}>
            <TextField
                {...otherProps}
                id={`${name}-input`}
                name={name}
                type="text"
                onChange={(event) => setValue(event.currentTarget.value)}
                onBlur={() => setTouched(true)}
                aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
            />
        </div>
    )
}
