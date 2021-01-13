import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ImageManagerDialog } from 'src/app/layout/dialogs/image-manager-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'page-game-package-edit',
  templateUrl: './game-package-edit.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)'},
  styleUrls: ['../../karcioszki.style.scss']
})
export class GamePackageEditComponent {

  public cardsPackage;
  cardTitle: string;
  webSocket: WebSocket;

  constructor(
    private gameService: GameService, 
    private _snackBar: MatSnackBar, 
    public playerService: PlayerService, 
    private router: Router, 
    private route: ActivatedRoute,
    private dialog: MatDialog) {
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

  chooseImage() {
    const dialogRef = this.dialog.open(ImageManagerDialog, {width: '60%'});
    dialogRef.afterClosed().subscribe(result => {
      if(!!result) {
        this.cardsPackage.image = result.url;
      }
    });
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
