# Karcioszki

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Project structure:
Karcioszki-UI is a subproject of the Karcioszki. It is a Angular application to play with friends. Code is located in `.src/app/` directory.

There are a few directories with specific purpose:
- __layout__ (components used in viewComponents)  
  - __dialogs__ (dialog components for application)
  - __widgets__ (other components used inside application)
- __models__ (TypeScript classes)
- __services__ (application logic services)
- __shared__ (validators and others)
- __views__ (web pages and main components)

## Project localization:
This application has two language versions: English and Polish. To run this application in a specific language you must choose valid option during `npm run-script start` option.