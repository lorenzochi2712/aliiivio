import { Component, inject, EnvironmentInjector } from '@angular/core';
import { UserService } from '../services/user.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { NgIf, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { settingsOutline, arrowBackOutline } from 'ionicons/icons';
import { AlertController, IonAlert } from '@ionic/angular/standalone';
import { ViewChild } from '@angular/core';
import { signOut } from 'firebase/auth'; // Asegúrate de importar signOut
import { NavController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton, IonIcon,
  IonPopover, IonList,
  IonContent,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  IonAvatar,
  IonLabel

} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonItem, IonButtons, IonBackButton, IonButton, IonIcon, IonPopover, IonList,
    NgIf,
    NgFor,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonLabel
  ]
})
export class HomePage {
  edad: number | null = null;
  subjectsmenor;
  subjectsmayor;
  audioscalmatuansiedad20;
  audiosnecesitoayuda20;
  audioscalmatuansiedad21;
  audiosnecesitoayuda21;
  entrenamientosmayor;
  entrenaminetosmenor
  private injector = inject(EnvironmentInjector);
  private auth = inject(Auth);
  private userService = inject(UserService);

  constructor(private alertController: AlertController, private router: Router, private navCtrl: NavController) {
    addIcons({ settingsOutline, arrowBackOutline });
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { edad?: number };

    if (state.edad !== undefined) {
      this.edad = state.edad;
    } else {
      // Si no se recibe edad, puedes redirigir a selector o mostrar error
      this.router.navigate(['/selector']);
    }
    //================Audios independientes menor de 20 años ====================
    this.subjectsmenor = [
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/5MINUTOS1HORA.jpg',
        titulo: '5 MINUTOS UNA HORA DE DESCANSO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/5MINUTOSUNAHORA.mp3',
        //Falta link de audio
        descripcion: 'DATE 5 MINUTOS SIÉNTETE COMO SI HUBIERAS DESCANSADO DORMIDO 1 HORA'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/ACUERDOCONTUVIDA.jpg',
        titulo: 'ACUERDO CON TU VIDA PARA NIÑOS',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/ACUERDOCONTUVIDA.mp3',
        descripcion: 'EN LO DIFÍCIL ENCUENTRA UN MOTIVO PARA SEGUIR ADELANTE'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/1_sacalo.jpg',
        titulo: 'SÁCALO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/SACALO.mp3',
        descripcion: 'DALE SALIDA A LO MAL QUE TE SIENTES Y DESCANSA'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/2_tus_emociones.jpg',
        titulo: 'TUS EMOCIONES',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/TUS_EMOCIONES.mp3',
        descripcion: 'APRENDE A SENTIRTE CON CADA EMOCIÓN EN SU LUGAR'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/3_alerta.jpg',
        titulo: 'ALERTA',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/ALERTA.mp3',
        descripcion: 'APRENDE A ESTAR EN EQUILIBRIO SALUDABLE CON TODO Y A PESAR DE TODO'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/4_alivio.jpg',
        titulo: 'ALIVIO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/ALIVIO.mp3',
        descripcion: 'CONTROLA CUALQUIER TIPO DE DOLOR QUE TENGAS'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/5_tu_puedes.jpg',
        titulo: 'TÚ PUEDES',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/TU_PUEDES.mp3',
        descripcion: 'APRENDE A LOGRAR TUS METAS CON ESFUERZO SALUDABLE'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/escuchandotucuerpo.jpg',
        titulo: 'LA VOZ DE TU CUERPO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_20/lavosdetucuerpo.mp3',
        descripcion: 'ESCUCHA A TU CUERPO Y LO PODRAS QUERER Y CUIDAR MEJOR'
      },
      {
        img: 'assets/prepara.jpg',
        titulo: 'PREPARA TU DÍA',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audiossr/preparandotudia.mp3',
        descripcion: ''
      },
      {
        img: 'assets/cierra.jpg',
        titulo: 'CIERRA TU DÍA',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audiossr/cierratudia.mp3',
        descripcion: ''
      }
    ];
        //================Audios independientes mayor de 21 años ====================
    this.subjectsmayor = [
            {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/5MINUTOS1HORA.jpg',
        titulo: '5 MINUTOS UNA HORA DE DESCANSO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/5MINUTOSUNAHORA.mp3',
        //Falta link de audio
        descripcion: 'DATE 5 MINUTOS SIÉNTETE COMO SI HUBIERAS DESCANSADO DORMIDO 1 HORA'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/ACUERDOCONTUVIDA.jpg',
        titulo: 'ACUERDO CON TU VIDA PARA NIÑOS',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/ACUERDOCONTUVIDA.mp3',
        descripcion: 'EN LO DIFÍCIL ENCUENTRA UN MOTIVO PARA SEGUIR ADELANTE'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/1_catarsis_selectiva.jpg',
        titulo: 'CATARSIS SELECTIVA',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_21/CATARSIS_SELECTIVA.mp3',
        descripcion: 'SIENTE UN DESAHOGO EMOCIONAL QUE TE HACE SENTIR MEJOR E INCLUSO DORMIR MEJOR'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/2_control_emocional.jpg',
        titulo: 'CONTROL EMOCIONAL',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_21/AUTORREGULACION_EMOCIONAL.mp3',
        descripcion: 'DESENREDA TUS EMOCIONES Y MEJORA TU ESTABILIDAD EMOCIONAL'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/3_alerta_saludable.jpg',
        titulo: 'ALERTA SALUDABLE',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_21/ALERTA_SALUDABLE.mp3',
        descripcion: 'APRENDE A ESTAR ALERTA CUANDO LO NECESITES, PERO TAMBIÉN RECUPERA TU EQUILIBRIO'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/4_dolor_alivio.jpg',
        titulo: 'DOLOR Y ALIVIO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_21/DOLOR_Y_ALIVIO.mp3',
        descripcion: 'DESARROLLA HABILIDADES PARA CONTROLAR TU DOLOR FÍSICO, EMOCIONAL O RELACIONAL'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/5_estres_adaptativo.jpg',
        titulo: 'ESTRÉS ADAPTATIVO',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_21/ESTRES_ADAPTATIVO.mp3',
        descripcion: 'CONTROLA TU ESTRÉS Y RECUPERA TU CAPACIDAD NATURAL PARA DISFRUTAR DE TU VIDA'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/2_lavozdetucuerpo.jpg',
        titulo: 'LA VOZ DE TU CUERPO',
        route: '/audio-player',
        //Hay que revisar aqui el audio en cpanel
        rutaaudio: 'https://aliiivio.com/audios_independientes/audios_independientes_21/3_LAVOZDETUCUERPO.mp3',
        descripcion: 'APRENDE A ESCUCHAR A TU CUERPO PARA RECUPERAR TU BIENESTAR FISICO Y EMOCIONAL'
      },
      {
        img: 'assets/prepara.jpg',
        titulo: 'PREPARA TU DÍA',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audiossr/preparandotudia.mp3',
        descripcion: ''
      },
      {
        img: 'assets/cierra.jpg',
        titulo: 'CIERRA TU DÍA',
        route: '/audio-player',
        rutaaudio: 'https://aliiivio.com/audiossr/cierratudia.mp3',
        descripcion: ''
      }
    ];
        //================Entrenamientos mayor de 20 años ====================
    this.entrenamientosmayor = [
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        name: 'Calma tu ansiedad',
        route: '/audio-playerent'
      },
      {
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        name: 'Necesito ayuda',
        route: '/audio-playerent'
      }
    ]
        //================Entrenmientos menor de 20 años ====================
    this.entrenaminetosmenor = [
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
    //=============== Audios de ENTRENAMIENTOS menor de 20 años ===============================
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
        titulo: 'El cuento de solución',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/4_ELCUENTODESOLUCION.mp3'
      },
      {
        titulo: 'Encuentra una salida',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/5_ENCUENTRAUNASALIDA.mp3'
      },
      {
        titulo: 'Emociones que curan',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/6_EMOCIONESQUECURAN.mp3'
      },
      {
        titulo: 'Caritas',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/7_CARITAS.mp3'
      },
      {
        titulo: 'Tu miedo amigo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/8_TUMIEDOAMIGO.mp3'
      },
      {
        titulo: 'Curando a tu peluche',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/9_CURANDOATUPELUCHE.mp3'
      },
      {
        titulo: 'Cada cosa en su lugar',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/necesitoayuda/10_CADACOSAENSULUGAR.mp3'
      }
    ];

    this.audioscalmatuansiedad20 = [
      {
        titulo: 'Espacio protegido',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/1_ESPACIOPROTEGIDO.mp3'
      },
      {
        titulo: 'Tus emociones',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/2_TUSEMOCIONES.mp3'
      },
      {
        titulo: 'Escuchando a tu cuerpo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/3_ESCUCHANDOATUCUERPO.mp3'
      },
      {
        titulo: 'El cuento de los animalitos',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/4_ELCUENTODELOSANIMALITOS.mp3'
      },
      {
        titulo: 'Saliendo del laberinto',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/5_SALIENDODELLABERINTO.mp3'
      },
      {
        titulo: 'Emociones aliviadas',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/6_EMOCIONESALIVIADAS.mp3'
      },
      {
        titulo: 'Carita feliz',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/7_CARITAFELIZ.mp3'
      },
      {
        titulo: 'Domador de miedos',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/8_DOMADORDEMIEDOS.mp3'
      },
      {
        titulo: 'Emociones curativas',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/9_CURANDOATUPELUCHE.mp3'
      },
      {
        titulo: 'Reacomodando',
        img: 'https://aliiivio.com/img_entrenamientos/portadas20/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/menor20/calmatuansiedad/10_REACOMODANDO.mp3'
      },
    ]

    //=============== Audios de ENTRENAMIENTOS mayor de 20 años ===============================
    this.audiosnecesitoayuda21 = [
      {
        titulo: 'El acuerdo con tu vida',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/1_ELACUERDOCONAYUDA.mp3'
      },
      {
        titulo: 'Desapego emocional',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/2_DESAPEGOEMOCIONAL.mp3'
      },
      {
        titulo: 'La voz de tu cuerpo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/6LAVOZDETUCUERPOM20.mp3'
      },
      {
        titulo: 'Un lugar para cada cosa',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/4_UNLUGARPARACADACOSA.mp3'
      },
      {
        titulo: 'Salto creativo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/5_SALTOCREATIVO.mp3'
      },
      {
        titulo: 'Autosuficiente saludable',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/6_AUTOSUFICIENTESALUDABLE.mp3'
      },
      {
        titulo: 'Tu parte que te ayuda',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/7_TUPARTEQUETEAYUDA.mp3'
      },
      {
        titulo: 'Respuestas moduladas',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/8_RESPUESTASMODULADAS.mp3'
      },
      {
        titulo: 'Sanando tus heridas',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/9_SANANDOTUSHERIDAS.mp3'
      },
      {
        titulo: 'Renaciendo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientonecesitoayuda.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/necesitoayuda/10_RENACIENDO.mp3'
      },

    ]
    this.audioscalmatuansiedad21 = [
      {
        titulo: 'Duda y certeza',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/1_dudaycerteza.mp3'
      },
      {
        titulo: 'Control emocional',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/2_autoregulacionemocional.mp3'
      },
      {
        titulo: 'Analogias de la ansiedad',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/3_analogiasdelaansiedad.mp3'
      },
      {
        titulo: 'Alerta saludable',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/4_alertasaludable.mp3'
      },
      {
        titulo: 'Cambio renovado',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/5_cambiorenovado.mp3'
      },
      {
        titulo: 'Capricho inconciente',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/6_caprichoinconciente.mp3'
      },
      {
        titulo: 'Miedo amigo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/7_miedoamigo.mp3'
      },
      {
        titulo: 'Desbloqueo',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/8_desbloqueo.mp3'
      },
      {
        titulo: 'Psicovacuna',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/9_psicovacuna.mp3'
      },
      {
        titulo: 'Reintegración',
        img: 'https://aliiivio.com/img_entrenamientos/portadas21/entrenamientocalmatuansiedad.jpg',
        rutaaudio: 'https://aliiivio.com/audentrenamientos/mayor20/regulaansiedad/10_reintegracion.mp3'
      },
    ]
  }

  goToSubject() {
  }
  goToAudio(subject: any) {
    this.presentConfirmAlert(
      subject.descripcion, // 👈 mensaje dinámico del subject
      () => {
        // Navega solo si confirma
        this.router.navigate([subject.route], {
          queryParams: {
            img: subject.img,
            titulo: subject.titulo,
            audio: subject.rutaaudio
          }
        });
      },
      subject.titulo
    );
  }
  goToAudioentrenamiento(item: any) {
    let playlist: any[] = [];

    if (item.name === 'Calma tu ansiedad') {
      playlist = this.audioscalmatuansiedad20;
    } else if (item.name === 'Entrenamiento necesito ayuda') {
      playlist = this.audiosnecesitoayuda20;
    }

    const currentAudio = playlist[0]; // El primero de la lista
    this.presentTestAlert(playlist);
  }
  goToAudioentrenamiento21(item: any) {
    let playlist: any[] = [];

    if (item.name === 'Calma tu ansiedad') {
      playlist = this.audioscalmatuansiedad21;
    } else if (item.name === 'Necesito ayuda') {
      playlist = this.audiosnecesitoayuda21;
    }

    const currentAudio = playlist[0]; // El primero de la lista
    this.presentTestAlert(playlist);
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
  async presentTestAlert(playlist: any[]) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Entrenamiento de diez audios.',
      message: 'Responde el test o empieza ya',
      buttons: [
        {
          text: 'Empiezo ya',
          role: 'cancel',
          handler: () => {
            // Ir directo al reproductor
            const currentAudio = playlist[0];
            this.router.navigate(['/audio-playerent'], {
              state: {
                currentAudio,
                playlist,
              }
            });
          }
        },
        {
          text: 'Responder test',
          handler: () => {
            // Redirigir al test
            this.router.navigate(['/test'], {
              state: { playlist }
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async presentConfirmAlert(
    message: string,
    onConfirm: () => void,
    header: string = '¡Atencion!'
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Iniciar audio',
          handler: () => onConfirm()
        }
      ]
    });
    await alert.present();
  }
  @ViewChild(IonPopover) popover?: IonPopover;
  editarPerfil() {
    // Navega o muestra el modal de edición
    this.router.navigate(['/editar-perfil']);
    // Cerrar el popover manualmente si está abierto
    this.popover?.dismiss();
  }
  editarPerfil1() {
    this.navCtrl.navigateForward('/editar-perfil');
    this.popover?.dismiss();
  }

  async cerrarSesion() {
    try {
      await signOut(this.auth); // Cierra sesión
      this.router.navigate(['/login']); // Redirige a la página de login o donde desees
      this.popover?.dismiss();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
