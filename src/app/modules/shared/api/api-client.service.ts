import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDevice } from '../litegraph/device.model';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private readonly baseUrl = environment.api.url;

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Generates HTTP GET request observable
   * @param path relative API path ('controllers', 'items/23', etc)
   */
  public get<ResponseType>(path: string) {
    // NOTE: we need trailing slash. CORS Response should return 2xx, not 3xx code.
    return this.httpClient.get<ResponseType>(this.baseUrl + '/' + path + '/').pipe(first());
  }

  /**
   * Generates HTTP PUT request observable
   * @param path relative API path
   * @param body PUT request body
   */
  public put<ResponseType>(path: string, body: any) {
    return this.httpClient.put<ResponseType>(this.baseUrl + '/' + path + '/', body).pipe(first());
  }

  /**
   * Load controllers
   */
  getControllers() {
    return this.get<Array<IDevice>>(`controllers`);
  }

  /**
   * Load a single contoller
   * @param id controller id
   */
  getControllerById(id: number) {
    return this.get<IDevice>(`controllers/${id}`);
  }

  /**
   * Update controller instance
   * @param controller controller
   */
  updateController(controller: IDevice) {
    return this.put<IDevice>(`controllers/${controller.id}`, controller);
  }
}
