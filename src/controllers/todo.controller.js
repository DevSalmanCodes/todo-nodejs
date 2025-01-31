import Todo from "../models/todo.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

async function addTodo(req, res) {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json(new ApiError(400, "Please provide title"));
  }
  try {
    const todo = await Todo.create({
      title: title,
      description: description,
      userId: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Todo created successfully", todo));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err?.message || "Internal server error"));
  }
}

async function getTodos(req, res) {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    return res.status(200).json(new ApiResponse(200, "Todos fetched", todos));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500), err?.message || "Internal server error");
  }
}

async function updateTodo(req, res) {}

async function deleteTodo(req, res) {}

export { addTodo , getTodos};