import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {}
