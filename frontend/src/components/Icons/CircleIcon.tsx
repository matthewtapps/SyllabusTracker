import { SvgIcon } from "@mui/material";


interface CircleIconProps {
    fill: string;
    border: string;
    onClick: (event: any) => void;
}

export function CircleIcon(props: CircleIconProps) {
    return (
        <SvgIcon onClick={props.onClick}>
            <circle cx="12" cy="12" r="10"
                fill={props.fill}
                stroke={props.border}
                strokeWidth="2" />
        </SvgIcon>
    );
}
