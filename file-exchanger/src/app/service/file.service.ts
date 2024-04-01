import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, last, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'http://localhost:8080';
  fileSizeUnit: number = 1024;

  constructor(private http: HttpClient) { }
  
  uploadFile(file: File, password: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    return this.http.post<any>(this.apiUrl + '/upload', formData, {
      reportProgress: true,
      observe: 'events',
    });
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