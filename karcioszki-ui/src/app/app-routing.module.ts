import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './layout/menu/menu.component';
import { GameComponent } from './layout/game/game.component';
import { GamePackageAddComponent } from './layout/game-package/game-package-add.component';
import { GamePackageMenuComponent } from './layout/game-package/game-package-menu.component';

const routes: Routes = [
  {path: '', redirectTo: '/ui', pathMatch: 'full'},
  {path: 'ui', component: MenuComponent},
  {path: 'ui/game/:id', component: GameComponent},
  {path: 'ui/gamePackage/add', component: GamePackageAddComponent},
  {path: 'ui/gamePackage', component: GamePackageMenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
