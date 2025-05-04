import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
  Stack,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskItem = ({ task, onEdit, onDelete }) => {
    console.log(task)
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>
            {task.title || 'Untitled Task'}
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Description:</strong> {task.description || 'No description provided.'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Created On:</strong> {formatDate(task.createdAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Due Date:</strong> {formatDate(task.completedAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Status:</strong>{' '}
            <Chip
              label={task.status || 'Unknown'}
              color={
                task.status === 'Completed'
                  ? 'success'
                  : task.status === 'In Progress'
                  ? 'warning'
                  : 'error'
              }
              size="small"
            />
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default TaskItem;
