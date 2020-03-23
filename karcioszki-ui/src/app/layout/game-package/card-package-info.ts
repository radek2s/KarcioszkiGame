import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'card-package-info-dialog',
    templateUrl: 'card-package-info.html'
})
export class CardPackageInfoDialog {

    private cardPackage;

    constructor(
        public dialogRef: MatDialogRef<CardPackageInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.cardPackage = data;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}