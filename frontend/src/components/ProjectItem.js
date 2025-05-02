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
    <Card sx={{ maxWidth: 500, m: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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
