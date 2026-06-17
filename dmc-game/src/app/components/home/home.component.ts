import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  standalone: true,
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city">
        <button type="button">Search</button>
      </form>
    </section>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  cons
}
