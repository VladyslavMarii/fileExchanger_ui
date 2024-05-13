import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from 'src/app/service/file.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-get-file-by-url',
  templateUrl: './get-file-by-url.component.html',
  styleUrl: './get-file-by-url.component.css'
})
export class GetFileByUrlComponent {
  fileInfo: { fileName: string, fileSize: number, filePassword:boolean};
  isPresent: boolean =true;
  password: string;
  hovered: boolean = false;
  hoveredHome:boolean = false;
  isPassword: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private fileService: FileService) { }

  goHome() {
    this.router.navigateByUrl('/');
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const fileUrl = params.get('fileUrl');
      if (fileUrl) {
        this.fileService.getFileInfo(fileUrl).subscribe(response => {
          this.fileInfo = response;
          this.isPassword = this.fileInfo.filePassword;
          this.isPresent = true;
        });
      }
      this.isPresent=false;
    });
  }

  download(): void {
    this.route.paramMap.subscribe(params => {
      const fileUrl = params.get('fileUrl');
      if (fileUrl) {
        this.fileService.downloadFile(fileUrl, this.password).subscribe(response => {
          const blob = response.body;
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = this.fileInfo.fileName;
          link.click();
          window.URL.revokeObjectURL(downloadUrl);   
        });
      }
    });
  }
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
