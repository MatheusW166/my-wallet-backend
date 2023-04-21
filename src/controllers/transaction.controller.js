import dbAdapter from "../adapters/mongodb.adapter.js";

async function deleteTransaction(req, res) {
  const { id } = req.params;
  try {
    const transactionFound = await dbAdapter.findTransaction({ id });
    if (!transactionFound) {
      return res.sendStatus(404);
    }
    if (!transactionFound.idUser.equals(req.session.idUser)) {
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
  try {
    const transactionFound = await dbAdapter.findTransaction({ id });
    if (!transactionFound.idUser.equals(req.session.idUser)) {
      return res.sendStatus(401);
    }
    const { matchedCount } = await dbAdapter.updateTransaction(id, req.body);
    if (matchedCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function createTransaction(req, res) {
  try {
    const transaction = { ...req.body, idUser: req.session.idUser };
    const { insertedId } = await dbAdapter.insertTransaction(transaction);
    res.status(201).send({ _id: insertedId, ...transaction });
  } catch (err) {
    res.sendStatus(500);
  }
}

async function listTransactions(req, res) {
  try {
    const transactions = await dbAdapter.findTransactions({
      idUser: req.session.idUser,
    });
    res.status(200).send(transactions);
  } catch (err) {
    res.sendStatus(500);
  }
}

export {
  createTransaction,
  listTransactions,
  editTransaction,
  deleteTransaction,
};
