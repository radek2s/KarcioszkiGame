import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'page-game-package-add',
  templateUrl: './game-package-add.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)'},
  styleUrls: ['../../app.component.scss']
})
export class GamePackageAddComponent {

  cardsPackage: CardsPackage;
  cardTitle: string;

  constructor(private gameService: GameService, private _snackBar: MatSnackBar, private playerService: PlayerService, private router: Router) {
    this.cardsPackage = new CardsPackage();
    this.cardsPackage.cards = [];
  }

  addCard() {
    this.cardsPackage.cards.push(this.cardTitle);
    this.cardTitle =  "";
  }

  addCardKeyboard(event: KeyboardEvent) {
    if(event.code === "Enter") {
      this.addCard();
    }
  }

  createGamePackage() {
    this.cardsPackage.author = this.playerService.getPlayer().name.toString();
    this.gameService.addGamePackage(this.cardsPackage).then(data => {
      this.cardsPackage = new CardsPackage();
      this.cardTitle = "";
      this.openSnackBar("Game Card Added", "Close")
      this.router.navigateByUrl(`ui/gamePackage`);
    }).catch(err => {
      this.openSnackBar("Something went wrong!", "Close")
      console.error(err)
    });
  }

  deleteCard(card){
    this.cardsPackage.cards = this.cardsPackage.cards.filter(existingCard => card !== existingCard);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
