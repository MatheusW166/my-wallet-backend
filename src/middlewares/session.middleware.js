import dbAdapter from "../adapters/mongodb.adapter.js";

async function validateSession(req, res, next) {
  try {
    const session = await dbAdapter.findSession({ token: req.token });
    if (!session) {
      return res.status(401).send("user not logged in");
    }
    req.session = session;
    next();
  } catch (err) {
    res.sendStatus(500);
  }
}

export default validateSession;
