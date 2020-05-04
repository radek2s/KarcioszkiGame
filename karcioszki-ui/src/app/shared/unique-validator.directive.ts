import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { GameService } from '../services/game.service';
import { map } from 'rxjs/operators';



@Directive({
    selector: '[uniqueName]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueNameValidationDirective, multi: true }]
})

export class UniqueNameValidationDirective implements AsyncValidator {

    cardsPackagesNames = [];

    constructor(private cardsPackageService: GameService) {
        this.cardsPackageService.getGamePackages().subscribe(cardsPackages => {
            cardsPackages.forEach(cardsPackage => {
                this.cardsPackagesNames.push(cardsPackage.packageName);
            });
        });
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return new Promise<ValidationErrors | null>((resolve, reject) => {
            if (this.cardsPackagesNames.find(function (e) {
                return e === control.value
            })) {
                resolve({ 'uniqueName': true })
            }
        });
    };
}