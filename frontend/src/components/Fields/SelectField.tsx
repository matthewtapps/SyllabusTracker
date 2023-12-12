import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';


const TextField = styled(MuiTextField)({
    marginTop: "15px"
})

type SelectFieldProps = {
    name: string,
    wasSubmitted: boolean,
    required: boolean,
    options: string[],
} & TextFieldProps;

SelectField.defaultProps = {
    required: false,
    options: undefined
}

export function SelectField({ name, wasSubmitted, required, options, ...otherProps }: SelectFieldProps) {
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
            select 
            fullWidth 
            name={name} 
            defaultValue="" 
            required={required} 
            error={displayErrorMessage} 
            aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
            helperText={displayErrorMessage ? "Required" : undefined} 
            size="small" 
            onBlur={() => setTouched(true)} 
            onChange={handleChange} 
            type="text"
        >
            {options?.map(option => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
};
