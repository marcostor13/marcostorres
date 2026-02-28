import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/endpoints.constant';
import { Observable } from 'rxjs';

interface MessageResponse {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private webhookUrl = Endpoints.backend + '/chat-marcos-torres';


  constructor(
    private http: HttpClient
  ) { }

  sendMessage(message: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.webhookUrl, { message });
  }



}
