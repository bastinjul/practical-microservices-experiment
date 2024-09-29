# Practical Microservices Experiment

Step-by-step writing of the code in the [Practical Microservices](https://pragprog.com/titles/egmicro/practical-microservices/) book using Typescript instead of Javascript.

## Code structure

The code is divided into several parts, as described in the book:
- [first-pass](first-pass) : corresponds to chapter 1 of the book and contains the original setup for running the application.

## Start the app

In each folder is a docker-compose file.\
To launch the application, simply use the `docker compose up -watch` command in the folder.\
This command allows you to launch the application and rebuild it automatically when a change is made to one of the files.

Alternatively, you can also use the command `docker compose up -d` to start the application, 
then use the command `docker compose watch app` in another terminal to allow the automatic rebuild when a change is made to the code.