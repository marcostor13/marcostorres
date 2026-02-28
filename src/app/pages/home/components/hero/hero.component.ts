import { Component, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit, OnDestroy {
  displayedText = signal('');
  
  private fullText = 'Desarrollo de Software de Alta Velocidad | Soluciones de IA | Academia 20X';
  private typingSpeed = 50;
  private timer: any;

  ngOnInit() {
    this.startTyping();
  }

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  startTyping() {
    let index = 0;
    const type = () => {
      if (index < this.fullText.length) {
        this.displayedText.update(text => text + this.fullText.charAt(index));
        index++;
        this.timer = setTimeout(type, this.typingSpeed);
      }
    };
    type();
  }
}
