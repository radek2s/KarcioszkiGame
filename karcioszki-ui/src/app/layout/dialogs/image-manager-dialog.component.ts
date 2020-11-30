import { Component, OnInit } from "@angular/core";
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
    selectedFiles: FileList;
    currentFile: File;
    progress = 0;
    message = '';

    fileInfos: Observable<any>;

    constructor(
        private fileStorageService: FileUploadService,
        public dialog: MatDialog,
        public dialogReference: MatDialogRef<ImageManagerDialog>
    ) { }

    ngOnInit(): void {
        this.fileInfos = this.fileStorageService.getFiles();
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    upload() {
        this.progress = 0;

        this.currentFile = this.selectedFiles.item(0);
        this.fileStorageService.upload(this.currentFile).subscribe(
            event => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progress = Math.round(100 * event.loaded / event.total);
                } else if (event.type === HttpEventType.Sent) {
                    this.message = "File uploaded";
                    this.fileInfos = this.fileStorageService.getFiles();
                }
            },
            err => {
                this.progress = 0;
                // this.message = "Upload failed";
                this.currentFile = undefined;
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