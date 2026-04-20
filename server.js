const app = require('./Api/app');
const config = require('./Api/config/config');


async function startServer() {
  try {
        app.listen(config.PORT, () => {
      console.log(`🚀 Servidor corriendo en: http://localhost:${config.PORT}`); //levanto el puerto
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor');
  }
}

startServer();


