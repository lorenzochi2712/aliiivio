import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async saveProgress(audioId: string, currentTime: number) {
    const user = this.auth.currentUser;
    if (!user) return;

    const progressRef = doc(this.firestore, `progresos/${user.uid}`);
    const docSnap = await getDoc(progressRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    await setDoc(progressRef, { ...data, [audioId]: currentTime });
  }

  async loadProgress(audioId: string): Promise<number> {
    const user = this.auth.currentUser;
    if (!user) return 0;

    const progressRef = doc(this.firestore, `progresos/${user.uid}`);
    const docSnap = await getDoc(progressRef);
    return docSnap.exists() ? docSnap.data()?.[audioId] || 0 : 0;
  }
}
