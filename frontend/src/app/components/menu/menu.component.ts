import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule} from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMenuOpen = false;
  currentSection$: Observable<string>;

  constructor(private router: Router) {
    this.currentSection$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getSectionFromUrl(this.router.url))
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private getSectionFromUrl(url: string): string {
    if (url.includes('public') || url.includes('auth')) return 'auth';
    if (url.includes('cliente')) return 'cliente';
    if (url.includes('empregado')) return 'empregado';
    return 'desconhecido';
  }
}
