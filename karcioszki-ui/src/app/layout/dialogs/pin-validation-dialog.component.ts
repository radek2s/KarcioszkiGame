import { Component, Inject, OnInit } from '@angular/core';
import { CardsPackage } from 'src/app/models/CardsPackage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
    selector: 'pin-validation-dialog',
    template: `
        <h1 mat-dialog-title class="dialog-header">
            <div>Podaj PIN paczki</div>
            <button mat-icon-button id="close-dialog" class="dialog-header-button" (click)="onNoClick()">
                <mat-icon>cancel</mat-icon>
            </button>
        </h1>
        <form [formGroup]="pinForm" autocomplete="off" novalidate>
            <div mat-dialog-content>
                <mat-form-field>
                    <input matInput 
                        placeholder="Numer PIN:" 
                        [(ngModel)]=inputPin
                        formControlName="pin"
                        id="pin">
                    <mat-error *ngIf="hasError('pin', 'required')">Kod PIN jest wymagany!</mat-error>
                </mat-form-field>
            </div>
            <div mat-dialog-actions>
                <button mat-raised-button color="primary" (click)="validatePin()" [disabled]="!pinForm.valid">Zatwierdź</button>
            </div>
        </form>
    `,
    styles: [`
    .dialog-header { display: flex; justify-content: center; position: relative;}
    .dialog-header-button {position: absolute; right: -0.5em; top: -0.5em;}
    .mat-dialog-actions { justify-content: flex-end }
    .mat-form-field { width: 100% }`]
})//TODO - wywalić style i dać -1em, a na komorce -1.8em
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

    private validatePin() {
        if (this.inputPin === this.packageData.pin) {
            this.dialogReference.close(true)
        } else {
            this.dialogReference.close()
        }
    }
    onNoClick(): void {
        this.dialogReference.close();
    }
}
