import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {}
