// Se asignan modulos en una constante
const express = require ('express')
const app = express()
const path = require('path')
const expressFileUpload = require('express-fileupload')
const fs = require('fs')

// Se crea el servidor y la conexión con el puerto
const servidor = app.listen(3000, () => {
    console.log('Servidor disponble en puerto 3000 http://localhost:3000')
})

// Se asigna la carpeta (middleware) para las imagemes a la ruta /imgs
app.use('/imgs',express.static(path.join(__dirname, 'assets','img')))

// Se realiza la configuración del módulo File Upload
app.use(expressFileUpload({
    limits: {FileSize: 5000000},
    abortOnLimit: true,
    responseOnLimit: 'El peso de la imagen que intentas subir supera el limite permitido'
    })
)

// Muestra formulario para cargar una imagen
app.get('/', (req,res) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(fs.readFileSync('formulario.html', 'utf-8'))
})

// Guarda imagen en la posición seleccionada 
app.post('/imagen', (req, res) => {
    const { target_file } = req.files
    const posicion = req.body.posicion
    const archivo = `imagen-${posicion}.jpg`
    const ruta = path.join(__dirname, 'assets','img', archivo)
    target_file.mv(ruta, (err) => {
        if(err) {
            res.send('No es posible cargar la imagen')
        } else{
            //res.send('Archivo cargado con éxito')
            res.redirect('/imagenes')
            //res.send("<script>alert('Archivo cargado con exito'); window.location.href='/imagenes'</script>")
        }
    })
})

// Muestra collage de imágenes
app.get('/imagenes', (req,res) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(fs.readFileSync('collage.html', 'utf-8'))
})

// Elimina imagenes seleccionada
app.get('/deleteImg/:nombre',(req,res)=>{
    const { nombre } = req.params;
    const rutaImagen = path.join(__dirname, 'assets','img', nombre)

    fs.unlink(rutaImagen, (err) => {
        if(err) {
            res.send('No es posible eliminar la imagen')
        } else{
        res.send(`Imagen ${nombre} eliminada con éxito`);
        //res.redirect('/imagenes')
        }
    });
    //console.log(req)
})