const express = require('express');
const { db } = require('../config/firebase');
const router = express.Router();

const COLLECTION_NAME = 'tasks';

// GET /api/tasks - Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const tasksSnapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();
    const tasks = [];

    tasksSnapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const taskData = {
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION_NAME).add(taskData);
    const newTask = {
      id: docRef.id,
      ...taskData
    };

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task (mark complete/incomplete)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, text } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (typeof completed === 'boolean') {
      updateData.completed = completed;
    }

    if (text !== undefined) {
      if (text.trim() === '') {
        return res.status(400).json({ error: 'Task text cannot be empty' });
      }
      updateData.text = text.trim();
    }

    await db.collection(COLLECTION_NAME).doc(id).update(updateData);

    const updatedDoc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!updatedDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await docRef.delete();
    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;