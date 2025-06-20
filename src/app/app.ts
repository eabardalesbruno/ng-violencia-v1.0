import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./shared/components/sidebar/sidebar";
import { Header } from "./shared/components/header/header";
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar,  Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ng-violencia-v1';

constructor() {
  setTheme('bs5');
   console.log('App component initialized');

  }


}
