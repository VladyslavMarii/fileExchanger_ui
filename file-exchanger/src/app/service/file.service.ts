import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'http://localhost:8080';
  fileSizeUnit: number = 1024;
  public isApiSetup = false;

  constructor(private http: HttpClient) { }
  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }

    return fileSize;
  }

  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = 'bytes';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }


  uploadFile(file: File, password: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    return this.http.post<any>(this.apiUrl + '/upload', formData,{
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round((100 * event.loaded) / event.total);
            return { status: 'progress', message: progress };

          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }

  getFileInfo(fileUrl: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fileInfo/${fileUrl}`);
  }

  getFiles(): Observable<any> {
    return this.http.get<File[]>(this.apiUrl + '/files');
  }


  downloadFile(fileUrl: string, password: string): Observable<HttpResponse<Blob>> {
    const url = `${this.apiUrl}/download/${fileUrl}`;
    const params = new HttpParams().set('password', password); // Include password in query parameters
  
    return this.http.get(url, {
      params: params,
      responseType: 'blob',
      observe: 'response'
    });
  }
  
}