import { validate } from "uuid";

async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || typeof authorization !== "string") {
    return res.status(401).send("no token found");
  }
  const token = authorization.replace("Bearer ", "");
  if (!validate(token)) {
    return res.status(401).send("token is invalid");
  }
  req.token = token;
  next();
}

const tokenMiddlewares = { validateToken };

export default tokenMiddlewares;
