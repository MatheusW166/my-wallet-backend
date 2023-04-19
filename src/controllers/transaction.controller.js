import dbAdapter from "../adapters/database/mongodb.adapter.js";
import validationAdapter from "../adapters/validations/validations.adapter.js";

async function createTransaction(req, res) {
  const { value, error } = validationAdapter.validateTransaction(req.body);
  if (error) {
    return res.status(422).send(error);
  }
  try {
    const session = await dbAdapter.findSession({ token: req.token });
    if (!session) {
      return res.status(401).send("user not logged in");
    }
    const transaction = {
      idUser: session.idUser,
      description: value.description,
      value: value.value,
      isExit: value.isExit,
    };
    const { insertedId } = await dbAdapter.insertTransaction(transaction);
    res.status(201).send({ _id: insertedId, ...transaction });
  } catch (err) {
    res.sendStatus(500);
  }
}

async function listTransactions(req, res) {
  try {
    const session = await dbAdapter.findSession({ token: req.token });
    if (!session) {
      return res.status(401).send("user not logged in");
    }
    const transactions = await dbAdapter.findTransactions({
      idUser: session.idUser,
    });
    res.status(200).send(transactions);
  } catch (err) {
    res.sendStatus(500);
  }
}

const transactionController = { createTransaction, listTransactions };

export default transactionController;
