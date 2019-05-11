import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { conexionSocketComportamiento } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { DescriptionLicoreriaPage } from '../description-licoreria/description-licoreria';

/**
 * Generated class for the ComplaintsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html',
})
export class ComplaintsPage {

  listaDenuncias: Productos[]=[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,      
    private usuarioLogueado:UsuarioProvider,
    public provedorSocketDenucias:conexionSocketComportamiento,
    public modalCtrl: ModalController) {
      this.obtenerListadeDenuncias();  
      this.respuestaListaDenuncias(); 

 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintsPage');
  }

  //Metodos de obtencion de datos
  async obtenerListadeDenuncias(){
    let usuario={idcliente: this.usuarioLogueado.UserSeCion.datos._id};
    //console.log("este es el usuario:",usuario);
    if(usuario.idcliente != undefined || usuario.idcliente !=null)
    {
      console.log("entro if", usuario);
      await this.provedorSocketDenucias.emit('listar-denuncia',usuario);
       //await this.respuestaListaFavoritos();

    }
    
  }
  presentModal(item) {
    console.log(item);
    const modal = this.modalCtrl.create(DescriptionLicoreriaPage,{producto:item});
      modal.present();
  }
  respuestaListaDenuncias(){
    this.provedorSocketDenucias.on('respuesta-listar-denuncia',(data)=>{
     console.log("datos",data.datos);
      for (let index = 0; index < data.datos.length; index++) {
        const element = data.datos[index];
       // console.log("productos:",element.producto);        
         this.listaDenuncias.push(element);
        console.log(this.listaDenuncias);
      }
    });    
  }

}
