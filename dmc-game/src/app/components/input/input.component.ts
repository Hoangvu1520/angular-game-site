import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export type InputType = "text" | "email" | "phoneNumber"
export class InputComponent {
  @Input() isRequired?: boolean;
  @Input() placeholderText: string = '';
  @Input() inputType: InputType = 'text';
}
