import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';


const TextField = styled(MuiTextField)({
    marginTop: "15px"
})

type FastTextFieldProps = {
    name: string,
    wasSubmitted: boolean,
    required: boolean,
    defaultValue: string | undefined,
} & TextFieldProps;

FastTextField.defaultProps = {
    required: false,
    defaultValue: undefined,
}

export function FastTextField({ name, wasSubmitted, required, defaultValue, ...otherProps }: FastTextFieldProps) {
    const [fieldValue, setFieldValue] = React.useState(defaultValue || '');
    const [touched, setTouched] = React.useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = React.useState(false);

    React.useEffect(() => {
        setDisplayErrorMessage(((wasSubmitted || touched) && required && fieldValue === ''))
    },[wasSubmitted, touched, required, fieldValue])

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
            defaultValue={defaultValue}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            size="small"
            aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
            error={displayErrorMessage}
            helperText={displayErrorMessage ? "Required" : undefined}
        />
    );
};
