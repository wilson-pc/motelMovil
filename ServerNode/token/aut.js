"use strict"

var token = require("jwt-simple");
var moment = require("moment");
var claveSecreta = "nuevaclave";
/*=============================================
MÉTODO DE LA AUTENTICACIÓN
=============================================*/

// Creamos un middleware

exports.autentication = function(req, res, next){

	//Pasamos el token por una cabecera de autenticación

	if(!req.headers.authorization){
      console.log("no tiene");
		return res.status(403).send({mensaje: "La petición no tiene la cabecera de autenticación"})

	}else{

		//Quitamos las comillas simples y dobles al token con el método replace

		var tokensent = req.headers.authorization.replace(/['"]+/g, '');

		// Sentencias de manejo de excepciones
		// La sentencia try...catch marca un bloque de instrucciones a intentar que pueden causar alguna excepción, y declarar una o más respuestas en caso de que una excepción sea arrojada. Si una excepción es arrojada, la sentencia try...catch se encarga de atraparla.

		// Un bloque try es usado para para probar una sentencia
         
		try{

			var loadToken = token.decode(tokensent, claveSecreta);
		

			//Comparar la fecha actual con la expiración del token
			if(loadToken.exp <= moment().unix()){

				return res.status(403).send({mensaje: "El token ha expirado"})

			}

		// Un bloque catch es usado para capturar todas las excepciones que pueden ser generadas en el bloque try (prueba).

		}catch(excepcion){

			console.log(excepcion)
			return res.status(403).send({mensaje: "El token no es válido"})

		}

		//Añadimos al objeto Request una propiedad de usuario para siempre tener disponible el token en cualquier sesión. Con esto no tenemos que estar descodificando el token en cada sesión que ingrese el usuario

		req.userToken = loadToken;

		next();

	}

}