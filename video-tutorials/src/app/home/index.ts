import express, {Request, Response, NextFunction, Router} from "express";
import {Knex} from "knex";
import {VideoHandlers, VideoPage, VideoQueries} from "../../types/common-types";

export interface HomeHandlers extends VideoHandlers {
    home: () => any;
}

export interface HomeQueries extends VideoQueries {
    loadHomePage: () => any;
}

function createHandlers({queries}: {queries: HomeQueries}): HomeHandlers {
    function home(req: Request, res: Response, next: NextFunction): any {
        return queries
            .loadHomePage()
            .then(() => res.render('home/templates/home', {}))
            .catch(next)
    }
    return {
        home
    } as HomeHandlers;
}

function createQueries({db}: {db: Promise<Knex>}): HomeQueries {
    function loadHomePage(): any {
        return db.then(client =>
            client('pages')
                .where({page_name: 'home'})
                .limit(1)
                .then(rows => rows[0])
        )
    }
    return {
        loadHomePage
    } as HomeQueries;
}

export function createHome({db}: {db: Promise<Knex>}): VideoPage {
    const queries: HomeQueries = createQueries({db});
    const handlers: HomeHandlers = createHandlers({queries});
    const router: Router  = express.Router();
    router.route('/').get(handlers.home);
    return {handlers, queries, router};
}