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

  findUserByEmail = async ({ email }) => {
    try {
      await this.connect();
      return await this.db.collection("users").findOne({ email });
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
        .insertOne({ idUser, token, createdAt: createdAt });
    } catch (err) {
      throw Error(err.message);
    }
  };

  findSession = async ({ idUser, token }) => {
    try {
      await this.connect();
      return await this.db.collection("sessions").findOne({ idUser, token });
    } catch (err) {
      throw Error(err.message);
    }
  };

  findLastSession = async ({ idUser }) => {
    try {
      await this.connect();
      return await this.db
        .collection("sessions")
        .findOne({ idUser }, { sort: { _id: -1 }, limit: 1 });
    } catch (err) {
      throw Error(err.message);
    }
  };
}

const dbAdapter = new MongoDbAdapter({ url: process.env.DATABASE_URL });

export default dbAdapter;
