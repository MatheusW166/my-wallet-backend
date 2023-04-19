import { v4 } from "uuid";
import dbAdapter from "../adapters/database/mongodb.adapter.js";
import validationAdapter from "../adapters/validations/validations.adapter.js";
import bcrypt from "bcrypt";

async function logIn(req, res) {
  const { value, error } = validationAdapter.validateLogin(req.body);
  if (error) {
    return res.status(422).send(error);
  }
  try {
    const userFound = await dbAdapter.findUserByEmail({ email: value.email });
    if (!userFound) {
      return res.status(404).send("user not found");
    }
    if (!bcrypt.compareSync(value.password, userFound.password)) {
      return res.status(401).send("incorrect password");
    }
    const token = v4();
    await dbAdapter.insertSession({
      idUser: userFound._id,
      token,
    });
    const { _id, name, email } = userFound;
    res.status(200).send({ _id, name, email, token });
  } catch (err) {
    res.sendStatus(500);
  }
}

async function register(req, res) {
  const { value, error } = validationAdapter.validateUser(req.body);
  if (error) {
    return res.status(422).send(error);
  }
  try {
    const userFound = await dbAdapter.findUserByEmail({ email: value.email });
    if (userFound) {
      return res.status(409).send("user already exists");
    }
    await dbAdapter.insertUser({
      email: value.email,
      name: value.name,
      password: bcrypt.hashSync(value.password, 10),
    });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

const userController = { logIn, register };

export default userController;
