import jwt from "jsonwebtoken";
class JWTService {
  sign(payload, secret) {
    try {
      const token = jwt.sign(payload, secret);
      return token;
    } catch (err) {
      throw err;
    }
  }

  verify(token) {
    try {
      const payload = jwt.verify(token);
      return payload;
    } catch (err) {
      throw err;
    }
  }
}
export default JWTService;
