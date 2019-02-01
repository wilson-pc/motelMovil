import { Habitacion } from "./Habitacion";
import { TiempoReservadoHabitacion } from "./Tiemporeservadohabitaciones";

export class ReservasHabitaciones{
    public id:string;
    public cliente:string;
    public negocio:string;
    public tiempo:TiempoReservadoHabitacion;
    public habitacion:Habitacion;
    public estado:String;
}