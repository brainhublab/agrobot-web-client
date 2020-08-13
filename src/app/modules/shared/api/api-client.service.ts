import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { IDevice } from '../litegraph/device.model';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private readonly baseUrl = environment.api.url;

  constructor(
    private httpClient: HttpClient
  ) { }

  public get<ResponseType>(path: string) {
    // NOTE: we need trailing slash. CORS Response should return 2xx, not 3xx code.
    return this.httpClient.get<ResponseType>(this.baseUrl + '/' + path + '/').pipe(first());
  }

  public put<ResponseType>(path: string, body: any) {
    return this.httpClient.put<ResponseType>(this.baseUrl + '/' + path + '/', body).pipe(first());
  }

  getControllers() {
    return this.get<Array<IDevice>>(`controllers`);
  }

  getControllerById(id: number) {
    return this.get<IDevice>(`controllers/${id}`);
  }

  updateController(controller: IDevice) {
    return this.put<IDevice>(`controllers/${controller.id}`, controller);
  }
}
