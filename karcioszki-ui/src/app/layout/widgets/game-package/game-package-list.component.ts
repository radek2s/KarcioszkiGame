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
  styleUrls: ['../../../karcioszki.style.scss', './package.component.scss']
})
export class GamePackageListComponent implements OnInit {

  @Input() edit: boolean;
  @Output() selected = new EventEmitter<CardsPackage>();
  cardsPackages: CardsPackage[];
  cardTitle: string;

  constructor(
    private gameService: GameService,
    public infoDialog: MatDialog) { }

  ngOnInit(): void {
    this.gameService.getGamePackages().subscribe((data) => {
      this.cardsPackages = data;
    });
  }

  private openProperties(cardPackage: any) {
    if(this.edit) {
      const dialogRef = this.infoDialog.open(CardPackageInfoDialog, {
        width: '80%',
        data: cardPackage
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.cardsPackages = this.cardsPackages.filter(item => item.id !== result)
        }
      });
    } else {
      if(cardPackage.visible) {
        const dialogRef = this.infoDialog.open(SimpleInputDialog, {
          width: '50%',
          data: {
            title: "Prywatna paczka",
            meassage: "Aby skorzystać z tej paczki podaj hasło:",
            placeholder: "Hasło"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result !== undefined) {
            if(result === cardPackage.password) {
              this.selected.emit(cardPackage);
            } else {
              this.infoDialog.open(SimpleInfoDialog, {
                width: '50%',
                data: {
                  title:'Błędne hasło!'
                }
              })
            }
          }
        })
      } else {
        this.selected.emit(cardPackage);
      }
    }
  }
}
