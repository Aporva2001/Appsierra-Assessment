import React from 'react';
import { green } from '@mui/material/colors';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

const ProjectItem = ({ name, description, onView, onAddTask, onModify, onDelete,completedTasks,inProgressTasks,notStartedTasks,totalTasks }) => {

  const truncateDescription = (text, maxLength = 15) => {
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };
  const getWidth = (count) => {
    return totalTasks > 0 ? `${(count / totalTasks) * 100}%` : '0%';
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

      <Box
        sx={{
          display: 'flex',
          height: 10,
          width: '100%',
          mt: 2,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: getWidth(notStartedTasks), backgroundColor: 'red' }} />
        <Box sx={{ width: getWidth(inProgressTasks), backgroundColor: 'yellow' }} />
        <Box sx={{ width: getWidth(completedTasks), backgroundColor: green[300] }} />
      </Box>
    </Card>
  );
};

export default ProjectItem;
