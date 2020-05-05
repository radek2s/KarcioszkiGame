import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamePackageAddComponent } from './layout/game-package/game-package-add.component';
import { GamePackageEditComponent } from './layout/game-package/game-package-edit.component';
import { GamePackageMenuComponent } from './layout/game-package/game-package-menu.component';
import { HomeComponent } from './views/home/home.component';
import { LobbyComponent } from './views/lobby/lobby.component';
import { GameNewComponent } from './views/game/game.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'lobby/:id', component: LobbyComponent},
  {path: 'game/:id', component: GameNewComponent},
  {path: 'ui/gamePackage/add', component: GamePackageAddComponent},
  {path: 'ui/gamePackage/edit/:id', component: GamePackageEditComponent},
  {path: 'ui/gamePackage', component: GamePackageMenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
