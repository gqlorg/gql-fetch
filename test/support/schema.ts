import {buildSchema} from "graphql";
import fs from "fs";
import assert from "assert";
import {database} from "./data";

export const schema = buildSchema(`

  scalar File

  type User {
    id: Int
    name: String
    email: String
  }
  
  type Query {    
    user(id: Int!): User
    users: [User]  
    timeoutServer(interval: Int!): String
    serverName: String      
  }
  
  type Mutation {
    createUser(name: String, email: String): User
    uploadFile(userId: Int!, file: File!): String    
    uploadFiles(userId: Int!, files: [File!]!): [String]
  }
  
`);

export const resolvers = {

    user: (parent: any) => {
        for (const i in database.users.items) {
            if (database.users.items[i].id === parent.id) {
                return database.users.items[i];
            }
        }
    },
    users: () => {
        return database.users.items;
    },

    timeoutServer: async (args: any) => {
        await delay(args.interval);
        return "timeout";
    },

    serverName: () => {
        return 'serverName';
    },

    uploadFile: (args: any) => {
        return fs.readFileSync(args.file.tempFile, args.file.encoding);
    },

    uploadFiles: (args: any) => {
        if (!args.files)
            return;
        const a = [];
        for (const f of args.files) {
            a.push(fs.readFileSync(f.tempFile, f.encoding));
            f.destroy();
            assert(!fs.existsSync(f.tempFile));
        }
        return a;
    }

};

function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms).unref();
    });
}
