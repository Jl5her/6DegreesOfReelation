import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  endpoint = 'http://localhost/search'

  constructor(private httpClient: HttpClient) {

  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAutocompleteSuggestions(query: string): Observable<string[]> {
    const apiUrl = `${this.endpoint}/`
    return this.httpClient.get<string[]>(apiUrl);
  }
}
