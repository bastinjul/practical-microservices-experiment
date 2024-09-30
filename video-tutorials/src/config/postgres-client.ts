import {Client, QueryResult} from 'pg';

export interface PostgresClient {
     query: (sql: string, values: any[]) => Promise<QueryResult>;
     stop: () => Promise<void>
}

export function createPostgresClient({connectionString}: {connectionString: string}): PostgresClient {
     const client: Client = new Client({connectionString});
     let connectedClient: Promise<Client> | null = null;
     
     function connect(): Promise<Client> {
          if(!connectedClient) {
               connectedClient = client.connect()
                   .then(() => client.query('SET search_path = message_store, public'))
                   .then(() => client);
          }
          return connectedClient;
     }

     function query(sql: string, values: any[] = []): Promise<QueryResult> {
          return connect()
              .then(client => client.query(sql, values))
     }

     return {
          query,
          stop: () => client.end()
     }
}