import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
    selector: 'image-manager-dialog',
    templateUrl: 'image-manager-dialog.html',
    styleUrls: ['../../karcioszki.style.scss']
})
export class ImageManagerDialog implements OnInit {

    selectedImage = {name: null, url: null};
    uploadedImage = {name: null, url: null};
    selectedFiles: FileList;
    currentFile: File;
    progress = 0;
    message = '';

    fileInfos = [];

    constructor(
        private fileStorageService: FileUploadService,
        public dialog: MatDialog,
        public dialogReference: MatDialogRef<ImageManagerDialog>
    ) { }

    ngOnInit(): void {
        for (let x = 1; x <= 12; x++) {
            this.fileInfos.push({
                name: `Sample-${x}`,
                url: `./assets/graphics/sample/${x}.jpg`
            });
        }
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
        this.upload();
    }

    upload() {
        this.progress = 0;

        this.currentFile = this.selectedFiles.item(0);
        this.fileStorageService.upload(this.currentFile).subscribe(
            data => {
                this.uploadedImage = {
                    name: data.filename,
                    url: `${this.fileStorageService.siteLocale}/api/files/${data.filename}`
                };
                this.selectedImage = {
                    name: data.filename,
                    url: `${this.fileStorageService.siteLocale}/api/files/${data.filename}`
                };
            });

        this.selectedFiles = undefined;
    }

    onNoClick(): void {
        this.dialogReference.close();
    }

    selectImage(image) {
        this.selectedImage = image;
    }

}
