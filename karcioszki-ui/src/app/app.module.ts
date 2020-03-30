import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameComponent } from './layout/game/game.component';
import { MenuComponent, MenuDialog, PlayerDialog } from './layout/menu/menu.component';

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

import { GamePackageMenuComponent } from './layout/game-package/game-package-menu.component';
import { GamePackageAddComponent } from './layout/game-package/game-package-add.component';
import { GamePackageEditComponent } from './layout/game-package/game-package-edit.component';
import { CardPackageInfoDialog } from './layout/game-package/card-package-info.component';
import { GamePackageListComponent } from './layout/game-package/game-package-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuDialog,
    PlayerDialog,
    CardPackageInfoDialog,
    GameComponent,
    GamePackageMenuComponent,
    GamePackageAddComponent,
    GamePackageEditComponent,
    GamePackageListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
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
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [MenuDialog, PlayerDialog, CardPackageInfoDialog]
})
export class AppModule { }
