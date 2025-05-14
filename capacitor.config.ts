import { CapacitorConfig } from '@capacitor/cli';
import { Keyboard } from '@capacitor/keyboard';
const config: CapacitorConfig = {
  appId: 'com.aliiivio.aliiivio',
  appName: 'aliiivio',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 3000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: false,
      splashImmersive: false,
      layoutName: "launch_screen",
      useDialog: false,
    },
    Keyboard: {
      Keyboardresize: 'ionic', // IMPORTANTE para scroll automático
      Keyboardstyle: 'light',
      resizeOnFullScreen: true
    }
  },
};

export default config;
