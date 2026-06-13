import { Component, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

export type InputType = "text" | "email" | "phoneNumber"

@Component({
  selector: 'app-input',
  standalone:true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})

export class InputComponent {
  @Input() isRequired?: boolean;
  @Input() placeholderText: string = '';
  @Input() inputType: InputType = 'text';

  public value: any;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private renderer:Renderer2, public ngControl: NgControl){
    
  }
}
