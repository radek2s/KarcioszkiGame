import { Component, Inject, OnInit } from '@angular/core';
import { CardsPackage } from 'src/app/models/CardsPackage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
    selector: 'pin-validation-dialog',
    template: `
    <h1 mat-dialog-title class="dialog-header">
    <button class="dialog-header-button" mat-icon-button id="close-dialog" (click)="onNoClick()">
        <mat-icon>cancel</mat-icon>
    </button>
            <div i18n="@@packagePinTitle">Enter package PIN number</div>
        </h1>
        <form [formGroup]="pinForm" autocomplete="off" novalidate>
            <div mat-dialog-content>
                <mat-form-field>
                    <input matInput
                        i18n-placeholder="@@packagePin"
                        placeholder="PIN number:"
                        [(ngModel)]=inputPin
                        formControlName="pin"
                        id="pin">
                    <mat-error *ngIf="hasError('pin', 'required')" i18n="@@packagePinRequierd">PIN number is required!</mat-error>
                </mat-form-field>
            </div>
            <div mat-dialog-actions>
                <button mat-raised-button color="primary" (click)="validatePin()" [disabled]="!pinForm.valid" i18n="@@commonAccept">Accept</button>
            </div>
        </form>
    `,
    styleUrls: ['../../karcioszki.style.scss']
})
export class PinValidationDialog implements OnInit {

    inputPin: string;
    public pinForm: FormGroup;

    constructor(public dialogReference: MatDialogRef<PinValidationDialog>, @Inject(MAT_DIALOG_DATA) public packageData: CardsPackage) { }

    ngOnInit() {
        this.pinForm = new FormGroup({
            pin: new FormControl('', Validators.required),
        });
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.pinForm.controls[controlName].hasError(errorName);
    }

    public validatePin() {
        if (this.inputPin === this.packageData.pin) {
            this.dialogReference.close(true);
        } else {
            this.dialogReference.close();
        }
    }
    onNoClick(): void {
        this.dialogReference.close();
    }
}
