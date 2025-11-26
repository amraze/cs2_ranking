import { Component, signal } from '@angular/core';
import { Sidebar } from "./components/sidebar/sidebar";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SharedImports } from './shared/shared-imports';

@Component({
  selector: 'app-root',
  imports: [Sidebar, RouterOutlet, SharedImports],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showLayout: boolean = true;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showLayout = !this.isAuthRoute(event.url);
    });
  }

  isAuthRoute(url: string): boolean {
    const authRoutes = ['/login', '/signup', '/register', '/auth', '/forgot-password'];
    return authRoutes.some(route => url.includes(route));
  }
}

