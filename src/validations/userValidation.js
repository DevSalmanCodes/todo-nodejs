import Joi from "joi";

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters long.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password is required.",
    }),
  });

  return schema.validate(data);
};

 export default validateUser;
