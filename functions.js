//FILESYSTEM
const fs = require('fs');

//DEFINICIONES
const remote = require('@electron/remote');
const { dialog } = require('@electron/remote');
const puppeteer = require('puppeteer');

let nombre = document.getElementById("nombre");
let telf = document.getElementById("telf");
let direccion = document.getElementById("direccion");
let radio1 = document.getElementById("radio1"); // L
let radio2 = document.getElementById("radio2"); // M
let radio3 = document.getElementById("radio3"); // XL
let radio4 = document.getElementById("radio4"); // masa fina
let radio5 = document.getElementById("radio5"); // masa gruesa
let panel03 = document.getElementById("panel03");
let ingredientesArray;
let btnAceptar = document.getElementById("btnAceptar");
let btnCancelar = document.getElementById("btnCancelar");

//MAIN
muestraIngredientes();

//LISTENERS
btnAceptar.addEventListener("click", (event) => {
    imprime();
});

btnCancelar.addEventListener("click", (event) => {
    remote.getCurrentWindow().close();
});

//FUNCIONES
async function imprime() {

    let html =
        `<h1>PEDIDO</h1>
<h2>CLIENTE</h2>
NOMBRE: `+ nombre.value + `<br>
TELEFONO: `+ telf.value + `<br>
DIRECCION: `+ direccion.value + `<br>
<h2>TAMANO</h2>
`;
    if (radio1.checked) { html = html + "L - pequena <br>\n" }
    if (radio2.checked) { html = html + "M - mediana <br>\n" }
    if (radio3.checked) { html = html + "XL - grande <br>\n" }
    html = html + `<h2>MASA</h2>\n`
    if (radio4.checked) { html = html + "masa fina<br>\n" }
    if (radio5.checked) { html = html + "masa gruesa<br>\n" }
    html = html + `<h2>INGREDIENTES</h2>\n`

    // Obtener todos los elementos checkbox con nombre == ingrediente
    // como estan en el mismo orden que en ingredientesArray[] se cual
    // es el primero, el segundo, tercero, etc...
    for (let i = 0; i < ingredientesArray.length; i++) {
        let actual = document.getElementById("ingrediente" + i);
        if (actual.checked) {
            html = html + ingredientesArray[i] + `</br>\n`;
        }
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdf = await page.pdf({
            // nombre de fichero
            path: nombre.value + ".pdf",
            format: 'A4',
            printBackground: true
        });
        await browser.close;

        const options = {
            type: 'info',
            title: 'Exportacion a PDF correcta',
            message: 'En breve reciviras tu pedido'
        }
        dialog.showMessageBox(options);



    } catch (e) {
        console.log('Excepcion en imprime(): \n' + e)
        const options = {
            type: 'error',
            title: 'Fallo al exportar a PDF',
            message: 'Excepcion en imprime(): \n' + e
        }
        dialog.showMessageBox(options);
    }
}

function muestraIngredientes() {
    // Lee el fichero de ingredientes
    let fichero = fs.readFileSync('./data/ingredientes.json');
    let data = JSON.parse(fichero);
    fichero.close;

    // Accede a la propiedad "ingredientes"
    ingredientesArray = data.ingredientes;

    let contenido = `
        <div class="form-group" style="margin: 10px;">
            <img id="imagen" class="img-circle media-object pull-left" src="./img/4.png" width="32" height="32">
            <br><br><br>
    `;

    // Itera sobre el array de ingredientes
    for (let i = 0; i < ingredientesArray.length; i++) {
        contenido = contenido +
            `<input type="checkbox" id="ingrediente` + [i] + `">
            <label for="ingrediente` + i + `">` + ingredientesArray[i] + `</label>
            <img id="imagen" class="img-circle media-object pull-left" src="./img/`+ ingredientesArray[i] + `.jpg" width="35" height="35">
            <br><br>`
    }

    contenido += "</div>";

    // Asigna el contenido al panel03
    panel03.innerHTML = contenido;
}
