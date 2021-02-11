import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';

import { GameService } from '../../../services/game.service';
import { CardsPackage } from '../../../models/CardsPackage';
import { MatDialog } from '@angular/material/dialog';
import { CardPackageInfoDialog } from 'src/app/layout/dialogs/package-info-dialog.component';
import { SimpleInputDialog } from '../../dialogs/simple-input-dialog.component';
import { SimpleInfoDialog } from '../../dialogs/simple-info-dialog.component';

@Component({
  selector: 'page-game-package-list',
  templateUrl: './game-package-list.html',
  styleUrls: ['../../../karcioszki.style.scss']
})
export class GamePackageListComponent implements OnInit {

  @Input() edit: boolean;
  @Output() selected = new EventEmitter<CardsPackage>();
  selectedPackage: CardsPackage;
  cardsPackages: CardsPackage[];
  cardTitle: string;

  constructor(
    private gameService: GameService,
    public infoDialog: MatDialog) { }

  ngOnInit(): void {
    this.gameService.getGamePackages().subscribe((data) => {
      this.cardsPackages = data;
      this.selectedPackage = this.cardsPackages[0];
    });
  }

  public openProperties(cardPackage: any) {
    this.selectedPackage = cardPackage;
    if (this.edit) {
      const dialogRef = this.infoDialog.open(CardPackageInfoDialog, {
        width: '80%',
        data: cardPackage
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.cardsPackages = this.cardsPackages.filter(item => item.id !== result);
        }
      });
    } else {
      if (cardPackage.visible) {
        const dialogRef = this.infoDialog.open(SimpleInputDialog, {
          width: '50%',
          data: {
            title: $localize`:@@packageCreatorPackagePrivate:Private package`,
            meassage: $localize`:@@packageProvidePassword:Provide a valid password to use that package`,
            placeholder: $localize`:@@commonPassword:Password`
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            if (result === cardPackage.password) {
              this.selected.emit(cardPackage);
            } else {
              this.infoDialog.open(SimpleInfoDialog, {
                width: '50%',
                data: {
                  title: $localize`:@@commonPasswordInvalid:Wrong Password!`
                }
              });
            }
          }
        });
      } else {
        this.selected.emit(cardPackage);
      }
    }
  }
}
