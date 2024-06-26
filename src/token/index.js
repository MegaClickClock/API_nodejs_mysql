const jwt = require("jsonwebtoken");
const config = require("../config");
const error = require("../middleware/errors");

const secret = config.jwt.secret;

function asignarToken(data) {
  return jwt.sign(data, secret);
}

function verificarToken(token) {
  return jwt.verify(token, secret);
}

//* para que un usuario pueda registrar mas usuarios
const chequearToken = {
  confirmarToken: function (req) {
    const decodificado = decodificarCabecera(req);
  },
};

//* para que el usuario solo haga cambios a su perfil
/* const chequearToken = {
  confirmarToken: function (req, id) {
    const decodificado = decodificarCabecera(req);
    if (decodificado.id !== id) {
      throw error("No tienes privilegios para hacer esto", 401);
    }
  },
}; */

function obtenerToken(autorizacion) {
  if (!autorizacion) {
    throw new Error("No viene token");
  }
  if (autorizacion.indexOf("Bearer") === -1) {
    throw error("Formato invalido", 401);
  }

  let token = autorizacion.replace("Bearer ", "");
  return token;
}

function decodificarCabecera(req) {
  const autorizacion = req.headers.authorization || "";
  const token = obtenerToken(autorizacion);
  const decodificado = verificarToken(token);

  req.user = decodificado;
  return decodificado;
}

module.exports = {
  asignarToken,
  chequearToken,
};
