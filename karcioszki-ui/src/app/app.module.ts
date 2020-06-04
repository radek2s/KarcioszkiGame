import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameComponent } from './layout/game/game.component';

import { HttpClientModule } from '@angular/common/http';


import { GamePackageMenuComponent } from './views/package-editor/game-package-menu.component';
import { GamePackageAddComponent } from './views/package-editor/game-package-add.component';
import { GamePackageEditComponent } from './views/package-editor/game-package-edit.component';
import { GamePackageListComponent } from './layout/widgets/game-package/game-package-list.component';
import { UniqueNameValidationDirective } from './shared/unique-validator.directive';
import { PinValidationDialog } from './layout/dialogs/pin-validation-dialog.component';
import { HomeComponent } from './views/home/home.component';
import { LobbyComponent } from './views/lobby/lobby.component';
import { GameNewComponent } from './views/game/game.component';
import { CreateGameLobbyDialog } from './layout/dialogs/game-create-lobby-dialog.component';
import { SimpleInputDialog } from './layout/dialogs/simple-input-dialog.component';
import { SimpleConfirmDialog } from './layout/dialogs/simple-confirm-dialog.component';
import { SimpleInfoDialog } from './layout/dialogs/simple-info-dialog.component';
import { CardPackageInfoDialog } from './layout/dialogs/package-info-dialog.component';
import { GameSummaryDialog } from './layout/dialogs/game-summary-dialog.component';

import { MaterialModule } from './modules/material.module';



@NgModule({
  declarations: [
    AppComponent,
    CardPackageInfoDialog,
    GameComponent,
    GamePackageMenuComponent,
    GamePackageAddComponent,
    GamePackageEditComponent,
    GamePackageListComponent,
    PinValidationDialog,
    UniqueNameValidationDirective,
    HomeComponent,
    LobbyComponent,
    GameNewComponent,
    GameSummaryDialog,
    SimpleInputDialog,
    SimpleConfirmDialog,
    SimpleInfoDialog,
    CreateGameLobbyDialog
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
    ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CardPackageInfoDialog, 
    PinValidationDialog,
    GameSummaryDialog,
    SimpleInputDialog,
    SimpleConfirmDialog,
    SimpleInfoDialog,
    CreateGameLobbyDialog
  ]
})
export class AppModule { }
