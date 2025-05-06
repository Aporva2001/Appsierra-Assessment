import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  Paper,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import TaskItem from './TaskItem';

const ViewTasks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName || 'Unnamed Project';
  const projectDescription = location.state?.projectDescription || 'No description provided';
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId || !token) {
      setError('No project ID or token provided.');
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/view-tasks/${projectId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
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
  }, [projectId, token]);

  const handleEditTask = (task) => {
    navigate(`/edit-task/${task._id}`, {
      state: { taskData: task },
    });
  };
  
  const handleDeleteTask = (task) =>{
    const taskId= task._id;
    const projectId= task.projectId;
    axios.delete(`http://localhost:8080/delete-task/${taskId}@${projectId}`,{
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(response =>{
      console.log(response.data)
      const updatedTasks = tasks.filter((task)=>{
        return task._id !== taskId
      })
      setTasks(updatedTasks)
    })
    .catch(err =>{
      console.log(err)
    })

  }

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
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
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Stack spacing={1} mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Tasks for Project
        </Typography>
        <Typography variant="h6" color="primary">
          {projectName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {projectDescription}
        </Typography>
      </Stack>

      {tasks.length > 0 ? (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List disablePadding>
            {tasks.map((task, index) => (
              <Box key={task._id || index} mb={2}>
                <TaskItem
                  task={{
                    ...task,
                    title: `Task ${index + 1}: ${task.title || 'Untitled'}`,
                  }}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task)}
                />
                {index !== tasks.length - 1 && <Divider sx={{ my: 2 }} />}
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
