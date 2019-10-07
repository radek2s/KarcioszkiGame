# Karcioszki - The Game
Simple project to improve a knowledge about Java and Angular framework.

Game is very simple, two teams has to compete between each other. When the first team 
find all the cards that belongs to them they won. There are two team leaders that can see
the map. They have a very difficult mission - say just one word that is related to words 
included on the this team cards. When team has selected other card the move is passing to opposite team.

This game is still in develop.

##Running the application
Backend is developed as Spring Boot application that requires a MySQL server and Java 11.\
Frontend is developed in Angular v8\
NOTE: __tajniacy_dev__ database must be created before start 

### backend:
``gradle bootRun`` - To run the application Server
### frontend:
NOTE: Backend server must be running for developing this application\
``npm start`` - To start the develop server for Angular

### run:
When the application server has been started, open browser and type in address field:
``http://localhost:8080/hub`` to open the application in production mode.\
To open this app in Angular development mode open ``http://localhost:4200/hub``. 

### Developed by:

- @radek2s
- @mdebowska