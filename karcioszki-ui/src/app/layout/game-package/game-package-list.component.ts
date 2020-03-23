import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MenuDialog } from '../menu/menu.component';
import { CardPackageInfoDialog } from './card-package-info';

@Component({
  selector: 'page-game-package-list',
  templateUrl: './game-package-list.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)' },
  styleUrls: ['../../app.component.scss', './package.component.scss']
})
export class GamePackageListComponent implements OnInit {

  @Input() popupDisabled;
  cardsPackages: CardsPackage[];
  cardTitle: string;

  constructor(private gameService: GameService, private _snackBar: MatSnackBar, public infoDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.gameService.getGamePackages().subscribe((data) => {
      this.cardsPackages = data;
    });
  }


  private openProperties(cardPackage: any) {
    this.infoDialog.open(CardPackageInfoDialog, {
      width: '80%',
      data: cardPackage
    });
  }


  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
