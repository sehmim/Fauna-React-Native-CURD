import { Client } from 'faunadb';
import { Config } from './dotenv';

export const faunaClient = new Client({
  secret: Config.FAUNA_API_KEY,
});