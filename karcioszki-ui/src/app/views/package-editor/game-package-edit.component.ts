import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

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

  async getFileDetails(e) {
    console.log(e.target.files);
    let image = await this.toBase64(e.target.files[0])
    this.cardsPackage.image = String(image);
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
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
