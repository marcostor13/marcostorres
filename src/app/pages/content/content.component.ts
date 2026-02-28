import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export default class ContentComponent {

  private route = inject(ActivatedRoute)
  prompts: string[] = []
  id = this.route.snapshot.params['id']

}
