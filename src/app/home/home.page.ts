import { Component, inject, EnvironmentInjector } from '@angular/core';
import { UserService } from '../services/user.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { NgIf, NgFor} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  IonAvatar,
  IonLabel

} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    RouterLink,
    IonLabel
  ]
})
export class HomePage {
  edad: number | null = null;
  subjectsmenor;
  subjectsmayor;
  audioscalmatuansiedad20;
  audiosnecesitoayuda20;
  entrenaminetosmayor;
  entrenaminetosmenor
  private injector = inject(EnvironmentInjector);
  private auth = inject(Auth);
  private userService = inject(UserService);

  constructor(private router: Router) {
    this.injector.runInContext(() => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          const userData: any = await this.userService.getUserData(user.uid);
          if (userData?.fechaNacimiento) {
            const nacimiento = new Date(userData.fechaNacimiento);
            this.edad = this.calcularEdad(nacimiento);
          }
        }
      });
    });
    this.subjectsmenor = [
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/1_sacalo.jpg',
        titulo: 'Sácalo',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/SACALO.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/2_tus_emociones.jpg',
        titulo: 'Tus emociones',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/TUS_EMOCIONES.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/3_alerta.jpg',
        titulo: 'Alerta',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/ALERTA.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/4_alivio.jpg',
        titulo: 'Alivio',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/ALIVIO.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/5_tu_puedes.jpg',
        titulo: 'Tu puedes',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/TU_PUEDES.mp3'
      },
    ];
    this.subjectsmayor= [
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/1_catarsis_selectiva.jpg',
        titulo: 'Catarsis selectiva',
        route: '/audio-player',
        rutaauido: 'https://aliiivio.com/audios_independientes/audios_independientes_21/CATARSIS_SELECTIVA.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/2_control_emocional.jpg',
        titulo: 'Control emocional',
        route: '/audio-player',
        rutaauido: 'https://aliiivio.com/audios_independientes/audios_independientes_21/AUTORREGULACION_EMOCIONAL.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/3_alerta_saludable.jpg',
        titulo: 'Alerta saludable',
        route: '/audio-player',
        rutaauido: 'https://aliiivio.com/audios_independientes/audios_independientes_21/ALERTA_SALUDABLE.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/4_dolor_alivio.jpg',
        titulo: 'Dolor y alivio',
        route: '/audio-player',
        rutaauido: 'https://aliiivio.com/audios_independientes/audios_independientes_21/DOLOR_Y_ALIVIO.mp3'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/5_estres_adaptativo.jpg',
        titulo: 'Estres Adaptativo',
        route: '/audio-player',
        rutaauido: 'https://aliiivio.com/audios_independientes/audios_independientes_21/ESTRES_ADAPTATIVO.mp3'
      }
    ];
    this.entrenaminetosmayor =[
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        name: 'Calma tu ansiedad',
        route: '/entrenamientos/audioplayer'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        name: 'Entrenamiento necesito ayuda',
        route: '/entrenamientos/'
      }
    ]
    this.entrenaminetosmenor=[
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        name: 'Calma tu ansiedad',
        route: '/audio-playerent',
        bandera: ''
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        name: 'Entrenamiento necesito ayuda',
        route: '/audio-playerent',
        bandera: ''
      }
    ]
    //=============== Audios de necesito ayuda menor de 20 años ===============================
    this.audiosnecesitoayuda20 = [
      {
        titulo: 'Tu lugar seguro',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/1_TULUGARSEGURO.mp3'
      },
      {
        titulo: 'Acomodando tus emociones',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/2_ACOMODANDOTUSEMOCIONES.mp3'
      },
      {
        titulo: 'La voz de tu cuerpo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/3_LAVOZDETUCUERPO.mp3'
      },
      {
        titulo: 'Encuentra una salida',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/5_ENCUENTRAUNASALIDA.mp3'
      },
      {
        titulo: 'Caritas',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/7_CARITAS.mp3'
      },
      {
        titulo: 'Curando a tu peluche',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/9_CURANDOATUPELUCHE.mp3'
      }
    ];
     
    this.audioscalmatuansiedad20 = [
      {
        titulo : '',
        img : '',
        rutaaudio : ''
      }
    ]
  }
  goToSubject()
  {
  }
  goToAudio(subject: any) {
    this.router.navigate([subject.route], {
      queryParams: {
        img: subject.img,
        titulo: subject.titulo,
        audio: subject.rutaaudio
      }
    });
  }
  goToAudioentrenamiento(item: any) {
    let playlist:any[] = [];
  
    if (item.name === 'Calma tu ansiedad') {
      playlist = this.audioscalmatuansiedad20;
    } else if (item.name === 'Entrenamiento necesito ayuda') {
      playlist = this.audiosnecesitoayuda20;
    }
  
    const currentAudio = playlist[0]; // El primero de la lista
  
    this.router.navigate(['/audio-playerent'], {
      state: {
        currentAudio,
        playlist,
      }
    });
  }
  calcularEdad(nacimiento: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
