import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
