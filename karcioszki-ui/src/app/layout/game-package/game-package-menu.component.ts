import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';

@Component({
  selector: 'page-game-package-menu',
  templateUrl: './game-package-menu.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)' },
  styleUrls: ['../../app.component.scss']
})
export class GamePackageMenuComponent {

  cardsPackage: CardsPackage;
  cardTitle: string;

  constructor(private gameService: GameService, private _snackBar: MatSnackBar) {
    this.cardsPackage = new CardsPackage();
    this.cardsPackage.cards = [];
  }

  //delete package

  //


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}