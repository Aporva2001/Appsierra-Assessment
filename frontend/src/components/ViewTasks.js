// ViewTasks.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import TaskItem from './TaskItem';

const ViewTasks = () => {
  const location = useLocation();
  const projectId = location.state.projectId
  const token= localStorage.getItem('token')
  console.log(projectId)
  const projectName = location.state?.projectName || 'Unnamed Project';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId || !token) {
      setError('No project ID provided.');
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/view-tasks/${projectId}`,{
          headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
          }
        });
        if (res.data && Array.isArray(res.data.tasks)) {
          setTasks(res.data.tasks);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks for Project - {projectName}
      </Typography>

      {tasks.length > 0 ? (
        <Paper elevation={3}>
          <List>
          {tasks.map((task, index) => (
  <Box key={task._id || index} mb={2}>
    <TaskItem
      task={{ ...task, title: `Task ${index + 1}: ${task.title || 'Untitled'}` }}
      onEdit={(task) => console.log('Edit:', task)}
      onDelete={(id) => console.log('Delete:', id)}
    />
  </Box>
))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No tasks found for this project.
        </Typography>
      )}
    </Box>
  );
};

export default ViewTasks;