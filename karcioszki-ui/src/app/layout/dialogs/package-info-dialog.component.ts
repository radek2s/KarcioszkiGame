import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PinValidationDialog } from 'src/app/layout/dialogs/pin-validation-dialog.component';
import { SimpleConfirmDialog } from 'src/app/layout/dialogs/simple-confirm-dialog.component';

@Component({
    selector: 'card-package-info-dialog',
    templateUrl: 'package-info-dialog.html',
    styleUrls: ['../../app.component.scss']
})
export class CardPackageInfoDialog {

    private cardPackage;

    constructor(
        private gameService: GameService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CardPackageInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router
    ) {
        this.cardPackage = data;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    goToEditGamePackage(packageId: number) {
        const dialogReference = this.dialog.open(PinValidationDialog, {
            width: '50%',
            disableClose: true,
            data: this.cardPackage
        });
        dialogReference.afterClosed().subscribe(res => {
            if (res == true) {
                this.router.navigateByUrl(`package-editor/edit/${packageId}`);
                this.dialogRef.close();
            } else {
                this.openSnackBar("Błędny PIN", "Close")
            }
        })

    }

    private deleteGamePackage(packageId: number) {
        const dialogReference = this.dialog.open(PinValidationDialog, {
            width: '50%',
            disableClose: true,
            data: this.cardPackage
        });
        dialogReference.afterClosed().subscribe(res => {
            if (res == true) {
                this.gameService.deleteGamePackage(packageId).then(data => {
                    this.dialogRef.close(packageId)
                    this.openSnackBar("Game Card Deleted", "Close")
                }).catch(err => {
                    this.openSnackBar("Something went wrong!", "Close")
                    console.error(err)
                });
                this.dialogRef.close();
            } else {
                this.openSnackBar("Błędny PIN", "Close")
            }
        })

    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    public openConfirmationDialogDelete(cardPackageId: number) {
        const dialogRef = this.dialog.open(SimpleConfirmDialog, {
            width: '50%',
            data: {
                title: "Czy na pewno chcesz usunąć tę paczkę?",
                message: "",
                btnTextOk: "Tak",
                btnTextCancel: "Nie"
            },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteGamePackage(cardPackageId);
            }
        })
    }
}
