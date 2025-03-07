import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils";
import ApiError from "../utils/apiError.utils";
import { pool } from "../config/db.config";
import ApiResponse from "../utils/apiResponse.utils";

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}


export const getAllTasks=asyncHandler(async(req:AuthRequest,res:Response)=>{
    const user_id=req.user?.id;
    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC",
            [user_id]
        );
        return res.status(200).json(new ApiResponse(200,{tasks:result.rows},"tasks fetched successfully"))
    } catch (error) {
        throw new ApiError(500,"unable to fetch tasks")
    }

})


export const addTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.id;
  const { title, description, dueDate } = req.body;
  if (
    [title, description, dueDate].some((field) => !field || field.length === 0)
  )
    throw new ApiError(400, "fields are missing");
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title,user_id,description,due_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, user_id, description, dueDate]
    );
    return res.status(201).json(new ApiResponse(201,result.rows[0],"task added successfully"))
  } catch (error) {
    throw new ApiError(500,"unable to add task")
  }
});

export const deleteTask=asyncHandler(async(req:AuthRequest,res:Response)=>{
    const {task_id}=req.params
    if(!task_id)
        throw new ApiError(400,"task id not found")
    try {
       const result= await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *",[task_id]);
       if (result.rowCount === 0) {
        throw new ApiError(400,'Task not found')
    }
       return res.status(201).json(new ApiResponse(200,{taskId:result.rows[0].id},"task deleted successfully"))
    } catch (error) {
        throw new ApiError(500,"unable to delete task") 
    }
})

export const updateTask=asyncHandler(async(req:AuthRequest,res:Response)=>{
    const {task_id}=req.params;
    let { title, description,dueDate,completed} = req.body; 
    if(!task_id)
        throw new ApiError(400,"task id not found")
    if ([title, description, dueDate].some((field) => !field || field.length === 0))
        throw new ApiError(400, "fields are missing");
    if(completed===undefined)
        completed=false;
    try {
        const existingTask = await pool.query("SELECT * FROM tasks WHERE id = $1", [task_id]);
        if (existingTask.rowCount === 0) {
            throw new ApiError(400,'Task not found')
        }
        const updatedTask = await pool.query(
            `UPDATE tasks 
            SET description = COALESCE($1, description), 
                due_date = COALESCE($2, due_date), 
                title = COALESCE($3,title),
                completed = COALESCE(NULLIF($4, '')::BOOLEAN, false)
            WHERE id = $5 
            RETURNING *`,
            [description,dueDate,title,completed,task_id]
        );
       return res.status(201).json(new ApiResponse(200,{updatedTask:updatedTask.rows[0]},"task updated successfully"))

    } catch (error) {
        console.log(error)
        throw new ApiError(500,"unable to update task") 
    }
})