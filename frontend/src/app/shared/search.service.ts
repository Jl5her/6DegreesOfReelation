import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Cast, Movie } from "reelation";
import { type Observable, of } from "rxjs";
import { config } from "../environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  movie_endpoint = `${config.API_URL}/search_movie`
  person_endpoint = `${config.API_URL}/search_person`

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
