import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'page-game-package-add',
  templateUrl: './game-package-add.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)'},
  //   styleUrls: ['./app.component.scss']
  styleUrls: ['../../app.component.scss']
})
export class GamePackageAddComponent {

  cardsPackage: CardsPackage;
  cardTitle: string;

  constructor(private gameService: GameService, private _snackBar: MatSnackBar, private playerService: PlayerService) {
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
    console.debug(this.cardsPackage);
    this.gameService.addGamePackage(this.cardsPackage).then(data => {
      this.cardsPackage = new CardsPackage();
      this.cardTitle = "";
      this.openSnackBar("Game Card Added", "Close")
    }).catch(err => {
      this.openSnackBar("Something went wrong!", "Close")
      console.error(err)
    });
  }

  deleteCard(){
    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
