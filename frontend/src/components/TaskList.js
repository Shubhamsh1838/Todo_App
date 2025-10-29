import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleString();
  };

  const getDueStatus = (dueDate, completed) => {
    if (completed) return 'completed';
    if (!dueDate) return 'no-due-date';
    
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 0) return 'overdue';
    if (hoursDiff < 24) return 'due-soon';
    return 'upcoming';
  };

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks yet. Create your first task to get started!</p>
        </div>
      ) : (
        tasks.map(task => (
          <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
              <div className="task-header">
                <h4>{task.title}</h4>
                <span className={`due-status ${getDueStatus(task.dueDate, task.completed)}`}>
                  {task.completed ? 'Completed' : 
                   !task.dueDate ? 'No due date' :
                   new Date(task.dueDate) < new Date() ? 'Overdue' : 'Due soon'}
                </span>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              {task.dueDate && (
                <p className="task-due-date">
                  Due: {formatDate(task.dueDate)}
                </p>
              )}
            </div>
            
            <div className="task-actions">
              <button
                onClick={() => onToggleComplete(task)}
                className={`btn-toggle ${task.completed ? 'completed' : ''}`}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              
              <button
                onClick={() => onEdit(task)}
                className="btn-edit"
              >
                Edit
              </button>
              
              <button
                onClick={() => onDelete(task._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;