import { Footer } from "ionic-angular";
import { Habitacion } from "./Habitacion";
import { Usuarios } from "./Usuarios";

export class Moteles
 {
    public id:string;
    public nombremotel: string;
    public descripcion : string;
    public direccion : string;
    public telfcontacto:string;
    public logo:string;    
    public habitacion:[Habitacion];
    public encargado:Usuarios;
    public estado:string;
    public borrado:boolean;
}