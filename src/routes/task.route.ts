import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { addTask, deleteTask, getAllTasks, updateTask } from '../controllers/task.controller';

const router = Router();



// private route

router.route("/addTask").post(authMiddleware,addTask)
router.route("/").get(authMiddleware,getAllTasks)
router.route("/:task_id").delete(authMiddleware,deleteTask)
router.route("/:task_id").put(authMiddleware,updateTask)

export default router;
