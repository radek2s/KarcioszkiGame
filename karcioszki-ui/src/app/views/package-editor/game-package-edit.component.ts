import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'page-game-package-edit',
  templateUrl: './game-package-edit.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)'},
  styleUrls: ['../../karcioszki.style.scss', '../../layout/widgets/game-package/package.component.scss']
})
export class GamePackageEditComponent {

  private cardsPackage;
  cardTitle: string;
  webSocket: WebSocket;

  constructor(
    private gameService: GameService, 
    private _snackBar: MatSnackBar, 
    private playerService: PlayerService, 
    private router: Router, 
    private route: ActivatedRoute) {
  }

/**
   * Method invoked when component is created
   * 
   * Initialize component variables
   */
  ngOnInit(): void {
    let packageId = +this.route.snapshot.paramMap.get('id');
    this.gameService.getGamePackage(packageId).subscribe((data) => {
      this.cardsPackage = data
    });
  }

  addCard() {
    if (this.cardsPackage.cards.find(cardTitle => {
      return cardTitle === this.cardTitle
    })) {
      this.openSnackBar("Karta o tej nazwie już została dodana", "Zamknij")
    } else {
    this.cardsPackage.cards.push(this.cardTitle);
    this.cardTitle =  "";
    }
  }

  addCardKeyboard(event: KeyboardEvent) {
    if(event.code === "Enter") {
      this.addCard();
    }
  }

  updateGamePackage(packageId: number) {
    this.gameService.updateGamePackage(this.cardsPackage, packageId).then(data => {
      this.openSnackBar("Game Card Updated", "Close")
    }).catch(err => {
      this.openSnackBar("Something went wrong!", "Close")
      console.error(err)
    });
    this.router.navigateByUrl(`package-editor`);
  }

  deleteCard(card){
    this.cardsPackage.cards = this.cardsPackage.cards.filter(existingCard => card !== existingCard);
  }

  public toggle(event: MatSlideToggleChange) {
    this.cardsPackage.visible = event.checked;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
