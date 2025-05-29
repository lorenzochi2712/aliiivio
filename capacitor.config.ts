import { CapacitorConfig } from '@capacitor/cli';
import { Keyboard } from '@capacitor/keyboard';
const config: CapacitorConfig = {
  appId: 'com.aliiivio.aliiivio',
  appName: 'Aliiivio',
  webDir: 'www',
  plugins: {
    SplashScreen: {
  launchShowDuration: 0,
  launchAutoHide: true,
  launchFadeOutDuration: 0,
  backgroundColor: "#ffffffff",
  showSpinner: false,
  splashFullScreen: true, // Debe estar en true
  splashImmersive: false,
},
    Keyboard: {
      Keyboardresize: 'ionic', // IMPORTANTE para scroll automático
      Keyboardstyle: 'light',
      resizeOnFullScreen: true
    }
  },
};

export default config;
