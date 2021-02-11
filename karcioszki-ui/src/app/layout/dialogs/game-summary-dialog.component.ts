import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'game-summary-dialog',
    templateUrl: './game-summary-dialog.html',
    styleUrls: ['./game-summary-dialog.scss']
})
export class GameSummaryDialog {

    victoryLabel = '';
    victoryBackground = '';

    constructor(
        public dialogReference: MatDialogRef<GameSummaryDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if ((data.winner === 2 && data.activeTeam === 0)
            || (data.winner === 3 && data.activeTeam === 1)) {
            this.victoryLabel = $localize`:@@summaryWin:Victory!`;
        } else {
            this.victoryLabel = $localize`:@@summaryLose:Defeat`;
        }
        if (data.winner === 2) {
            this.victoryBackground = 'red';
        } else if (data.winner === 3) {
            this.victoryBackground = 'blue';
        } else {
            this.victoryBackground = 'black';
        }
    }

    onNoClick(): void {
        this.dialogReference.close();
    }
}
