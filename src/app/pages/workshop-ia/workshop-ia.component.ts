import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
    selector: 'app-workshop-ia',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './workshop-ia.component.html',
    styleUrl: './workshop-ia.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopIaComponent {
    // Signals para estado reactivo
    remainingSpots = signal(5);
    faqOpenStates = signal<Record<number, boolean>>({});

    // Método para alternar FAQ
    toggleFaq(index: number) {
        const currentStates = this.faqOpenStates();
        this.faqOpenStates.set({
            ...currentStates,
            [index]: !currentStates[index]
        });
    }

    // Método para verificar si FAQ está abierto
    isFaqOpen(index: number): boolean {
        return this.faqOpenStates()[index] || false;
    }

    // Datos del taller
    readonly workshopData = {
        title: 'Deja de "Picar Tecla". Domina la IA y Desarrolla 10x Más Rápido en Solo 4 Horas.',
        subtitle: 'Transforma tu flujo de trabajo con técnicas avanzadas de IA que solo conocen los desarrolladores top.',
        originalPrice: 1850,
        currentPrice: 199,
        whatsappUrl: 'https://wa.me/51975760418'
    };

    // Puntos de dolor
    readonly painPoints = [
        '¿Pasas horas escribiendo código repetitivo que la IA podría hacer en minutos?',
        '¿Sientes la presión de aprender nuevas tecnologías mientras mantienes proyectos existentes?',
        '¿Usas ChatGPT o Copilot pero sientes que no aprovechas ni el 20% de su potencial?',
        '¿Ves cómo otros desarrolladores avanzan más rápido mientras tú te quedas atrás?'
    ];

    // Beneficios del taller
    readonly benefits = [
        'Cómo "dialogar" con la IA para obtener código perfecto desde el primer prompt',
        'El arte del "Prompt Engineering" específico para desarrollo de software',
        'Técnicas avanzadas de debugging y optimización con IA',
        'Automatización de tareas repetitivas usando herramientas de IA',
        'Integración de IA en tu flujo de trabajo actual sin interrumpir proyectos',
        'Casos reales de proyectos que se completaron 10x más rápido'
    ];

    // Valor stack
    readonly valueStack = [
        { item: 'Taller en Vivo de 4 Horas (2 Días)', price: 500 },
        { item: 'Acceso a la Grabación del Taller (de por vida)', price: 300 },
        { item: 'Mis Prompts "Maestros" para Desarrollo', price: 200 },
        { item: 'Acceso a la Comunidad Privada de WhatsApp', price: 250 },
        { item: '[BONO #1] Guía "Code Review con IA"', price: 150, bonus: true },
        { item: '[BONO DE ACCIÓN RÁPIDA] 30 Minutos de Asesoría 1-a-1 (Solo 5 cupos)', price: 300, bonus: true }
    ];

    // FAQs
    readonly faqs = [
        {
            question: '¿Qué nivel de desarrollo necesito?',
            answer: 'Ideal para Devs Jr, Mid o Seniors. Si sabes programar, podrás aprovechar al máximo el taller.'
        },
        {
            question: '¿Necesito herramientas específicas?',
            answer: 'Solo necesitas acceso a ChatGPT Plus o Copilot. Te enseñaré a configurar todo paso a paso.'
        },
        {
            question: '¿Qué pasa si no puedo asistir en vivo?',
            answer: 'Tendrás acceso completo a la grabación y podrás hacer preguntas en el grupo privado.'
        },
        {
            question: '¿Hay garantía de resultados?',
            answer: 'Garantía de devolución del 100% si no ves mejoras en tu productividad en las primeras 2 semanas.'
        },
        {
            question: '¿Cuándo es el próximo taller?',
            answer: 'Este es el único taller programado para este mes. Los siguientes serán con precios regulares.'
        }
    ];
}
