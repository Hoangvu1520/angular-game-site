import { CommonModule } from '@angular/common';
import { Component, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() value?: string | null = '';
  @Input() isRequired?: boolean;
  @Input() placeholder: string = '';
  @Input() type?: 'text' | 'password' | 'number' | 'email' | 'phone-number' =
    'text';
  @Input() isRounded?: boolean;

  onInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
  }
}
