import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

function ProjectItem({ name, description, onView, onAddTask, onModify, onDelete }) {
  return (
    <Card
      sx={{
        width: '100%',
        minWidth: 300,
        maxWidth: 600,
        m: 'auto',
        boxShadow: 4,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {
            description.length <= 10 ? description : description.substr(0,15).concat("...")
          }
        </Typography>
      </CardContent>

      <CardActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            width: '100%',
            px: 1,
            gap: 1,
          }}
        >
          <Box>
            <Button size="small" variant="outlined" onClick={onView} sx={{ mr: 1 }}>
              View
            </Button>
            <Button size="small" variant="outlined" onClick={onAddTask}>
              Add Task
            </Button>
          </Box>

          <Box>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={onModify}
              sx={{ mr: 1 }}
            >
              Modify
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={onDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
}

export default ProjectItem;
