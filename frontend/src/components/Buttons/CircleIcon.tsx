import { Menu, MenuItem, SvgIcon } from "@mui/material";
import { useState } from "react";
import React from 'react'


export enum Option {
    Unassign = "Unassign",
    Assign = "Assign",
    Passed = "Passed",
    Started = "Started",
}

interface CircleIconProps {
    fill: string;
    onClick?: (event: any) => void;
    onMenuItemClick?: (option: Option) => void;
}

export function CircleIcon(props: CircleIconProps) {
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

    return (
        <>
            <SvgIcon onClick={e => { e.stopPropagation(); handleClick(e) }}>
                <circle cx="12" cy="12" r="10"
                    fill={props.fill}
                    stroke="#bdae93"
                    strokeWidth="2px"
                />
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
