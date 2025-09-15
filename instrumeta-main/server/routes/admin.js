import express from 'express';
import {
  getAllUsers,
  deleteUser,
} from '../controllers/adminController.js';

const router = express.Router();

// GET all users
router.get('/users', getAllUsers);

// DELETE user
router.delete('/users/:id', deleteUser);



export default router;
