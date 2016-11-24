
import { Injectable } from '@angular/core';
import { Usuario } from '../class/usuario';

import { Http, Response } from '@angular/http';
//adicione essa linha
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';


@Injectable()
export class UsuarioService {
    private usuarioUrl = 'https://cursoangularjs2restful.herokuapp.com/usuario';

    constructor(private http: Http) { }

    getListUsuario(): Observable<Usuario[]> {

        return this.http.get(this.usuarioUrl)
            .map(res => res.json())
            .catch(this.handleError);
    }

    //método para salvar o usuário
    salvarUsuario(usuario: Usuario): Observable<Usuario> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (!usuario._id) {
            return this.http.post(this.usuarioUrl, usuario, options)
                .map(res => res.json())
                .catch(this.handleError);
        } else {
            return this.http.put(this.usuarioUrl + "/" + usuario._id, usuario, options)
                .map(res => res.json())
                .catch(this.handleError);
        }

    }


    deletarUsuario(id: string): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(this.usuarioUrl + "/" + id, options);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}