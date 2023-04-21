import dbAdapter from "../adapters/mongodb.adapter.js";
import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

async function logIn(req, res) {
  const { email, password } = req.body;
  try {
    const userFound = await dbAdapter.findUser({ email });
    if (!userFound) {
      return res.status(404).send("user not found");
    }
    if (!bcrypt.compareSync(password, userFound.password)) {
      return res.status(401).send("incorrect password");
    }
    const token = uuid();
    await dbAdapter.insertSession({
      idUser: userFound._id,
      token,
    });
    delete userFound.password;
    res.status(200).send({ ...userFound, token });
  } catch (err) {
    res.sendStatus(500);
  }
}

async function register(req, res) {
  const { email, password, name } = req.body;
  try {
    const userFound = await dbAdapter.findUser({ email });
    if (userFound) {
      return res.status(409).send("user already exists");
    }
    await dbAdapter.insertUser({
      email,
      name,
      password: bcrypt.hashSync(password, 10),
    });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function getUserData(req, res) {
  try {
    const userFound = await dbAdapter.findUser({
      _id: new ObjectId(req.session.idUser),
    });
    if (!userFound) {
      return res.status(404).send("user not found");
    }
    delete userFound.password;
    res.status(200).send(userFound);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export { logIn, register, getUserData };
