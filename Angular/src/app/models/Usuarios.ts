import { Rol } from "./Rol";

export class Usuarios{
    public id:string;
    public nombre:string;
    public apellidos:string;
    public Rol:Rol;
    public ci:string;
    public foto:string;
    public telfcontacto:string;
    public direccion:string;
    public email:String;
    public login:{usuario:string,password:string}
    public eliminado:{estado:Boolean,razon:string};
    public creacion:{usuario:string,fecha:Date};
    public modificacion:{fecha:Date,usuario:string};

}