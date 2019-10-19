import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  public saveUser(user: string) {
    return this.set('user', user);
  }

  public getJWT() {
    return this.get('jwt');
  }

  public saveJWT(jwtToken: string) {
    return this.set('jwt', jwtToken);
  }

  public async getValorKW() {
    return parseFloat(await this.get('valorKW'));
  }

  public async saveValorKW(valorKW: string) {
    return this.set('valorKW', valorKW);
  }

  private get(key: string) {
    return this.storage.get(key);
  }

  private set(key: string, content: string) {
    return this.storage.set(key, content);
  }

  private remove(key: string) {
    return this.storage.remove(key);
  }
}
