const express= require('express');
const { isAuth } = require('../middlewares/is-auth');
const { postAddTask, getViewTask, editTaskById, deleteTaskById } = require('../controllers/tasks');

const router= express.Router();

router.post('/add-task/:id',isAuth, postAddTask)
router.get('/view-tasks/:id',isAuth, getViewTask)

router.put('/edit-task/:id',isAuth,editTaskById)

router.delete('/delete-task/:id',isAuth,deleteTaskById)

module.exports= router;