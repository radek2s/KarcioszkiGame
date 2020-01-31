import { Component } from '@angular/core';
import { GameService } from 'src/app/game.service';
import { CardsPackage } from 'src/models/CardsPackage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'page-game-package',
  templateUrl: './game-package.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)'}
  //   styleUrls: ['./app.component.scss']
})
export class GamePackageComponent {

  cardsPackage: CardsPackage;
  cardTitle: string;

  constructor(private gameService: GameService, private _snackBar: MatSnackBar) {
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
