import {database} from "./data";

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    timeoutServer: async () => {
        await delay(250);
        return "timeout";
    },

    serverName: () => {
        return 'serverName';
    }

};
