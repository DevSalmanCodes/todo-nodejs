import Todo from "../models/todo.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
async function addTodo(req, res) {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json(new ApiError(400, "Title is required"));
  }
  try {
    const todo = await Todo.create({
      title,
      description,
      userId: req.user._id,
    });
    res
      .status(201)
      .json(new ApiResponse(201, "Todo created successfully", todo));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err?.message || "Internal Server Error"));
  }
}

async function getTodos(req, res) {
    try {
        const todos = await Todo.find({ userId: req.user._id });
       return res.status(200).json(new ApiResponse(200, "Todos fetched successfully", todos));
    } catch (err) {
        return res
        .status(500)
        .json(new ApiError(500, err?.message || "Internal Server Error"));
    }
}

async function updateTodo(req, res) {
    
}

async function deleteTodo(req, res) {}
