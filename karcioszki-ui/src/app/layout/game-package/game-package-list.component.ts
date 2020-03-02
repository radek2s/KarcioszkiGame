import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';

@Component({
  selector: 'page-game-package-list',
  templateUrl: './game-package-list.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)' },
  //   styleUrls: ['./app.component.scss']
  styleUrls: ['../../app.component.scss']
})
export class GamePackageListComponent implements OnInit {

  @Input() popupDisabled;
  cardsPackages: CardsPackage[];
  cardTitle: string;

  constructor(private gameService: GameService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.gameService.getGamePackages().subscribe((data) => {
      this.cardsPackages = data;
    });
  }

  
  private openProperties() {
    /*
  public dialogRef: MatDialogRef<MenuDialog>, private gameService: GameService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
  this.gameService.getGamePackages().subscribe((data) => {
    this.cardPackages = data;
  })
  */
}


  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
