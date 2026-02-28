import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselItem } from '../../../interfaces/carousel-item.interface';

@Component({
    selector: 'app-text-carousel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './text-carousel.component.html',
    styleUrls: ['./text-carousel.component.scss']
})
export class TextCarouselComponent implements OnInit {
    items: CarouselItem[] = [
        {
            id: 1,
            title: 'Procesamiento Automático de Facturas',
            description: 'Reducción del 85% en tiempo de procesamiento usando OCR e IA para extraer y validar datos de facturas'
        },
        {
            id: 3,
            title: 'Automatización de Reclamos de Seguros',
            description: 'Procesamiento automático del 70% de reclamos simples, reduciendo tiempo de respuesta de días a minutos'
        },
        {
            id: 4,
            title: 'Control de Calidad Visual',
            description: 'Detección automática de defectos en líneas de producción con precisión del 99% usando visión artificial'
        },
        {
            id: 5,
            title: 'Gestión de Inventario Inteligente',
            description: 'Optimización automática de niveles de stock reduciendo costos de almacenamiento en un 30%'
        },
        {
            id: 6,
            title: 'Clasificación de Documentos',
            description: 'Categorización automática de documentos corporativos con 97% de precisión, ahorrando 100 horas/mes'
        },
        {
            id: 7,
            title: 'Pronóstico de Demanda',
            description: 'Predicción de ventas con 92% de precisión para optimización de inventario y producción'
        },
        {
            id: 9,
            title: 'Automatización de Nómina',
            description: 'Procesamiento automático de nóminas reduciendo errores en un 99% y tiempo de proceso en 75%'
        },
        {
            id: 10,
            title: 'Optimización de Rutas Logísticas',
            description: 'Reducción del 25% en costos de combustible mediante IA para planificación de rutas'
        },
        // Agentes de IA
        {
            id: 11,
            title: 'Asistente Virtual de RRHH',
            description: 'Resolución automática del 80% de consultas de empleados 24/7, mejorando satisfacción laboral'
        },
        {
            id: 12,
            title: 'Agente de Soporte Técnico',
            description: 'Resolución del 75% de tickets de nivel 1 sin intervención humana, respuesta inmediata 24/7'
        },
        {
            id: 13,
            title: 'Asistente de Ventas IA',
            description: 'Incremento del 40% en conversión mediante recomendaciones personalizadas en tiempo real'
        },
        {
            id: 14,
            title: 'Agente de Compliance',
            description: 'Monitoreo continuo de transacciones detectando el 99% de operaciones sospechosas'
        },
        {
            id: 15,
            title: 'Asistente Legal IA',
            description: 'Análisis automático de contratos reduciendo tiempo de revisión en 85% y mejorando precisión'
        },
        {
            id: 16,
            title: 'Agente de Reclutamiento',
            description: 'Evaluación automática de CVs reduciendo tiempo de selección en 70% y mejorando matches'
        },
        {
            id: 17,
            title: 'Asistente de Investigación',
            description: 'Análisis de datos científicos reduciendo tiempo de investigación en 60% con mayor precisión'
        },
        {
            id: 19,
            title: 'Asistente de Marketing',
            description: 'Optimización automática de campañas aumentando ROI en 45% mediante análisis en tiempo real'
        },
        {
            id: 20,
            title: 'Agente de Atención al Cliente',
            description: 'Resolución del 85% de consultas básicas con 98% de satisfacción del cliente'
        }
    ];

    currentIndex = 0;
    itemsPerPage = 1;
    visibleItems: CarouselItem[] = [];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    @HostListener('window:resize')
    onResize() {
        if (isPlatformBrowser(this.platformId)) {
            this.updateItemsPerPage();
            this.updateVisibleItems();
        }
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.updateItemsPerPage();
            this.updateVisibleItems();
            this.startAutoSlide();
        } else {
            // En el servidor, usar valores por defecto
            this.itemsPerPage = 1;
            this.updateVisibleItems();
        }
    }

    private updateItemsPerPage(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.itemsPerPage = window.innerWidth >= 1280 ? 4 : 1;
        }
    }

    private updateVisibleItems(): void {
        const visibleItems: CarouselItem[] = [];
        for (let i = 0; i < this.itemsPerPage; i++) {
            const index = (this.currentIndex + i) % this.items.length;
            visibleItems.push(this.items[index]);
        }
        this.visibleItems = visibleItems;
    }

    private startAutoSlide(): void {
        if (isPlatformBrowser(this.platformId)) {
            setInterval(() => {
                this.next();
            }, 5000);
        }
    }

    prev(): void {
        this.currentIndex = this.currentIndex === 0
            ? this.items.length - this.itemsPerPage
            : this.currentIndex - 1;
        this.updateVisibleItems();
    }

    next(): void {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateVisibleItems();
    }
} 