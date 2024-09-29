import express, {Request, Response, NextFunction, Router} from "express";
import Bluebird from "bluebird";
import {Knex} from "knex";
import {VideoHandlers, VideoPage, VideoQueries} from "../../commons";

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
            .then((viewData: any) => res.render('home/templates/home', viewData))
            .catch(next)
    }
    return {
        home
    } as HomeHandlers;
}

function createQueries({db}: {db: Bluebird<Knex>}): HomeQueries {
    function loadHomePage(): any {
        return db.then((client: Knex) =>
            client('videos')
                .sum('view_count as videosWatched')
                .then(rows => rows[0]))
    }
    return {
        loadHomePage
    } as HomeQueries;
}

export function createHome({db}: {db: Bluebird<Knex>}): VideoPage {
    const queries: HomeQueries = createQueries({db});
    const handlers: HomeHandlers = createHandlers({queries});
    const router: Router  = express.Router();
    router.route('/').get(handlers.home);
    return {handlers, queries, router};
}