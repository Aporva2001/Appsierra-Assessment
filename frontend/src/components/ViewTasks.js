import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';

const ViewTasks = () => {
  const location = useLocation();
  const projectData = location.state;

  if (!projectData) {
    return <Typography variant="h6" color="error">No project data provided.</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {projectData.name}
      </Typography>

      <Card sx={{ mb: 4, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="h6" color="text.primary">
            {projectData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {projectData.description}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Tasks
      </Typography>

      {projectData.tasks && projectData.tasks.length > 0 ? (
        <Paper elevation={3}>
          <List>
            {projectData.tasks.map((task, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Task ${index + 1}: ${task.title || 'Untitled'}`}
                    secondary={task.description || 'No description'}
                  />
                </ListItem>
                {index < projectData.tasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No tasks added to this project.
        </Typography>
      )}
    </Box>
  );
};

export default ViewTasks;
