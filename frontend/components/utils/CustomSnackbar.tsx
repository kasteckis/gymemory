import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { GlobalAlert } from '../../utils/interfaces/GlobalAlert';

interface Props {
  alert: GlobalAlert;
  handleCloseAlert: () => void;
}

const CustomSnackbar = ({ alert, handleCloseAlert }: Props) => {
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={6000}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
