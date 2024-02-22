import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private _http: HttpClient) { }

  BASE_URL = 'https://api.jikan.moe/v4/anime';

  getData(search: string) {
    const url = `${this.BASE_URL}?q=${search}&sfw`;
    return this._http.get(url);
  }
}
