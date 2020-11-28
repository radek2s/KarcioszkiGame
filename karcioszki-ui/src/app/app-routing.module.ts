import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamePackageAddComponent } from './views/package-editor/game-package-add.component';
import { GamePackageEditComponent } from './views/package-editor/game-package-edit.component';
import { GamePackageMenuComponent } from './views/package-editor/game-package-menu.component';
import { HomeComponent } from './views/home/home.component';
import { LobbyComponent } from './views/lobby/lobby.component';
import { GameNewComponent } from './views/game/game.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'lobby/:id', component: LobbyComponent},
  {path: 'game/:id', component: GameNewComponent},
  {path: 'package-editor/add', component: GamePackageAddComponent},
  {path: 'package-editor/edit/:id', component: GamePackageEditComponent},
  {path: 'package-editor', component: GamePackageMenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
