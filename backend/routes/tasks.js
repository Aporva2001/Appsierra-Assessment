const express= require('express');
const { isAuth } = require('../middlewares/is-auth');
const { postAddTask, getViewTask } = require('../controllers/tasks');

const router= express.Router();

router.post('/add-task/:id',isAuth, postAddTask)
router.get('/view-tasks/:id',isAuth, getViewTask)

module.exports= router;