# CRUD completo com  Restful e AngularJS
Nesse projeto6 vamos utilizar o mesmo código do projeto5 mudando o nosso service, html e component.

Primeiro vamos deixar o nosso html assim:

~~~html
<h2>Exemplo de usuários</h2>
<div class="form-group col-md-6">
    <label>Nome</label>
    <input type="text" class="form-control" [(ngModel)]="usuarioObject.nome"   />
</div>
<div class="form-group col-md-6">
    <label>Idade</label>
    <input type="number" class="form-control" [(ngModel)]="usuarioObject.idade"   />
</div>
<div *ngIf="!edit" class="form-group col-md-3">
    <button class="btn btn-primary" (click)="salvarUsuario(usuarioObject)">Salvar</button>
</div>
<div *ngIf="edit" class="form-group col-md-3">
    <button class="btn btn-primary" (click)="editarUsuario(usuarioObject, true)">Editar</button>
</div>
<table class="table">
    <tr>
        <th>
            Id
        </th>
        <th>
            Nome
        </th>
        <th>
            Idade
        </th>
        <th>

        </th>
        <th>

        </th>
    </tr>

    <tr *ngFor="let usuario of usuarios; let i = index">
        <td>
            {{usuario._id}}
        </td>
        <td>
            {{usuario.nome}}
        </td>
        <td>
            {{usuario.idade}}
        </td>
        <td>
            <button class="btn btn-primary" (click)="editarUsuario(usuario)">Editar</button>
        </td>
        <td>
            <button class="btn btn-danger" (click)="deletarUsuario(usuario._id, i)">Deletar</button>
        </td>
    </tr>
</table>

~~~

Colocamos mais um parametro no método deletarUsuario, para que através de uma requisição DELETE nosso serviço consiga deletar o dado que está listado.

Agora vamos alterar o nosso server da seguinte forma:

~~~javascript

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
~~~

Agora o nosso service possui os métodos de envio das requisições HTTP(POST, PUT e DELETE).

Dessa forma conseguimos fazer o CRUD de uma forma muito simples, agora basta ajustar o código do nosso component.

~~~javascript
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../class/usuario';
import { UsuarioService } from '../service/usuario.service';


@Component({
    selector: 'usuario-component',
    templateUrl: 'app/usuario/templates/usuario.template.html',
    providers: [UsuarioService]
})
export class UsuarioComponent implements OnInit {
    usuarios: Usuario[];
    usuarioObject = new Usuario();
    edit = false;
    errorMessage: string;
    i: number;

    constructor(private usuarioService: UsuarioService) {

    }

    getListUsuarios(): void {
        this.usuarioService.getListUsuario()
            .subscribe(
            usuarios => this.usuarios = usuarios,
            error => this.errorMessage = <any>error);

    }

    deletarUsuario(id, i): void {
        this.i = i;
        this.usuarioService.deletarUsuario(id)
            .subscribe(
            success => this.usuarios.splice(this.i, 1),
            error => this.errorMessage = <any>error);
    }

    salvarUsuario(usuario: Usuario) {
        if (!usuario.nome) { return; }
        this.usuarioService.salvarUsuario(usuario)
            .subscribe(
            usuario => this.popularLista(usuario),
            error => this.errorMessage = <any>error
            );
    }

    popularLista(usuario: Usuario) {
        this.usuarios.push(usuario);
        this.usuarioObject = new Usuario();
    }

    editarUsuario(usuario: Usuario, persistir = false): void {

        this.edit = true;
        this.usuarioObject = usuario;
        if (persistir) {
            if (!usuario.nome) { return; }
            this.usuarioService.salvarUsuario(usuario)
                .subscribe(
                usuario => this.atualizarFormulario(),
                error => this.errorMessage = <any>error
                );
        }

    }

    atualizarFormulario(): void {
        this.usuarioObject = new Usuario();
        this.edit = false;
    }

    ngOnInit(): void {
        this.getListUsuarios();
    }

}
~~~

Pronto! O nosso exemplo de um CRUD consumindo um serviço Restful está pronto!
Assim separamos totalmente a camada backend com a camada frontend, independente em qual linguagem foi escrito o backend o nosso frontend adapta-se facilmente.
No próximo projeto vamos conhecer como funcionam as rotas em AngularJS
