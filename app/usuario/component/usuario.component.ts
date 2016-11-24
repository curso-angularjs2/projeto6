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