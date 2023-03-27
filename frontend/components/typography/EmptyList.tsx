import { Typography } from '@mui/material';
import React from 'react';

interface EmptyListInterface {
  text: string;
}

const EmptyList = ({ text }: EmptyListInterface) => {
  return (
    <Typography
      mt={2}
      sx={{ textAlign: 'center', fontWeight: 'bold' }}
      variant="body1"
      component="h2"
    >
      {text}
    </Typography>
  );
};

export default EmptyList;
