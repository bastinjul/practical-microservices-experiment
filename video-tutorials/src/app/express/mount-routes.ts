import {Express} from "express";
import {AppConfig} from "../../config/config";

export default function mountRoutes(app: Express, config: AppConfig) {
    app.use('/', config.homeApp.router);
    app.use('/record-viewing', config.recordViewingApp.router);
    app.use('/register', config.registerUsersApp.router);
}