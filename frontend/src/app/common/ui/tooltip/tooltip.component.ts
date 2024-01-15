import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  tooltip: string = ''
  left: number = 0
  top: number = 0

  constructor() {
  }

  ngOnInit(): void {
  }
}
