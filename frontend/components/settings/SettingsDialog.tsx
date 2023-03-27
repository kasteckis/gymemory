import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { ThemeType } from '../../utils/interfaces/ThemeType';
import { Brightness7 } from '@mui/icons-material';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import CustomSnackbar from '../utils/CustomSnackbar';
import { GlobalAlert } from "../../utils/interfaces/GlobalAlert";
import { apiClient } from "../../utils/apiClient";
import { getParamsWithGuestCode } from "../../utils/params";

interface SettingsDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingsDialog = ({ open, setOpen }: SettingsDialogProps) => {
  const [alert, setAlert] = useState<GlobalAlert>({ open: false, message: '', severity: 'info' });

  const handleClose = () => {
    setOpen(false);
  };

  const handleThemeChange = () => {
    const currentTheme = localStorage.getItem('theme') as ThemeType;

    if (currentTheme) {
      localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
    } else {
      localStorage.setItem('theme', 'dark');
    }

    location.reload();
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  const copyApiLinkToStopWorkout = async () => {
    const link = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/stop-workout?token=';

    const params = getParamsWithGuestCode();

    const response = await apiClient.get('/generate-api-token', params);

    navigator.clipboard.writeText(link + response.data);

    setAlert({
      open: true,
      message: 'Link copied!',
      severity: 'success',
    });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleThemeChange}>
                <ListItemIcon>
                  <Brightness7 />
                </ListItemIcon>
                <ListItemText primary="Change theme" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={copyApiLinkToStopWorkout}>
                <ListItemIcon>
                  <ShortcutIcon />
                </ListItemIcon>
                <ListItemText primary="Copy API link to stop workout" />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar alert={alert} handleCloseAlert={handleCloseAlert}/>
    </>
  );
};

export default SettingsDialog;
