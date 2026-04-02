import express from 'express';
import { 
  getResumes, 
  getResumeById, 
  createResume, 
  updateResume, 
  deleteResume,
  duplicateResume 
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getResumes)
  .post(protect, createResume);

router.route('/:id')
  .get(protect, getResumeById)
  .put(protect, updateResume)
  .delete(protect, deleteResume);

router.post('/:id/duplicate', protect, duplicateResume);

export default router;
