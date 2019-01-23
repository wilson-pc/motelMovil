import { Rol } from "./Rol";

export class Usuarios{
    public id:string;
    public nombre:string;
    public apellidos:string;
    public rol:Rol;
    public ci:string;
    public foto:string;
    public telefono:string;
    public genero:string;
    public direccion:string;
    public email:String;
    public login:{usuario:string,password:string,estado:boolean}
    public eliminado:{estado:Boolean,razon:string};
    public creacion:{fecha:string,usuario:string};
    public modificacion:{fecha:string,usuario:string};

}