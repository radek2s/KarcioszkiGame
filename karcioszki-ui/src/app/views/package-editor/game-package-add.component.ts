import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CardsPackage } from '../../models/CardsPackage';
import { PlayerService } from 'src/app/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SimpleInfoDialog } from 'src/app/layout/dialogs/simple-info-dialog.component';
import { ImageManagerDialog } from 'src/app/layout/dialogs/image-manager-dialog.component';


@Component({
  selector: 'page-game-package-add',
  templateUrl: './game-package-add.html',
  host: { '(document:keypress)': 'addCardKeyboard($event)' },
  styleUrls: ['../../karcioszki.style.scss']
})
export class GamePackageAddComponent implements OnInit {

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
    this.cardsPackage.pin = String(Math.round(Math.random() * 10000));
    this.cardsPackage.image = './assets/graphics/default.jpg';
    this.cardsPackage.cards = [];

    this.gameService.getGamePackages().subscribe(cardsPackages => {
      cardsPackages.forEach(cardsPackage => {
        this.cardsPackagesNames.push(cardsPackage.packageName);
      });
    });
  }

  ngOnInit(): void {
    this.packageForm = new FormGroup({
      packageName: new FormControl(this.cardsPackage.packageName, []),
    });

  }

  get packageName() {
    return this.packageForm.get('packageName');
  }

  addCard() {
    if (this.cardsPackage.cards.find(cardTitle => {
      return cardTitle === this.cardTitle;
    })) {
      this.openSnackBar(
        $localize`:@@packageCardExist:Card with that name already exists!`,
        $localize`:@@commonClose:Close`);
    } else {
      this.cardsPackage.cards.push(this.cardTitle);
      this.cardTitle = '';
    }
  }

  addCardKeyboard(event: KeyboardEvent) {
    if (event.code === 'Enter') {
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
          title: $localize`:@@packagePinMessage:Your PIN code for package edit`,
          message: $localize`:@@packagePinSaveMessage:Save this number to access to that package:\n` + this.cardsPackage.pin
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          this.gameService.addGamePackage(this.cardsPackage).then(data => {
            this.cardsPackage = new CardsPackage();
            this.cardTitle = '';
            this.openSnackBar(
              $localize`:@@packageAddSuccess:Success! - Package added!`,
              $localize`:@@commonClose:Close`);
            this.router.navigateByUrl(`package-editor`);
          }).catch(err => {
            this.openSnackBar($localize`:@@commonUnknowError:Something went wrong!`, $localize`:@@commonClose:Close`);
            console.error(err);
          });
        } else {
          this.openSnackBar($localize`:@@commonUnknowError:Something went wrong!`, $localize`:@@commonClose:Close`);
        }
      });
    } else {
      this.openSnackBar(
        $localize`:@@packageValidatorCardCount:Not enough cards in package! Create at least 15 cards.`,
        $localize`:@@commonClose:Close`);
    }

  }

  deleteCard(card) {
    this.cardsPackage.cards = this.cardsPackage.cards.filter(existingCard => card !== existingCard);
  }

  chooseImage() {
    const dialogRef = this.dialog.open(ImageManagerDialog, {width: '60%'});
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
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
