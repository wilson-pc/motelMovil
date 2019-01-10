import { Habitacion } from './../../models/Habitacion';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { getBase64, resizeBase64 } from 'base64js-es6'
import { ReplaySubject } from "rxjs/ReplaySubject";
import {
  ImagePicker,
  ImagePickerOptions
} from '@ionic-native/image-picker';
declare var window;

/**
 * Generated class for the RegisterRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-room',
  templateUrl: 'register-room.html',
})
export class RegisterRoomPage {
  Habitacion: Habitacion;
  preview: any;

  public hasBaseDropZoneOver: boolean = false;
  image: any;
  imagen1: string = "selecciona una foto";
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;

  public imageLists: any[] = [];
  constructor(private imagePicker: ImagePicker, public navCtrl: NavController, public navParams: NavParams) {
    this.Habitacion = new Habitacion;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterRoomPage');
  }
  filechoosser() {
    this.fileInput.nativeElement.click();
  }
  filechoosser2() {
    let options = {
      maximumImagesCount: 10,

    }

    this.imagePicker.getPictures(options)
      .then((results) => {
        for (let index = 0; index < results.length; index++) {

          const element = results[index];
          getFileContentAsBase64(element, (base64Image) => {
            this.imageLists.push(base64Image);
           
            //  this.imageLists.push(base64Image);
            //window.open(base64Image);

            // Then you'll be able to handle the myimage.png file as base64
          });

        }
      }, (err) => { console.log(err) });
  }
  async fileChange2(event) {
    // alert(event.srcElement.files[0].name);
    for (let index = 0; index < event.srcElement.files.length; index++) {
      const element = event.srcElement.files[index];
      console.log(element.name);

    }
  }



  async fileChange(event) {
    // alert(event.srcElement.files[0].name);
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 200, 100).then((result) => {
        this.preview = result;
        // Will log a new base64 string
        // Do whatever what you want with this string
        //   console.log(result);
        this.image = {
          name: event.srcElement.files[0].name,
          size: event.srcElement.files[0].size, type: event.srcElement.files[0].type, data: data,
          preview: this.preview
        };
        this.imagen1 = this.image.name;
        console.log(this.image);
        //   this.image=data;

        //  alert(this.preview.substring(0, 10));

      });
      //   alert(dec.substring(0, 10));

    });


    /*  this.ng2ImgToolsService.resize([event.srcElement.files[0]], 300, 200).subscribe(result => {
         this.readFile(result).subscribe(data=>{
              this.preview=data;
         });
      //console.log(newimage);
        //all good, result is a file*/

    /* }, error => {
    alert("error" + error);
      //something went wrong 
      //use result.compressedFile or handle specific error cases individually
  });*/
    /*
    this.readFile(event.target.files[0]).subscribe(data => {
      
      let image={modified:event.target.files[0].lastModifiedDate,name:event.target.files[0].name,
           size:event.target.files[0].size,type:event.target.files[0].type,data:data};
      this.image=data;
    });*/
    //this.readFile(event.target.files[0]);

    // let result = fileUpload(event);
    //this.fileResult = result;
    //console.log(this.fileResult);
    //console.log(this.fileResult.__zone_symbol__value)
  }
  public readFile(fileToRead: File): Observable<MSBaseReader> {
    let base64Observable = new ReplaySubject<MSBaseReader>(1);

    let fileReader = new FileReader();
    fileReader.onload = event => {
      base64Observable.next(fileReader.result);
    };
    fileReader.readAsDataURL(fileToRead);

    return base64Observable;
  }

}

function getFileContentAsBase64(path, callback) {
  window.resolveLocalFileSystemURL(path, gotFile, fail);

  function fail(e) {
    alert('Cannot found requested file');
  }

  function gotFile(fileEntry) {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var content = this.result;
        callback(content);
      };
      // The most important point, use the readAsDatURL Method from the file plugin
      reader.readAsDataURL(file);
    });
  }
}