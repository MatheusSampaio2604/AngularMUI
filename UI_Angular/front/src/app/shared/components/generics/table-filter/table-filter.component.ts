import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table-filter',
  standalone: false,
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.css'
})
export class TableFilterComponent {
  @Output() filterChanged = new EventEmitter<string>();

  onKeyUp(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterChanged.emit(value.trim().toLowerCase());
  }
}
