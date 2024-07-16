import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User, Comic, Favorite } from '../models/models';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    const userFinal = {
      "password": user.password,
      "nombre": user.name,
      "identificacion": user.identification,
      "email": user.email
    }
    return this.http.post(`${this.apiUrl}/users/`, userFinal);
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `username=${email}&password=${password}`;
    return this.http.post(`${this.apiUrl}/users/token`, body, { headers });
  }

  getProfile(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/users/me`).pipe(
      map(response => {
        return new User(
          response.nombre,
          response.identificacion,
          response.email,
          response.password
        );
      })
    );
  }

  getComics(page: number, limit: number): Observable<Comic[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Comic[]>(`${this.apiUrl}/comics`, { params });
  }

  getTotalComics(): Observable<{ total: number, total_pages: number }> {
    return this.http.get<{ total: number, total_pages: number }>(`${this.apiUrl}/comics/total`);
  }

  getComicDetails(id: number): Observable<Comic> {
    return this.http.get<Comic>(`${this.apiUrl}/comics/${id}`);
  }

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<{ favoritos: Favorite[] }>(`${this.apiUrl}/comics/favorites/`)
      .pipe(
        tap(response => {
          console.log('Raw response:', response);
        }),
        map(response => response.favoritos)
      );
  }

  addToFavorites(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/comics/favorites/`, favorite);
  }

  removeFromFavorites(comicId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comics/favorites/${comicId}`);
  }
}
