import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contfree',
  templateUrl: './contfree.page.html',
  styleUrls: ['./contfree.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class ContfreePage {
  subjects;
  constructor(private router: Router) {
    this.subjects = [
      {
        titulo: 'Tu lugar seguro',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/1_TULUGARSEGURO.mp3'
      },
    ]
  }
  ngOnInit() {
  }
goToAudio1() {
  this.router.navigate(['/reproductor'], {
    queryParams: {
      img: 'assets/prepara.jpg',
      titulo: 'Prepara tu día',
      audio: 'https://aliiivio.com/audiossr/preparandotudia.mp3'
    }
  });
}
goToAudio2() {
  this.router.navigate(['/reproductor'], {
    queryParams: {
      img: 'assets/cierra.jpg',
      titulo: 'Cierra tu día',
      audio: 'https://aliiivio.com/audiossr/cierratudia.mp3'
    }
  });
}
}
