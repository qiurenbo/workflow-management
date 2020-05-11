import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from 'src/environments/environment';
import { assembleRequestUrl } from './utils';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccounts(
    query: { limit: number; offset: number } = null
  ): Observable<HttpResponse<Account[]>> {
    return this.http.get<Account[]>(
      assembleRequestUrl(query, environment.apiurl + 'accounts'),
      {
        observe: 'response',
      }
    );
  }

  postAccount(account: Account): Observable<any> {
    if (environment.mock) {
      return forkJoin(
        this.http.post(environment.apiurl + 'register', account),
        this.http.post(environment.apiurl + 'accounts', account)
      );
    } else {
      this.http.post(environment.apiurl + 'accounts', account);
    }

    return this.http.post(environment.apiurl + 'accounts', account);
  }

  deleteAccount(account: Account): Observable<any> {
    return this.http.delete(environment.apiurl + 'accounts/' + account.id);
  }

  putAccount(account: Account): Observable<any> {
    return this.http.put(
      environment.apiurl + 'accounts/' + account.id,
      account
    );
  }
}
