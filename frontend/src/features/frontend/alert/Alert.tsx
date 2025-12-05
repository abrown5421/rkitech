import React, { useEffect, useRef, useState, useCallback } from "react";
import { closeAlert } from "./alertSlice";
import type { AlertOrientation, AlertProps } from "./alertTypes";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Animation from "../animation/Animation";
import { lightenHex } from "../../../utils/colorUtils";

const Alert: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const alert = useAppSelector((state) => state.alert);

    const [isClosing, setIsClosing] = useState(false);
    const [displayAlert, setDisplayAlert] = useState<AlertProps | null>(null);
    const autoCloseTimer = useRef<number | null>(null);

    const orientationStyles: Record<AlertOrientation, React.CSSProperties> = {
        "top-left": { top: 50, left: 0, transform: "none" },
        "top-center": { top: 50, left: "50%", transform: "translateX(-50%)" },
        "top-right": { top: 50, right: 0, transform: "none" },
        "bottom-left": { bottom: 0, left: 0, transform: "none" },
        "bottom-center": { bottom: 0, left: "50%", transform: "translateX(-50%)" },
        "bottom-right": { bottom: 0, right: 0, transform: "none" },
    };

    const handleClose = useCallback(() => {
        if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeAlert());
            setDisplayAlert(null); 
        }, 1000);
    }, [dispatch]);

    useEffect(() => {
        if (alert.open) {
            setDisplayAlert(alert);
            setIsClosing(false);

            if (autoCloseTimer.current !== null) {
                clearTimeout(autoCloseTimer.current);
            }

            autoCloseTimer.current = window.setTimeout(() => {
                handleClose();
            }, 4000) as unknown as number;
        }

        return () => {
            if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
        };
    }, [alert.open, handleClose]);

    if (!displayAlert) return null;
    if (!alert.open && !isClosing) return null;

    const orientation = (displayAlert.orientation ?? "bottom-right") as AlertOrientation;
    const positionStyle = orientationStyles[orientation];
    const themeColorObj = theme?.palette[displayAlert.severity];

    return (
        <Animation
            animationObject={{
                entranceAnimation: displayAlert.entrance || "animate__fadeInRight",
                exitAnimation: displayAlert.exit || "animate__fadeOutRight",
                isEntering: alert.open && !isClosing,
            }}
            style={{
                position: "absolute",
                zIndex: 5000,
                padding: "8px 12px",
                margin: 16,
                borderRadius: 6,
                border: `2px solid ${themeColorObj?.main}`,
                backgroundColor: lightenHex(themeColorObj?.main ?? '#0cff00', 0.8),
                display: "flex",
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
                ...positionStyle,
            }}
        >
            <Typography sx={{ color: themeColorObj?.main }}>{displayAlert.body}</Typography>

            {displayAlert.closeable && (
                <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer', color: themeColorObj?.main, ml: 5 }} />
            )}
        </Animation>
    );
};

export default Alert;