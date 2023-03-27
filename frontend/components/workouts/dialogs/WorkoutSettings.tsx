import {Dialog, DialogTitle, Divider, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, {useState} from "react";

interface WorkoutSettingsProps {
    handleFinishAllExercises: () => Promise<void>;
}

const WorkoutSettings = ({handleFinishAllExercises}: WorkoutSettingsProps) => {

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleClose = () => {
        setDialogOpen(false)
    }

    const handleOpen = () => {
        setDialogOpen(true)
    }

    const handleSelectFinishWorkout = async () => {
        handleClose()
        await handleFinishAllExercises();
    }

    return (
      <>
        <IconButton sx={{ width: '10%' }} onClick={handleOpen} disableRipple={true}>
          <MoreVertIcon />
        </IconButton>

        <Dialog onClose={handleClose} open={dialogOpen}>
          <DialogTitle sx={{ textAlign: 'center' }}>Workout Settings</DialogTitle>
          <Divider />
          <List sx={{ pt: 0 }}>
            <ListItem disableGutters>
              <ListItemButton onClick={handleSelectFinishWorkout}>
                <ListItemText
                  sx={{ textAlign: 'center' }}
                  primary={'Mark all exercises as completed'}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Dialog>
      </>
    );
}

export default WorkoutSettings;
