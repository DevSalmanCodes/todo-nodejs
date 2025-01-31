import express from "express";
import { addTodo, getTodos } from "../controllers/todo.controller.js";
const router = express.Router();

router.route("/add-todo").post(addTodo);
router.route("/get-todos").get(getTodos);
export default router;
