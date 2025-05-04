import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

const ProjectItem = ({ name, description, onView, onAddTask, onModify, onDelete }) => {
  // Truncate description to 15 characters with ellipsis
  const truncateDescription = (text, maxLength = 15) => {
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        boxShadow: 4,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {truncateDescription(description)}
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
            <Button
              size="small"
              variant="outlined"
              onClick={onView}
              sx={{ mr: 1 }}
            >
              View
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onAddTask}
            >
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
};

export default ProjectItem;
