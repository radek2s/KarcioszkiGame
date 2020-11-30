import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';
import { PlayerService } from 'src/app/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { SimpleInfoDialog } from 'src/app/layout/dialogs/simple-info-dialog.component';
import { ImageManagerDialog } from 'src/app/layout/dialogs/image-manager-dialog.component';


@Component({
  selector: 'page-game-package-add',
  templateUrl: './game-package-add.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)' },
  styleUrls: ['../../karcioszki.style.scss']
})
export class GamePackageAddComponent {

  cardsPackage: CardsPackage;
  cardTitle: string;
  packageForm: FormGroup;
  cardsPackages: CardsPackage[];

  cardsPackagesNames = [];

  constructor(
    private gameService: GameService,
    private _snackBar: MatSnackBar,
    public playerService: PlayerService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog) {
    this.cardsPackage = new CardsPackage();
    this.cardsPackage.pin = String(Math.round(Math.random() * 10000))
    this.cardsPackage.cards = [];

    this.gameService.getGamePackages().subscribe(cardsPackages => {
      cardsPackages.forEach(cardsPackage => {
        this.cardsPackagesNames.push(cardsPackage.packageName);
      });
    });
  }

  ngOnInit(): void {
    this.packageForm = new FormGroup({
      'packageName': new FormControl(this.cardsPackage.packageName, []),
    });

  }

  get packageName() {
    return this.packageForm.get('packageName');
  }

  addCard() {
    if (this.cardsPackage.cards.find(cardTitle => {
      return cardTitle === this.cardTitle
    })) {
      this.openSnackBar("Karta o tej nazwie już została dodana", "Zamknij")
    } else {
      this.cardsPackage.cards.push(this.cardTitle);
      this.cardTitle = "";
    }
  }

  addCardKeyboard(event: KeyboardEvent) {
    if (event.code === "Enter") {
      this.addCard();
    }
  }

  createGamePackage() {
    this.cardsPackage.author = this.playerService.getPlayer().name.toString();
    if (this.cardsPackage.cards.length >= 15) {
      const dialogRef = this.dialog.open(SimpleInfoDialog, {
        width: '50%',
        disableClose: true,
        data: {
          title: "Twój pin do edycji paczki",
          message: "Zapisz kod aby móc edytować paczkę:\n " + this.cardsPackage.pin
        }
      })
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          this.gameService.addGamePackage(this.cardsPackage).then(data => {
            this.cardsPackage = new CardsPackage();
            this.cardTitle = "";
            this.openSnackBar("Sukces! - Paczka została dodana!", "Zamknij")
            this.router.navigateByUrl(`package-editor`);
          }).catch(err => {
            this.openSnackBar("Coś poszło nie tak!", "Zamknij")
            console.error(err)
          });
        } else {
          this.openSnackBar("Coś poszło nie tak!", "Zamknij")
        }
      })
    } else {
      this.openSnackBar("Za mało kart w paczce! Musi być minimum 15.", "Zamknij")
    }

  }

  deleteCard(card) {
    this.cardsPackage.cards = this.cardsPackage.cards.filter(existingCard => card !== existingCard);
  }

  chooseImage() {
    const dialogRef = this.dialog.open(ImageManagerDialog, {width: '60%'});
    dialogRef.afterClosed().subscribe(result => {
      if(!!result) {
        this.cardsPackage.image = result.url;
      }
    });
  }

  public toggle(event: MatSlideToggleChange) {
    this.cardsPackage.visible = event.checked;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
