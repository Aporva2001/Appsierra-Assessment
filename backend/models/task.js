const mongoose= require('mongoose')

const Schema= mongoose.Schema;

const taskSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: String, 
        required: true
    },
    completedAt: {
        type: String,
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
})

module.exports= mongoose.model('Task', taskSchema);