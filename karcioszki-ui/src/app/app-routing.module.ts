import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './layout/menu/menu.component';
import { GameComponent } from './layout/game/game.component';
import { GamePackageAddComponent } from './layout/game-package/game-package-add.component';
import { GamePackageEditComponent } from './layout/game-package/game-package-edit.component';
import { GamePackageMenuComponent } from './layout/game-package/game-package-menu.component';
import { HomeComponent } from './views/home/home.component';
import { LobbyComponent } from './views/lobby/lobby.component';
import { GameNewComponent } from './views/game/game.component';

const routes: Routes = [
  {path: '', redirectTo: '/ui', pathMatch: 'full'},
  {path: 'ui', component: HomeComponent},
  {path: 'ui/old', component: MenuComponent},
  {path: 'ui/lobby/:id', component: LobbyComponent},
  {path: 'ui/game/:id', component: GameNewComponent},
  {path: 'ui/gameOld/:id', component: GameComponent},
  {path: 'ui/gamePackage/add', component: GamePackageAddComponent},
  {path: 'ui/gamePackage/edit/:id', component: GamePackageEditComponent},
  {path: 'ui/gamePackage', component: GamePackageMenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
