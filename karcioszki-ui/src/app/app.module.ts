import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameComponent } from './layout/game/game.component';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';


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
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatMenuModule
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
