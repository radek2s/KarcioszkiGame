import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = '/api/files';
  public siteLocale;

  constructor(private http: HttpClient) { 
    let locale = window.location.pathname.split('/')[0];
    let protocol = window.location.protocol;
    let host = window.location.host.split(":");
    if(host[1] === "4200") {
      host[1] = "8080";
    };

    if(locale !== '') {
      locale = '';
    } 
    this.siteLocale = `${protocol}//${host[0]}:${host[1]}${locale}`;
    this.baseUrl = this.siteLocale + this.baseUrl;  
    console.log(this.siteLocale, this.baseUrl);
  }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/uploadFile`, formData);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

}
