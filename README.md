# Karcioszki - The Game

[![CodeFactor](https://www.codefactor.io/repository/github/radek2s/karcioszkigame/badge/master)](https://www.codefactor.io/repository/github/radek2s/karcioszkigame/overview/master)

Simple project to improve a knowledge about Java and Angular framework.

Game is very simple, two teams has to compete between each other. When the first team 
find all the cards that belongs to them they won. There are two team leaders that can see
the map. They have a very difficult mission - say just one word that is related to words 
included on this team cards. When a team has selected another card the move is passing to opposite team.

This game is still in develop.

## Running the application
Backend is developed as Spring Boot application that requires Java 11.\
Frontend is developed in Angular v11\
This application use H2 database to store user data.\
User images are stored under ``C:/karcioszki/uploads/`` directory


### backend:
``gradle bootRun`` - To run the application Server
### frontend:
NOTE: Backend server must be running for developing this application\
``npm run-script start`` - To start the develop server for Angular in default mode\
``npm run-script start:pl`` - To start the develop server for Angular with Polish localization

### run:
When the application server has been started, open browser and type in address field:
``http://localhost:8080/en-US`` or ``http://localhost:8080/pl`` \
to open the application in production mode with a specific locale.

To open this app in Angular development mode just open ``http://localhost:4200/``. 

### Developed by:

- @radek2s
- @mdebowska

## Legal notice
This application use some of the stock photos from [unsplash.com](https://unsplash.com/) page. We want say thaks to all authors:  
[JESHOOTS.COM](https://unsplash.com/@jeshoots), 
[Frank McKenna](https://unsplash.com/@frankiefoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Andrik Langfield](https://unsplash.com/@andriklangfield?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Juliane Liebermann](https://unsplash.com/@jule_42?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Vidar Nordli-Mathisen](https://unsplash.com/@vidarnm?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Tianyi Ma](https://unsplash.com/@tma?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Luca Bravo](https://unsplash.com/@lucabravo?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Kalen Emsley](https://unsplash.com/@kalenemsley?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Sabri Tuzcu](https://unsplash.com/@sabrituzcu?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Conor Luddy](https://unsplash.com/@opticonor?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),
[Bruno Wolff](https://unsplash.com/@d0cz?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText),