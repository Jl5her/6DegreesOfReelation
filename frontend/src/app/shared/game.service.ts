import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, retry, throwError } from "rxjs";

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: [number];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number
}

export type Cast = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number
}

export type Game = { start: Movie, end: Movie, id: string }

@Injectable({
  providedIn: 'root'
})
export class GameService {
  endpoint = 'http://localhost'

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getGame(): Observable<Game> {
    return this.httpClient
      .get<Game>(this.endpoint + '/game/1')
      .pipe(retry(1), catchError(this.processError))
  }

  processError(err: any) {
    let message = ''
    if (err.error instanceof ErrorEvent) {
      message = err.error.message
    } else {
      message = `Error code: ${err.status}\nMessage: ${err.message}`
    }
    console.log(message)
    return throwError(() => {
      message;
    })
  }
}