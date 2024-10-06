import express, {Request, Response, NextFunction, Router} from "express";
import {Knex} from "knex";
import {AppHandlers, App, AppQueries} from "../../types/common-types";
import camelCaseKeys from "../../camelcase/camelcase-keys"
import {Page, PageData} from "../../aggregators/home-page";

export interface HomeHandlers extends AppHandlers {
    home: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export interface HomeQueries extends AppQueries {
    loadHomePage: () => Promise<PageData>;
}

function createHandlers({queries}: {queries: HomeQueries}): HomeHandlers {
    function home(req: Request, res: Response, next: NextFunction): Promise<any> {
        return queries
            .loadHomePage()
            .then((pageData: PageData) => res.render('home/templates/home', pageData))
            .catch(next)
    }
    return {
        home
    } as HomeHandlers;
}

function createQueries({db}: {db: Promise<Knex>}): HomeQueries {
    function loadHomePage(): Promise<PageData> {
        return db.then(client =>
            client('pages')
                .where({page_name: 'home'})
                .limit(1)
                .then(camelCaseKeys)
                .then((rows: Page[]) => rows[0])
                .then((page: Page) => page.pageData)
        ).then(res => {
            console.log(res);
            return res;
        });
    }
    return {
        loadHomePage
    } as HomeQueries;
}

export function createHome({db}: {db: Promise<Knex>}): App {
    const queries: HomeQueries = createQueries({db});
    const handlers: HomeHandlers = createHandlers({queries});
    const router: Router  = express.Router();
    router.route('/').get(handlers.home);
    return {handlers, queries, router};
}