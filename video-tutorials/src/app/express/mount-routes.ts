import {Express} from "express";
import {AppConfig} from "../../config/config";
import {mustBeLoggedIn} from "./must-be-logged-in";

export default function mountRoutes(app: Express, config: AppConfig) {
    app.use('/', config.homeApp.router);
    app.use('/record-viewing', config.recordViewingApp.router);
    app.use('/register', config.registerUsersApp.router);
    app.use('/auth', config.authenticateApp.router);
    app.use('/creators-portal', mustBeLoggedIn, config.creatorsPortalApp.router);
}