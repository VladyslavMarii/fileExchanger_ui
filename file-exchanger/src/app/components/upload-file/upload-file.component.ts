import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { FileService } from 'src/app/service/file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  error: string;
  selectedFiles: File[] = [];
  password: string = '';
  uploadData: [string, string][] = [];
  isUploading: boolean = false;

  constructor(private fileUploadService: FileService) {
    this.setupDragDropListeners();
  }

  uploadProgress: { [fileName: string]: { status: string, message: number } } = {};

  
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


  // uploadFile(currentFile: File): void {
  //   if (currentFile) {
  //     this.isUploading = true;
  //     this.fileUploadService.uploadFile(currentFile, this.password)
  //       .pipe(
  //         catchError(error => {
  //           console.error("Error uploading file:", error);
  //           this.isUploading = false;
  //           return of(null);
  //         }),
  //         map(response => {
            
  //           if (response && response.message) {
  //             return [currentFile.name, response.message] as [string, string]; // Create tuple with file name and response message

  //           } else {
  //             console.error("Invalid response format:", response);
  //             return null;
  //           }
  //         })
  //       )
  //       .subscribe(data => {
  //         if (data) {
  //           this.uploadData.push(data); // Push tuple to array
  //         }
  //         this.selectedFiles = [];
  //         this.isUploading = false;
  //         console.log(data);
  //       });
  //   }
  // }
  uploadData1: { fileName: string, response: string }[] = [];
  uploadProgress1: { [key: string]: { status: string, message: number } } = {};

  uploadFile(currentFile: File): void {
    if (currentFile) {
      this.isUploading = true;
      this.fileUploadService.uploadFile(currentFile, this.password)
        .pipe(
          catchError(error => {
            console.error("Error uploading file:", error);
            this.isUploading = false;
            return of(null);
          }),
          map(event => {
            if (event.type === HttpEventType.UploadProgress) {
              // Handle upload progress
              const progress = Math.round((100 * event.loaded) / event.total);
              this.uploadProgress1[currentFile.name] = { status: 'progress', message: progress };
            } else if (event instanceof HttpResponse) {
              // Handle response from backend
              if (event.body && event.body.message) {
                this.uploadData1.push({ fileName: currentFile.name, response: event.body.message });
              } else {
                console.error("Invalid response format:", event.body);
              }
            } else {
              console.error("Unhandled event type:", event);
            }
            return event;
          })
        )
        .subscribe(() => {
          this.selectedFiles = [];
          this.isUploading = false;
        });
    }
  }
}
