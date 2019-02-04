var CryptoJS = require("crypto-js");
var clave = require("./../variables/claveCrypto");

async function Desincryptar(data){
    try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

        } else{
            return {error:"el incryptado es incorrecto Parte 1"}
        }
    }catch (e) {
        return {error:"el incryptado es incorrecto"}
    }
}
module.exports={Desincryptar};