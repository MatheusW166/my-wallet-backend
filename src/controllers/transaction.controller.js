import dbAdapter from "../adapters/database/mongodb.adapter.js";
import validationAdapter from "../adapters/validations/validations.adapter.js";

async function deleteTransaction(req, res) {
  const { id } = req.params;
  try {
    const session = await dbAdapter.findSession({ token: req.token });
    if (!session) {
      return res.status(401).send("user not logged in");
    }

    const transactionFound = await dbAdapter.findTransaction({ id });
    if (!transactionFound) {
      return res.sendStatus(404);
    }
    if (!transactionFound.idUser.equals(session.idUser)) {
      return res.sendStatus(401);
    }

    const { deletedCount } = await dbAdapter.deleteTransaction({ id });
    if (deletedCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function editTransaction(req, res) {
  const { id } = req.params;
  const { value, error } = validationAdapter.validateTransaction(req.body);
  if (error) {
    return res.status(422).send(error);
  }
  try {
    const session = await dbAdapter.findSession({ token: req.token });
    if (!session) {
      return res.status(401).send("user not logged in");
    }

    const transactionFound = await dbAdapter.findTransaction({ id });
    if (!transactionFound.idUser.equals(session.idUser)) {
      return res.sendStatus(401);
    }

    const { matchedCount } = await dbAdapter.updateTransaction(id, value);
    if (matchedCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}

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

const transactionController = {
  createTransaction,
  listTransactions,
  editTransaction,
  deleteTransaction,
};

export default transactionController;
