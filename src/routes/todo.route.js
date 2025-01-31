import express from "express";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todo.controller.js";
const router = express.Router();

router.route("/add-todo").post(addTodo);
router.route("/get-todos").get(getTodos);
router.route("/update-todo/:id").put(updateTodo);
router.route("/delete-todo/:id").delete(deleteTodo)
export default router;
