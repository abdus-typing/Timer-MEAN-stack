// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');

// const app = express();

// //middleware
// app.use(cors());
// app.use(express.json());

// //Database connection
// mongoose.connect('mongodb://localhost:27017/auth-db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }) 
// .then(() =>    console.log('Connected to MongoDB'))
// .catch(err => console.error('Could not connect to MongoDB...', err));

// //Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'todoApp';
let tasks;

client.connect().then(() => {
  const db = client.db(dbName);
  tasks = db.collection('tasks');
  console.log('MongoDB connected');
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const allTasks = await tasks.find().toArray();
  res.json(allTasks);
});

// Create a task
app.post('/api/tasks', async (req, res) => {
  const task = req.body;
  const result = await tasks.insertOne(task);
  res.json(result);
});

// Mark task as done/undone
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  await tasks.updateOne({ _id: new ObjectId(id) }, { $set: { done } });
  res.sendStatus(200);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await tasks.deleteOne({ _id: new ObjectId(id) });
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
