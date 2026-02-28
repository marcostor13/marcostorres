import { Component, ElementRef, ViewChild } from '@angular/core';
import '@n8n/chat/style.css';
import { ChatService } from '../../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface IMessage {
  message: string
  type: 'local' | 'remote'
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent {

  @ViewChild('chat') chat!: ElementRef

  messages: IMessage[] = [{
    message: 'Hola, ¿cómo puedo ayudarte?',
    type: 'remote'
  }]
  message: string = ''
  response: string = ''
  writing: boolean = false


  constructor(private chatService: ChatService) { }

  sendMessage(message: string) {

    this.writing = true
    this.message = ''
    this.messages.push({ message, type: 'local' })
    setTimeout(() => {
      this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight + 1000
    }, 100)
    this.chatService.sendMessage(message).subscribe((response) => {

      this.messages.push({ message: response.message, type: 'remote' })
      this.response = response.message
      this.writing = false

      setTimeout(() => {
        this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight + 1000
      }, 100)
    });



  }

  formatMessage(message: string) {
    if (message.includes('https://calendly.com/marcostor13/30min')) {
      return `<a href="https://calendly.com/marcostor13/30min" target="_blank">${message}</a>`;
    } else if (message.includes('https://wa.me/51975760418')) {
      return `<a href="https://wa.me/51975760418?text=Hola%20quiero%20hablar%20con%20un%20asesor" target="_blank">${message}</a>`;
    } else {
      return message
    }


  }

  talkNow() {
    window.open('https://wa.me/51975760418?text=Hola%20quiero%20hablar%20con%20un%20asesor', '_blank')
  }

  appointment() {
    window.open('https://calendly.com/marcostor13/30min', '_blank')
  }





}




