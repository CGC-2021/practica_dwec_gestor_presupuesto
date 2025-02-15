import * as gesPres from "./gestionPresupuesto.js";


let nuevoFormulario = new nuevoGastoWebFormulario();

let bNuevoForm = document.getElementById("anyadirgasto-formulario");
bNuevoForm.addEventListener("click", nuevoFormulario);

let filtradoGastos = new filtrarGastosWeb();
document.getElementById("formulario-filtrado").addEventListener("submit", filtradoGastos);

let gastosGuardados = new guardarGastosWeb();
document.getElementById("guardar-gastos").addEventListener("click" , gastosGuardados);

let gastosCargados = new cargarGastosWeb();
document.getElementById("cargar-gastos").addEventListener("click", gastosCargados);

let gastosCargadosApi = document.getElementById("cargar-gastos-api");
gastosCargadosApi.addEventListener("click", cargarGastosApi);



function mostrarDatoEnId (idElemento, valor) {

    document.getElementById(idElemento).innerHTML = valor;
    
}


function mostrarGastoWeb (idElemento, gasto) {

    let div = document.createElement('div');
    div.className = "gasto";

    let div1 = document.createElement('div');
    div1.className = "gasto-descripcion";
    div1.append(gasto.descripcion);

    let div2 = document.createElement('div');
    div2.className = "gasto-fecha";
    div2.append(gasto.fecha);

    let div3 = document.createElement('div');
    div3.className = "gasto-valor";
    div3.append(gasto.valor);

    let div4 = document.createElement('div');
    
    

    div.append(div1);
    div.append(div2);
    div.append(div3);
    div.append(div4);

    for (let etiqueta of gasto.etiquetas)
    {
        let span = document.createElement('span');
        span.className = "gasto-etiquetas-etiqueta";
        
        span.append(etiqueta);
        div4.append(span);

        let evBorrarEti = new BorrarEtiquetasHandle();
        evBorrarEti.gasto = gasto;
        evBorrarEti.etiqueta = etiqueta;
        span.addEventListener('click', evBorrarEti);
        
    }

    div4.className = "gasto-etiquetas";
    
    
    let botonEditar = document.createElement('button');
    botonEditar.type = "button";
    botonEditar.className = "gasto-editar";
    botonEditar.textContent = "Editar";

    let evEditar = new EditarHandle();
    evEditar.gasto = gasto;
    botonEditar.addEventListener('click', evEditar);
    div.append(botonEditar);

    let botonBorrar = document.createElement('button');
    botonBorrar.type = "button";
    botonBorrar.className = "gasto-borrar";
    botonBorrar.textContent = "Borrar";

    let evBorrar = new BorrarHandle();
    evBorrar.gasto = gasto;
    botonBorrar.addEventListener('click', evBorrar);
    div.append(botonBorrar);

    let botonEditForm = document.createElement('button');
    botonEditForm.type = "button";
    botonEditForm.className = "gasto-editar-formulario";
    botonEditForm.textContent = "Editar (formulario)";

    let evEditForm = new EditarHandleFormulario();
    evEditForm.gasto = gasto;
    botonEditForm.addEventListener("click", evEditForm);
    div.append(botonEditForm);

    let btBorrarApi = document.createElement('button');
    btBorrarApi.type = "button";
    btBorrarApi.className = "gasto-borrar-api";
    btBorrarApi.textContent = "Borrar (API)"

    let evBorrarApi = new borrarGastoApi();
    evBorrarApi.gasto = gasto;
    btBorrarApi.addEventListener('click', evBorrarApi);
    div.append(btBorrarApi);



    let id = document.getElementById(idElemento);
    id.append(div);


}

function mostrarGastosAgrupadosWeb (idElemento, agrup, periodo) {

    var divP = document.getElementById(idElemento);
    divP.innerHTML = "";

    let div = document.createElement('div');
    div.className = "agrupacion";

    let h1 = document.createElement('h1');
    h1.innerHTML = `Gastos agrupados por ${periodo}`;
    
    div.append(h1);


    for (let [clave, valor] of Object.entries(agrup))
    {

        let div1 = document.createElement('div');
        div1.className = "agrupacion-dato";

        let span = document.createElement('span');
        span.className = "agrupacion-dato-clave";
        span.append(clave);
        
        let span1 = document.createElement('span');
        span1.className = "agrupacion-dato-valor";
        span1.append(valor);

        div1.append(span);
        div1.append(span1);
        div.append(div1);
        divP.append(div);
        
    } 

    // Estilos
    divP.style.width = "33%";
    divP.style.display = "inline-block";
    // Crear elemento <canvas> necesario para crear la gráfica
    // https://www.chartjs.org/docs/latest/getting-started/
    let chart = document.createElement("canvas");
    // Variable para indicar a la gráfica el período temporal del eje X
    // En función de la variable "periodo" se creará la variable "unit" (anyo -> year; mes -> month; dia -> day)
    let unit = "";
    switch (periodo) {
    case "anyo":
        unit = "year";
        break;
    case "mes":
        unit = "month";
        break;
    case "dia":
    default:
        unit = "day";
        break;
    }

    // Creación de la gráfica
    // La función "Chart" está disponible porque hemos incluido las etiquetas <script> correspondientes en el fichero HTML
    const myChart = new Chart(chart.getContext("2d"), {
        // Tipo de gráfica: barras. Puedes cambiar el tipo si quieres hacer pruebas: https://www.chartjs.org/docs/latest/charts/line.html
        type: 'line',
        data: {
            datasets: [
                {
                    // Título de la gráfica
                    label: `Gastos por ${periodo}`,
                    // Color de fondo
                    backgroundColor: "#555555",
                    // Datos de la gráfica
                    // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                    data: agrup
                }
            ],
        },
        options: {
            scales: {
                x: {
                    // El eje X es de tipo temporal
                    type: 'time',
                    time: {
                        // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                        unit: unit
                    }
                },
                y: {
                    // Para que el eje Y empieza en 0
                    beginAtZero: true
                }
            }
        }
    });
    // Añadimos la gráfica a la capa
    divP.append(chart);
    
}

function repintar() {

    mostrarDatoEnId("presupuesto", gesPres.mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", gesPres.calcularTotalGastos()); 
    mostrarDatoEnId("balance-total", gesPres.calcularBalance());

    
    document.getElementById("listado-gastos-completo").innerHTML = "";
    let gastos = gesPres.listarGastos();

    for (let gasto of gastos)
    {
        mostrarGastoWeb("listado-gastos-completo", gasto);

    }

    mostrarGastosAgrupadosWeb("agrupacion-dia", gesPres.agruparGastos("dia"), "día");

    mostrarGastosAgrupadosWeb("agrupacion-mes", gesPres.agruparGastos("mes"), "mes");

    mostrarGastosAgrupadosWeb("agrupacion-anyo", gesPres.agruparGastos("anyo"), "año");
}


function EditarHandle() {
    
    this.handleEvent = function () {

        let nDescripcion = prompt("Introduce la descripción");
        this.gasto.actualizarDescripcion(nDescripcion);

        let nValor = prompt("Introduce el valor");
        nValor = parseFloat(nValor);
        this.gasto.actualizarValor(nValor);

        let nFecha = prompt("Introduce la fecha");
        this.gasto.actualizarFecha(nFecha);

        let nEtiquetas = prompt("Introduce las etiquetas");
        let arrEtiquetas = nEtiquetas.split(',');
        this.gasto.anyadirEtiquetas(arrEtiquetas);
        
        
        
        repintar();
        

    }


}

function BorrarHandle() {

    this.handleEvent = function() {

        gesPres.borrarGasto(this.gasto.id);

        repintar();

    }
}

function BorrarEtiquetasHandle() {

    this.handleEvent = function() {

        this.gasto.borrarEtiquetas(this.etiqueta);

        repintar();
    }
}

function actualizarPresupuestoWeb() {
        
    let presupuestoActualizado = prompt("Introduce el nuevo presupuesto");
    presupuestoActualizado = parseFloat(presupuestoActualizado);

    gesPres.actualizarPresupuesto(presupuestoActualizado);

    repintar();

}

let actualizar = document.getElementById("actualizarpresupuesto");
actualizar.addEventListener("click", actualizarPresupuestoWeb);

function nuevoGastoWeb() {

    let nuevaDesc = prompt("Introduce una nueva descripción");
    let nuevoValor = prompt("Introduce un nuevo valor");
    let nuevaFecha = prompt("Introduce una nueva fecha");
    let nuevaEtiquetas = prompt("Introduce las nuevas etiquetas");

    nuevoValor = parseFloat(nuevoValor);

    let arrEtiquetas = nuevaEtiquetas.split(',');

    let gasto = new gesPres.CrearGasto(nuevaDesc, nuevoValor, nuevaFecha, arrEtiquetas);

    gesPres.anyadirGasto(gasto);

    repintar();

}

let anyadir = document.getElementById("anyadirgasto");
anyadir.addEventListener("click", nuevoGastoWeb);


function nuevoGastoWebFormulario() {

    this.handleEvent = function() {


        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);

        var formulario = plantillaFormulario.querySelector("form");
        
        document.getElementById("controlesprincipales").append(formulario);

        document.getElementById("anyadirgasto-formulario").disabled = true;

        let evSubmit = new SubmitHandle();
        formulario.addEventListener("submit", evSubmit);

        let evCancelar = new CancelarFormHandle();
        let botonCancelar = formulario.querySelector("button.cancelar");
        botonCancelar.addEventListener("click", evCancelar);

        let envioApi = new enviarGastoApi();
        let btEnviarApi = formulario.querySelector("button.gasto-enviar-api");
        btEnviarApi.addEventListener("click", envioApi);
        

    }
}

function SubmitHandle() {
    
    this.handleEvent = function(event) {

        event.preventDefault();

        let accesoForm = event.currentTarget;

        let nuevaDesc = accesoForm.elements.descripcion.value;
        let nuevoValor = accesoForm.elements.valor.value;
        nuevoValor = parseFloat(nuevoValor); 
        let nuevaFecha = accesoForm.elements.fecha.value;
        let nuevaEtiquetas = accesoForm.elements.etiquetas.value;

        let gasto = new gesPres.CrearGasto(nuevaDesc, nuevoValor, nuevaFecha, nuevaEtiquetas);
        gesPres.anyadirGasto(gasto);

        
        repintar();

        document.getElementById("anyadirgasto-formulario").disabled = false;
        
    }
}

function CancelarFormHandle() {

    this.handleEvent = function(event) {

        event.currentTarget.parentNode.remove();

        document.getElementById("anyadirgasto-formulario").disabled = false;

        repintar();
    }
}

function EditarHandleFormulario() {

    this.handleEvent = function(event) {


        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        var formulario = plantillaFormulario.querySelector("form");

        let bEditActivo = event.currentTarget;
        bEditActivo.after(formulario);
        bEditActivo.disabled = true;

	    let evEditarGasto = new SubmitEditarHandle();
        evEditarGasto.gasto = this.gasto;

        formulario.elements.descripcion.value = this.gasto.descripcion;
        formulario.elements.valor.value = this.gasto.valor;
        formulario.elements.fecha.value = this.gasto.fecha;
        formulario.elements.etiquetas.value = this.gasto.etiquetas;

        let enviarGasto = new EditarHandle();
        enviarGasto.gasto = this.gasto;
        formulario.addEventListener("submit", enviarGasto);

        let evEditarApi = new editarGastoApi();
        let btEditarApi = formulario.querySelector("button.gasto-enviar-api");
        evEditarApi.gasto = this.gasto;
        btEditarApi.addEventListener("click", evEditarApi); 

        let evCancelar = new CancelarFormHandle();
        let botonCancelar = formulario.querySelector("button.cancelar");
        botonCancelar.addEventListener("click", evCancelar);


    }


    
}

function SubmitEditarHandle() {

    this.handleEvent = function(event) {

        event.preventDefault();
        
        let accesoForm = event.currentTarget;

        let nuevaDesc = accesoForm.elements.descripcion.value;
        let nuevoValor = accesoForm.elements.valor.value;
        nuevoValor = parseFloat(nuevoValor); 
        let nuevaFecha = accesoForm.elements.fecha.value;
        let nuevaEtiquetas = accesoForm.elements.etiquetas.value;

        this.gasto.actualizarDescripcion(nuevaDesc);
        this.gasto.actualizarValor(nuevoValor);
        this.gasto.actualizarFecha(nuevaFecha);
        this.gasto.anyadirEtiquetas(...nuevaEtiquetas);

        repintar();


    }
}




function filtrarGastosWeb() {

    this.handleEvent = function(event) {

        event.preventDefault();

        let formulario = event.currentTarget;

        let descFilt = formulario.elements["formulario-filtrado-descripcion"].value;
        let valorMinFilt = formulario.elements["formulario-filtrado-valor-minimo"].value;
        let valorMaxFilt = formulario.elements["formulario-filtrado-valor-maximo"].value;
        let fechaDesdeFilt = formulario.elements["formulario-filtrado-fecha-desde"].value;
        let fechaHastaFilt = formulario.elements["formulario-filtrado-fecha-hasta"].value;
        let etiquetasFilt = formulario.elements["formulario-filtrado-etiquetas-tiene"].value; 

        
        if (etiquetasFilt !== null)
        {
            etiquetasFilt = gesPres.transformarListadoEtiquetas(etiquetasFilt);
        }

        let filtrado = gesPres.filtrarGastos({fechaDesde: fechaDesdeFilt, fechaHasta: fechaHastaFilt, valorMinimo: valorMinFilt,
        valorMaximo: valorMaxFilt, descripcionContiene: descFilt, etiquetasTiene: etiquetasFilt});

        document.getElementById("listado-gastos-completo").innerHTML = "";

        for (let f of filtrado)
        {
            mostrarGastoWeb("listado-gastos-completo", f);
        }
    }
}


function guardarGastosWeb() {

    this.handleEvent = function() {

        localStorage.setItem("GestorGastosDWEC", JSON.stringify(gesPres.listarGastos()));

    }

}

function cargarGastosWeb() {

    this.handleEvent = function() {

        let gastosAlmacenados = JSON.parse(localStorage.getItem("GestorGastosDWEC"));

        if(gastosAlmacenados === null)
        {
            gesPres.cargarGastos(gastosAlmacenados = []);
        }
        else 
        {
            gesPres.cargarGastos(gastosAlmacenados);

        }


        repintar();
    }
}

async function cargarGastosApi() {

    

    let usuario = document.getElementById("nombre_usuario").value;

    let api = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}`;

    let response = await fetch(api);

    if(response.ok)
    {
        gesPres.cargarGastos(await response.json());
    }
    else {
                    
        alert("Error-HTTP: " + response.status);
    }

    repintar();

       
}  

function borrarGastoApi() {
    
    this.handleEvent = async function() {

        let usuario = document.getElementById("nombre_usuario").value;

        let idGasto = this.gasto.gastoId;
        
        let api = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}/${idGasto}`;

        fetch(api, {method: "DELETE"
        })
        .then(response => cargarGastosApi(response));

    }
}

function enviarGastoApi() {

    this.handleEvent = async function(event) {

        let usuario = document.getElementById("nombre_usuario").value;

        let api = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}`;

        let form = event.currentTarget.form;

        let descApi = form.elements.descripcion.value;
        let valorApi = form.elements.valor.value;
        valorApi = parseFloat(valorApi);
        let fechaApi = form.elements.fecha.value;
        let etiApi = form.elements.etiquetas.value;
        let listadoEti = etiApi.split(",");

        let gastoApi = new gesPres.CrearGasto(descApi, valorApi, fechaApi, ...listadoEti);

        fetch (api, { method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(gastoApi)
        })
        .then(response => cargarGastosApi(response)); 
    }     
}


function editarGastoApi () {

    this.handleEvent = async function(event){

        let usuario = document.getElementById("nombre_usuario").value;

        let idGasto = this.gasto.gastoId;

        let api = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}/${idGasto}`;

        let form = event.currentTarget.form;

        let descApi = form.elements.descripcion.value;
        let valorApi = form.elements.valor.value;
        valorApi = parseFloat(valorApi);
        let fechaApi = form.elements.fecha.value;
        let etiApi = form.elements.etiquetas.value;
        let listadoEti = etiApi.split(",");

        let gastoApi = new gesPres.CrearGasto(descApi, valorApi, fechaApi, ...listadoEti);

        fetch (api, { method: "PUT",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(gastoApi)
        })
        .then(response => cargarGastosApi(response)); 

    }

}



export   {
    
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb

}