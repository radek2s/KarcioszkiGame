import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { GameComponent } from './game.component';
import { GamePackageComponent } from './layout/game-package/game-package.component';


const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'game/:id', component: GameComponent},
  {path: 'gamePackage', component: GamePackageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
