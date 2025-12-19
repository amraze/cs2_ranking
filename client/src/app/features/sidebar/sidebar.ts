import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  protected expanded: boolean = false;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  protected toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  protected isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  protected setActiveRoute(route: string): void {
    this.router.navigateByUrl(route);
  }

  logout() {
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
      localStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }
}
