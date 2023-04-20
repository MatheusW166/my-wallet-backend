import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

class MongoDbAdapter {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.db = null;
  }

  connect = async () => {
    try {
      if (this.db) return;
      this.client = await MongoClient.connect(this.config.url);
      this.db = this.client.db();
      console.log("Connected to db");
    } catch (err) {
      this.db = null;
      this.client = null;
      throw Error(err.message);
    }
  };

  close = async () => {
    try {
      if (!this.client) return;
      await this.client.close();
      this.db = null;
      this.client = null;
    } catch (err) {
      throw Error(err.message);
    }
  };

  findUser = async (userData) => {
    try {
      await this.connect();
      return await this.db.collection("users").findOne(userData);
    } catch (err) {
      throw Error(err.message);
    }
  };

  insertUser = async ({ email, name, password }) => {
    try {
      await this.connect();
      return await this.db
        .collection("users")
        .insertOne({ email, name, password });
    } catch (err) {
      throw Error(err.message);
    }
  };

  insertSession = async ({ idUser, token, createdAt = Date.now() }) => {
    try {
      await this.connect();
      return await this.db
        .collection("sessions")
        .insertOne({ idUser, token, createdAt });
    } catch (err) {
      throw Error(err.message);
    }
  };

  insertTransaction = async ({
    description,
    value,
    idUser,
    isExit,
    createdAt = Date.now(),
  }) => {
    try {
      await this.connect();
      return await this.db
        .collection("transactions")
        .insertOne({ idUser, value, description, isExit, createdAt });
    } catch (err) {
      throw Error(err.message);
    }
  };

  findTransactions = async ({ idUser }) => {
    try {
      await this.connect();
      return await this.db
        .collection("transactions")
        .find({ idUser })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (err) {
      throw Error(err.message);
    }
  };

  findSession = async ({ token }) => {
    try {
      await this.connect();
      return await this.db.collection("sessions").findOne({ token });
    } catch (err) {
      throw Error(err.message);
    }
  };

  findLastSession = async ({ idUser }) => {
    try {
      await this.connect();
      const sessions = await this.db
        .collection("sessions")
        .find({ idUser })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();
      if (sessions.length === 0) {
        return null;
      }
      return sessions[0];
    } catch (err) {
      throw Error(err.message);
    }
  };
}

const dbAdapter = new MongoDbAdapter({ url: process.env.DATABASE_URL });

export default dbAdapter;
