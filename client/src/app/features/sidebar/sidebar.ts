import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  protected expanded: boolean = false;
  constructor(private router: Router) { }

  protected toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  protected isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  protected setActiveRoute(route: string): void {
    this.router.navigateByUrl(route);
  }
}
