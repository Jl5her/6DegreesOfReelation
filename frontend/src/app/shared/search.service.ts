import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { type Observable, of } from "rxjs";
import type { Cast, Movie } from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  movie_endpoint = 'http://192.168.1.103/search_movie'
  person_endpoint = 'http://192.168.1.103/search_person'

  constructor(private httpClient: HttpClient) {

  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  searchMovies(query: string): Observable<Movie[]> {
    if (query == "" || query == null) return of([]);
    return this.httpClient.get<Movie[]>(this.movie_endpoint, {
      params: { q: query }
    });
  }

  searchPersons(query: string): Observable<Cast[]> {
    return this.httpClient.get<Cast[]>(this.person_endpoint, {
      params: { q: query }
    })
  }
}
