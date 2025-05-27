import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.page.html',
  styleUrls: ['./selector.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class SelectorPage implements OnInit {
   private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }
  goToContent(edad:number):void{
    this.router.navigate(['/home'], {
      state:{
        edad: edad
      }
    });
  }
}
