import { Menu, MenuItem, SvgIcon } from "@mui/material";
import { TechniqueStatus } from "common";
import { useState } from "react";


export enum Option {
    Unassign = "Unassign",
    Assign = "Assign",
    Passed = "Passed",
    Started = "Started",
}

interface ProgressBarIconProps {
    statuses: TechniqueStatus[];
    onClick?: (event: any) => void;
    onMenuItemClick?: (option: Option) => void;
}

export function ProgressBarIcon(props: ProgressBarIconProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        props.onClick?.(event)
        if (!anchorEl) {
            setAnchorEl(event.currentTarget);
        } else {
            setAnchorEl(null)
        }
    };

    const handleClose = (event: any) => {
        setAnchorEl(null);
        event.stopPropagation()
    };

    const handleInternalMenuItemClick = (option: Option) => {
        props.onMenuItemClick?.(option)
        handleClose(new Event('Custom'));
    };

    const maximum = props.statuses.length
    const startedPercentage = props.statuses.filter(status => status === TechniqueStatus.Started || status === TechniqueStatus.Passed).length / maximum
    const passedPercentage = props.statuses.filter(status => status === TechniqueStatus.Passed).length / maximum

    return (
        <>
            <SvgIcon viewBox="-6 -6 120 49" style={{width: "80px"}} onClick={e => { e.stopPropagation(); handleClick(e) }}>
                    <rect rx="20" fill="#665c54" width="120" height="40" stroke="#bdae93" strokeWidth="4px"/>
                    <rect y="1.5" x="1.5" rx="18" fill="#d79921" width={117 * startedPercentage} height="37"/>
                    <rect y="1.5" x="1.5" rx="18" fill="#689d6a" width={117 * passedPercentage} height="37"/>
            </SvgIcon>
            {props.onClick &&
                <Menu
                    id="context-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={(event) => { event.stopPropagation(); handleInternalMenuItemClick(Option.Unassign) }}>Unassigned</MenuItem>
                    <MenuItem onClick={(event) => { event.stopPropagation(); handleInternalMenuItemClick(Option.Assign); }}>Assigned</MenuItem>
                    <MenuItem onClick={(event) => { event.stopPropagation(); handleInternalMenuItemClick(Option.Started) }}>Started</MenuItem>
                    <MenuItem onClick={(event) => { event.stopPropagation(); handleInternalMenuItemClick(Option.Passed) }}>Passed</MenuItem>
                </Menu>
            }
        </>

    );
}
