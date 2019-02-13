import express from "express";
import graphqlHTTP from "express-graphql";
import {schema} from "./schema";
import {resolvers} from "./resolvers";

export class GqlApplication {

    private express: express.Application;
    private server: any;
    private schema = schema;

    constructor() {

        this.express = express();
        this.express.use('/graphql', graphqlHTTP((req, res) => {
            res.set('Access-Control-Allow-Origin', '*');
            if (req.headers.authorization) {
                const header = req.headers.authorization;
                res.setHeader('authorization', header);
            }
            return {
                schema: this.schema,
                rootValue: resolvers,
                graphiql: true,
                context: {
                    request: req,
                    response: res
                }
            };
        }));
    }

    start(port?: number) {
        this.server = this.express.listen(port || 4000);
    }

    stop() {
        this.server.close();
    }
}
