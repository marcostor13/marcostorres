import { ChangeDetectionStrategy, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-ia-vendor',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './ia-vendor.component.html',
    styleUrl: './ia-vendor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IaVendorComponent implements OnInit {
    private renderer = inject(Renderer2);

    ngOnInit(): void {
        // Forzar el fondo del body cuando se carga este componente
        this.renderer.setStyle(document.body, 'background', '#ffffff');
        this.renderer.setStyle(document.documentElement, 'background', '#ffffff');
    }
}
