import { Anuncio_Auto } from "./anuncio.js";
//import { crearTabla } from "./tabla.js";

let idSeleccionado = "";

const anuncios = JSON.parse(localStorage.getItem("lista")) || [];
const $divTabla = document.getElementById("divLista");



window.addEventListener("click", ()=>{

    document.forms[0].addEventListener("submit", handlerSubmit);

    document.addEventListener("click", handlerClick);


  
   actualizaraTabla(anuncios);


});



// No tocar


function actualizaraTabla(e){

    while($divTabla.hasChildNodes()) //mientras halla un nodo hijo sigue dando true
    {
        $divTabla.removeChild($divTabla.firstElementChild);
    }

    const data = JSON.parse(localStorage.getItem("lista"));

    if(data)
    {
        $divTabla.appendChild(crearTabla(data));

    }
    
}




const crearTabla = (data) =>
{
    const tabla = document.createElement("table");  /* creo tabla*/ 
    const thead = document.createElement("thead"); //creo columna de arriba
    const tbody = document.createElement("tbody"); //creo fila 
    const cabecera = document.createElement("tr"); //creo cuadro que va en el thead
    

    //cargo la cabecera , thead
    for (const key in data[0])  //recorro el primer elemento del array
    {
        if(key !== "id") //no pongo el id en la cabecera
        {
            const th = document.createElement("th"); //creo cuadro de separacion de la columna thead
            const contenido = document.createTextNode(key); //guardo el texto de key     
            th.appendChild(contenido); // guardo el titulo obtenido en el cuadro th

            cabecera.appendChild(th); // guardo el cuatro en la cabecera
        }
    }
    thead.appendChild(cabecera);
    tabla.appendChild(thead);
    
    
    
    

    //cargo la fila , tbody
    
    data.forEach(element =>  //reccorro todo el aray
    {
        const tr = document.createElement("tr");
        
        for (const key in element) 
        {
            if(key === "id")
            {
                tr.setAttribute("data-id",element[key]);
            }
            else
            {
                const td = document.createElement("td"); //creo celda para guardar la info
                td.textContent = element[key];
                tr.appendChild(td);

            }          
        }
        tbody.appendChild(tr);
    });

tabla.appendChild(tbody);


return tabla;
}
function handlerClick(e){

    if(e.target.matches("td")){
        let id = e.target.parentNode.dataset.id;
        idSeleccionado = id;
        console.log("EL ID SELECCIONADO ES : " + id);
        cargarFormulario(idSeleccionado);
        
    }else if (e.target.matches("#btnEliminar")) {
        let id = document.forms[0].id.value;

        if (confirm("Confirma la eliminacion ?")){

            agregarSpinner();
            setTimeout(()=>{

                let index = anuncios.findIndex((el)=>el.id ==id);
                handlerDelete(index);
                eliminarSpinner();
            },3000);
            
        }
        limpiarFormulario(document.forms[0]);
    }
}

const handlerDelete = (id)=>{

    let indice = anuncios.findIndex((anuncio)=>{
        return anuncio.id == id;
    });

    anuncios.splice(indice, 1); //recortar lo que esta e el indice una posicion

    almacenarDatos(anuncios); 
    actualizaraTabla();
};


function handlerSubmit(e){
    e.preventDefault();
    

    if(  document.getElementById("btnSubmit").value == "Modificar"){
        const anuncioEditado = new AnuncioAuto(
            parseInt(frm.id.value),
            e.target.titulo.value,
            e.target.transaccion.value,
            e.target.descripcion.value,
            e.target.precio.value,
            e.target.num_puertas.value,
            e.target.num_kmh.value,
            e.target.potencia.value

        );
        
        if (confirm("Confirma Modificacion?")){
            agregarSpinner();
            setTimeout(()=>{
                modificarAnuncio(anuncioEditado);
                eliminarSpinner();
            },3000);
        }

    }else if (  document.getElementById("btnSubmit").value = "Guardar"){

        console.log("Dando de alta");

        const nuevoAnuncio = new Anuncio_Auto(
            Date.now(),
            e.target.titulo.value,
            e.target.transaccion.value,
            e.target.descripcion.value,
            e.target.precio.value,
            e.target.num_puertas.value,
            e.target.num_kmh.value,
            e.target.potencia.value
        );

            agregarSpinner();
            setTimeout(()=>{
                altaAnuncio(nuevoAnuncio);
                eliminarSpinner();
            },3000);

        }
        limpiarFormulario(e.target);
}


// No tocar


function agregarSpinner(){
    let spinner = document.createElement("img");
    spinner.setAttribute("src","./assets/1495.gif");
    spinner.setAttribute("alt","Imagen spinner");
    document.getElementById("spinner-container").appendChild(spinner);
}

// No tocar

function eliminarSpinner(){
    document.getElementById("spinner-container").innerHTML="";
}

function altaAnuncio(a){
    anuncios.push(a);
    almacenarDatos(anuncios);
    actualizaraTabla();
}

function  modificarAnuncio(a){
    let index = anuncios.findIndex((anuncio)=>{
        return anuncio.id == a.id;
    });

    anuncios.splice(index , 1 , a);
    anuncios.push(anuncios)
    almacenarDatos(anuncios);
    actualizaraTabla();

}

// No tocar


function almacenarDatos(data){
    localStorage.setItem("lista",JSON.stringify(data));
    
}



function limpiarFormulario(frm){
    frm.reset(); //reincio formulario
    document.getElementById("btnEliminar").classList.add("oculto");
    document.getElementById("btnSubmit").value = "Guardar";

    document.forms[0].id.value = "" ;
}



function cargarFormulario(id){

    let Anuncio = null;

    const frm = document.forms[0];
    
    Anuncio = anuncios.filter(p => p.id == id)[0];

    frm.id.value = Anuncio.id;
    frm.titulo.value= Anuncio.titulo;
    frm.transaccion.value= Anuncio.transaccion;
    frm.descripcion.value= Anuncio.descripcion;
    frm.precio.value= Anuncio.precio;
    frm.num_puertas.value= Anuncio.num_puertas;
    frm.num_kmh.value= Anuncio.num_kmh;
    frm.potencia.value= Anuncio.potencia;


    document.getElementById("btnSubmit").value = "Modificar";
    document.getElementById("btnEliminar").classList.remove("oculto");
}


