import { Component, Inject } from '@angular/core';
import { CardsPackage } from 'src/app/models/CardsPackage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from 'src/app/services/game.service';

@Component({
    selector: 'create-game-lobby-dialog',
    templateUrl: './game-create-lobby-dialog.html',
    styleUrls: ['../../karcioszki.style.scss']
})
export class CreateGameLobbyDialog {

    cardPackageList: CardsPackage[];

    constructor(
        public dialogRef: MatDialogRef<CreateGameLobbyDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private gameService: GameService,
    ) {
        this.gameService.getGamePackages().subscribe(data => this.cardPackageList = data)
    }

    ngOnInit(): void {
        this.gameService.getGamePackages().subscribe((data) => {
        this.data.selectedPackage = this.cardPackageList[0];
        });
      }

    selectCardPackage(cardPackage) {
        this.data.selectedPackage = cardPackage;
    }

    onNoClick() {
        this.dialogRef.close();
    }

}