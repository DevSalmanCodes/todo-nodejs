import mongoose, { mongo } from "mongoose";
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
      .json(
        new ApiError(500, err?.message || "Error while creating a new todo")
      );
  }
}

async function getTodos(req, res) {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    return res.status(200).json(new ApiResponse(200, "Todos fetched", todos));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err?.message || "Error while fetching todos"));
  }
}

async function updateTodo(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!id) {
    return res.status(400).json(new ApiError(400, "Please provide id"));
  }
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json(new ApiError(404, "Todo not found"));
    }
    console.log(todo.userId, req.user._id);

    if (req.user._id.toString() !== todo.userId.toString()) {
      return res
        .status(401)
        .json(new ApiError(401, "You are not authorized to update this todo"));
    }
    todo.title = title;
    todo.description = description;
    await todo.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Todo updated successfully", todo));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err?.message || "Error while updating todo"));
  }
}

async function deleteTodo(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiError(400, "Please provide todo id"));
  }
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json(new ApiError(404, "Todo not found"));
    }

    if (req.user._id.toString() !== todo.userId.toString()) {
      return res
        .status(401)
        .json(new ApiError(401, "You are not authorized to update this todo"));
    }

    await todo.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Todo deleted successfully", todo));
  } catch (err) {
    return res
      .status(500)

      .json(new ApiError(500), err?.message || "Error while deleting the todo");

  }
}
async function toggleTodo(req, res) {
  const todoId = req.params.id;
  const isCompleted = req.body.isCompleted;
  if (!todoId) {
    return res.json(new ApiError(400, "Please provide todo id"));
  }
  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.json(new ApiError(404, "Todo not found"));
    }
    todo.completed = isCompleted;

    await todo.save();
    return res.json(new ApiResponse(200, "Todo updated successfully", todo));
  } catch (err) {
    return res.json(
      new ApiError(500, err?.message || "Error while updating todo")
    );
  }
}
export { addTodo, getTodos, updateTodo, deleteTodo, toggleTodo };
