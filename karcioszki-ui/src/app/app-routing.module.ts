import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './layout/menu/menu.component';
import { GameComponent } from './layout/game/game.component';
import { GamePackageComponent } from './layout/game-package/game-package.component';

const routes: Routes = [
  {path: '', redirectTo: '/ui', pathMatch: 'full'},
  {path: 'ui', component: MenuComponent},
  {path: 'ui/game/:id', component: GameComponent},
  {path: 'ui/gamePackage', component: GamePackageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
