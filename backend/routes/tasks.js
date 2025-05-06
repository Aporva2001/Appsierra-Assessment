const express= require('express');
const { isAuth } = require('../middlewares/is-auth');
const { postAddTask, getViewTask, editTaskById } = require('../controllers/tasks');

const router= express.Router();

router.post('/add-task/:id',isAuth, postAddTask)
router.get('/view-tasks/:id',isAuth, getViewTask)

router.put('/edit-task/:id',isAuth,editTaskById)

module.exports= router;