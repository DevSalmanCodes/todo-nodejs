import express from "express";
import { addTodo, getTodos, updateTodo } from "../controllers/todo.controller.js";
const router = express.Router();

router.route("/add-todo").post(addTodo);
router.route("/get-todos").get(getTodos);
router.route("/update-todo/:id").put(updateTodo);
export default router;
