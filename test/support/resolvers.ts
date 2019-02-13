import {database} from "./data";

function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms).unref();
    });
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

    timeoutServer: async (args: any) => {
        await delay(args.interval);
        return "timeout";
    },

    serverName: () => {
        return 'serverName';
    }

};
