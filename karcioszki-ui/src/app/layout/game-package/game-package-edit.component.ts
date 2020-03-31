import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';
import { PlayerService } from 'src/app/services/player.service';
import { debug } from 'util';

@Component({
  selector: 'page-game-package-edit',
  templateUrl: './game-package-edit.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)'},
  styleUrls: ['../../app.component.scss']
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
    this.cardsPackage.cards.push(this.cardTitle);
    this.cardTitle =  "";
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
    this.router.navigateByUrl(`ui/gamePackage`);
  }

  deleteCard(){
    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
