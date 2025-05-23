import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  httpConfig?: string;

  constructor(private _http: HttpClient)
  {

  }

  async ngOnInit():Promise<any> {
    
  }

}
