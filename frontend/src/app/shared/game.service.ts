import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Cast, Game, Movie, Result, Solution } from "reelation";
import { catchError, Observable, retry, throwError } from "rxjs";
import { config } from "../environment";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  endpoint = config.API_URL

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getGame(gameId: string | undefined = undefined): Observable<Game> {
    return this.httpClient
      .get<Game>(this.endpoint + (gameId ? `/game/${gameId}?include_animation=false` : '/generate?include_animation=false'))
      .pipe(retry(1), catchError(this.processError))
  }

  getSolution(gameId: string): Observable<Solution> {
    return this.httpClient
      .get<Solution>(this.endpoint + `/game/${gameId}/solution`)
      .pipe(retry(1), catchError(this.processError))
  }

  generateSolution(): Observable<Solution> {
    return this.httpClient
      .get<Solution>(this.endpoint + '/generate')
      .pipe(retry(1), catchError(this.processError))
  }

  getRandomMovie(): Observable<{ movie: Movie, cast: Cast[] }> {
    return this.httpClient
      .get<{ movie: Movie, cast: Cast[] }>(this.endpoint + '/random_movie?include_animation=False')
      .pipe(retry(1), catchError(this.processError))
  }

  getCast(id: number): Observable<Cast[]> {
    return this.httpClient
      .get<Cast[]>(this.endpoint + '/cast', {
        params: { id }
      })
      .pipe(retry(1), catchError(this.processError))
  }

  getGenres(): Observable<{ genres: { id: number, name: string }[] }> {
    return this.httpClient
      .get<{ genres: { id: number, name: string }[] }>(this.endpoint + '/genres')
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

  checkAnswer(movie1: Movie, movie2: Movie) {
    const q = new URLSearchParams({
      movie1: movie1.id.toString(),
      movie2: movie2.id.toString()
    })
    return this.httpClient.get<Result>(`${this.endpoint}/check_answer?${q}`)
      .pipe(retry(1), catchError(this.processError))
  }

  checkCredits(movie: Movie, person: Cast) {
    const q = new URLSearchParams({
      movie: movie.id.toString(),
      cast: person.id.toString()
    })
    return this.httpClient.get<{ correct: boolean }>(`${this.endpoint}/check_credit?${q}`)
      .pipe(retry(1), catchError(this.processError))
  }
}
