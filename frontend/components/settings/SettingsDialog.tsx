import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
  TextField,
  Alert,
} from '@mui/material';
import { ThemeType } from '../../utils/interfaces/ThemeType';
import { Brightness7 } from '@mui/icons-material';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import CustomSnackbar from '../utils/CustomSnackbar';
import { GlobalAlert } from '../../utils/interfaces/GlobalAlert';
import { apiClient } from '../../utils/apiClient';
import { getParamsWithGuestCode } from '../../utils/params';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CachedIcon from '@mui/icons-material/Cached';

interface SettingsDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

enum SettingsDialogContentEnum {
  DEFAULT,
  API_SETTINGS,
}

const SettingsDialog = ({ open, setOpen }: SettingsDialogProps) => {
  const [alert, setAlert] = useState<GlobalAlert>({ open: false, message: '', severity: 'info' });
  const [settingsDialogContent, setSettingsDialogContent] = useState<SettingsDialogContentEnum>(
    SettingsDialogContentEnum.DEFAULT,
  );
  const [apiKey, setApiKey] = useState<string>('Loading ...');

  const handleClose = () => {
    if (settingsDialogContent === SettingsDialogContentEnum.DEFAULT) {
      setOpen(false);
    }
    handleGoBackToDefaultSettings();
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

  const regenerateAndCopyApiLinkToStopWorkout = async () => {
    const link = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/stop-workout?token=';

    const params = getParamsWithGuestCode();

    const response = await apiClient.get('/regenerate-api-token', params);

    setApiKey(link + response.data);
    navigator.clipboard.writeText(link + response.data);

    setAlert({
      open: true,
      message: 'Regenerated & Link copied!',
      severity: 'success',
    });
  };

  const copyApiLinkToStopWorkout = async () => {
    const link = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/stop-workout?token=';

    const params = getParamsWithGuestCode();

    const response = await apiClient.get('/generate-api-token', params);

    setApiKey(link + response.data);
    navigator.clipboard.writeText(link + response.data);

    setAlert({
      open: true,
      message: 'Link copied!',
      severity: 'success',
    });
  };

  const handleOpenApiSettings = () => {
    setSettingsDialogContent(SettingsDialogContentEnum.API_SETTINGS);
  };

  const handleGoBackToDefaultSettings = () => {
    setSettingsDialogContent(SettingsDialogContentEnum.DEFAULT);
  };

  let dialogContent = null;

  switch (settingsDialogContent) {
    case SettingsDialogContentEnum.API_SETTINGS:
      dialogContent = (
        <List>
          <Alert sx={{ mb: 2 }} severity="info">
            A webhook which allows you to cancel your ongoing workout from external applications.
          </Alert>
          <ListItem disablePadding>
            <TextField fullWidth variant="outlined" disabled value={apiKey} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={copyApiLinkToStopWorkout}>
              <ListItemIcon>
                <ContentCopyIcon />
              </ListItemIcon>
              <ListItemText primary="Copy API key" />
            </ListItemButton>
          </ListItem>
          {!localStorage.getItem('guest-code') && (
            <ListItem disablePadding>
              <ListItemButton onClick={regenerateAndCopyApiLinkToStopWorkout}>
                <ListItemIcon>
                  <CachedIcon />
                </ListItemIcon>
                <ListItemText primary="Regenerate & Copy API key" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      );
      break;
    case SettingsDialogContentEnum.DEFAULT:
    default:
      dialogContent = (
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
            <ListItemButton onClick={handleOpenApiSettings}>
              <ListItemIcon>
                <ShortcutIcon />
              </ListItemIcon>
              <ListItemText primary="API Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      );
  }

  useEffect(() => {
    if (settingsDialogContent === SettingsDialogContentEnum.API_SETTINGS) {
      const link = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/stop-workout?token=';

      const params = getParamsWithGuestCode();

      apiClient.get('/generate-api-token', params).then((response) => {
        setApiKey(link + response.data);
      });
    }
  }, [settingsDialogContent]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar alert={alert} handleCloseAlert={handleCloseAlert} />
    </>
  );
};

export default SettingsDialog;
