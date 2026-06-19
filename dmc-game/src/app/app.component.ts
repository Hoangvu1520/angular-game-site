import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/Layout';
import { HeaderComponent } from './components/Layout';
import { HomeComponent } from './pages/home/home.component';
import { WishList } from './shared/models/wishList';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HomeComponent, CommonModule],
  templateUrl: './app.component.html',
//   template:`
//   <main>
//     <header class="brand-name">
//       <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true">
//     </header>
//     <section class="content">
//       <app-home></app-home>
//     </section>
//   </main>
// `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  items: WishList[] = []
  title = 'Home';
}
