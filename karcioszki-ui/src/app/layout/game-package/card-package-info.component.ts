import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'card-package-info-dialog',
    templateUrl: 'card-package-info.html',
    styleUrls: ['../../app.component.scss']
})
export class CardPackageInfoDialog {

    private cardPackage;

    constructor(
        private gameService: GameService,
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<CardPackageInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
            this.cardPackage = data;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    goToEditGamePackage(packageId: number) {
        this.router.navigateByUrl(`ui/gamePackage/edit/${packageId}`);
        this.dialogRef.close();
    }
    
    deleteGamePackage(packageId: number) {
        this.gameService.deleteGamePackage(packageId).then(data => {
            this.openSnackBar("Game Card Deleted", "Close")
        }).catch(err => {
            this.openSnackBar("Something went wrong!", "Close")
            console.error(err)
        });
        this.dialogRef.close();
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
}