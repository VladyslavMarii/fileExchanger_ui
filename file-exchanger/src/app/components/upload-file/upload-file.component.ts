import { HttpEventType, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Component} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { catchError, last, map, of, tap } from 'rxjs';
import { FileService } from 'src/app/service/file.service';
import {Clipboard} from '@angular/cdk/clipboard';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent {
  error: string;
  selectedFiles: File[] = [];
  password: string = '';
  uploadData: [string, string][] = [];
  isUploading: boolean = false;
  passwrodVisibility: boolean = false;
  isPasswordVisible: boolean = false;
  downloadInputValue: string = '';

  constructor(private fileUploadService: FileService, private clipboard: Clipboard) {
    this.setupDragDropListeners();
  }
  uploadProgress: { [fileName: string]: { status: string, message: string | number } } = {};
  togglePasswordVisibility() {
    this.passwrodVisibility = !this.passwrodVisibility;
    if(!this.passwrodVisibility){
      this.isPasswordVisible=false;
      this.password='';
    }
  }


  redirectToAnotherPage() {
    if(this.downloadInputValue != ''){
      window.location.href = 'http://localhost:4200/download/' + this.downloadInputValue;
    }
  }
  changePasswordInputVisibleState(){
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  showPasswordVisibility():boolean{
    return this.passwrodVisibility;
  }
  
  setupDragDropListeners(): void {
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFiles = Array.from(files);
        this.error = ''; // Clear any previous error message
      }
    });
  }

  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFiles = Array.from(fileList);
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.selectedFiles = Array.from(files);
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.uploadFile(this.selectedFiles[i]);
      }
    }
  }




  uploadFile(currentFile: File): void {
    // if(this.uploadProgress[currentFile.name].message=100){

    // }
    if (currentFile) {
      this.isUploading = true;
      this.fileUploadService.uploadFile(currentFile, this.password)
        .pipe(
          catchError(error => {
            console.error("Error uploading file:", error);
            this.isUploading = false;
            return of(null);
          }),
          tap(event => {
            if (event.type === 0) {
              console.log('Request started');
              // Handle request start event
            } else if (event.type === 1) {
              console.log('Upload progress:', event.loaded, '/', event.total);
              // Handle upload progress event
              const progress = Math.round((90 * event.loaded) / event.total);
              this.uploadProgress[currentFile.name] = { status: 'progress', message: progress };
              console.log(progress)
            } else if (event instanceof HttpResponse) {
              console.log('Response received:', event);
              // Handle response event
              if (event.body && event.body.message) {
                this.uploadData.push([currentFile.name, event.body.message]);
              } else {
                console.error("Invalid response format:", event.body);
              }
            } 
          }),
          
        )
        .subscribe(
          () => {},
          (error) => {
            console.error("Error uploading file:", error);
            this.isUploading = false;
          },
          () => {
            this.uploadProgress[currentFile.name] = { status: 'progress', message: 100 };
            this.isUploading = false; // Set uploading status to false when the observable completes
          }
        );
    }
  }
  copyToClipboard(text: string): void {
    this.clipboard.copy(text);
  }
}
