//Martínez Sańchez José Roberto
const CARRERASXCOPA = 3;

const fecha = document.querySelector("#fecha");
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Novimebre", "Diciembre"];
let f = new Date();
fecha.textContent = f.getDate() + "  " + meses[f.getMonth()] + "  " + f.getFullYear();

class Carrera
{
    constructor(nombre, valor)
    {
        this.nombre = nombre;
        this.valor = valor;
    }
}

class Copa
{
    constructor(numero)
    {
        this.numero = numero;
        this.carreras = [];
    }

    AgregarCarrera(nombre, valor)
    {
        if(this.carreras.length + 1 > CARRERASXCOPA)
            return false;

        this.carreras.push(new Carrera(nombre, valor));
        return true;
    }

    SumaCarreras()
    {
        let suma = 0;
        this.carreras.forEach(i => suma += i.valor);
        return suma;
    }
}

class Jugador
{
    constructor(nombre)
    {
        this.nombre = nombre;
        this.copas = [new Copa(1)];
    }

    AgregarCarrera(nombre, valor)
    {
        if(!this.copas[this.copas.length - 1].AgregarCarrera(nombre, valor))
        {
            let nuevaCopa = new Copa(this.copas.length + 1);
            nuevaCopa.AgregarCarrera(nombre, valor);
            this.copas.push(nuevaCopa);
        }
    }

    SumaCopas()
    {
        let suma = 0;
        this.copas.forEach(c => suma += c.SumaCarreras());
        return suma;
    }
}

class Equipo
{
    constructor(nombre)
    {
        this.nombre = nombre;
        this.jugadores = [];
    }

    AgregarJugador(jugador)
    {
        this.jugadores.push(jugador);
    }

    SumaJugadores()
    {
        let suma = 0;
        this.jugadores.forEach(j => suma += j.SumaCopas());
        return suma;
    }
}

function obtieneDatos()
{
    let lineas = document.querySelector("#areaTexto").value.split("\n");
    let equipos = [];
    let equipo = null;
    for(let i = 0; i < lineas.length; i++)
    {
        if(lineas[i] == false)
            continue;
            
        let cols = lineas[i].split(" ");
        if(cols.length == 1)
        {
            equipo = new Equipo(cols[0]);
            equipos.push(equipo);
            continue;
        }
        
        if(equipo == null)
            equipo = new Equipo("Unnamed");
        
        let jugador = new Jugador(cols[0]);
        for(let j = 1; j < cols.length; j++)
        {
            jugador.AgregarCarrera("Carrera " + j, Number(cols[j]));
        }
        equipo.AgregarJugador(jugador);
    }

    let jugadoresArr = [];
    for (let i = 0; i < equipos.length; i++)
    {
        let pts = equipos[i].SumaJugadores();
        console.group(equipos[i].nombre + " (" + pts + ")");
        let equipo = equipos[i];
        for(let j = 0; j < equipo.jugadores.length; j++)
        {
            let pts2 = equipo.jugadores[j].SumaCopas();
            console.groupCollapsed(equipo.jugadores[j].nombre + " (" + pts2 + ")");
            let jugador = equipo.jugadores[j];
            for(let k = 0; k < jugador.copas.length; k++)
            {
                console.groupCollapsed("Copa: " + jugador.copas[k].numero + " (" + jugador.copas[k].SumaCarreras() + ")");
                console.table(jugador.copas[k].carreras);
                console.groupEnd();
            }
            jugadoresArr.push(equipo.jugadores[j]);
            console.log(equipo.jugadores[j].copas.length + " copas, " + pts2 + " puntos totales");
            console.groupEnd();
        }
        console.log(equipo.jugadores.length + " jugadores, " + pts + " puntos totales");
        console.groupEnd();
        console.log();
    }
    jugadoresArr.sort(function (a, b) { return a.SumaCopas() - b.SumaCopas(); });
    equipos.sort(function (a, b) { return a.SumaJugadores() - b.SumaJugadores(); });
    equipos.reverse();

    console.log(equipos.length + " equipos");
    console.warn("*Desplegar grupos para ver detalles*");
    ConstruirFront(equipos, jugadoresArr);
}

function ConstruirFront(equipos, jugadoresSort)
{
    const equiposC = document.querySelector("#equipos");
    LimpiarContainer(equiposC);

    let lugarEq = 1;
    let anterior = null;
    equipos.forEach(equipo =>
    {
        const c = color();
        const luma = ((c[0] * 299) + (c[1] * 587) + (c[2] * 114)) / 1000;
        var l = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + 0.95 + ')';
        var ce = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + 1 + ')';

        let equipoC = container( "equipo");
        equipoC.style.color = luma < 155 ? "white" : "black";
        equipoC.style.background = 'linear-gradient(0deg, '+ l + ' 0%, ' + ce + ' 50%, ' + l + ' 100%)';
        if(anterior != null)
        {
            equipoC.style.borderTop = "solid black";
            const diff = container("diff");
            diff.appendChild(text("+-" + (anterior.SumaJugadores() - equipo.SumaJugadores()), "h5"));
            equipoC.appendChild(diff);
        }

        let nombre_equipo = container("nombre lados");
        if(lugarEq <= 2)
        {
            let imgLugarEq = document.createElement("img");
            imgLugarEq.src = Icono(lugarEq);
            nombre_equipo.appendChild(imgLugarEq);
        }
        nombre_equipo.appendChild(text(equipo.nombre, "h3"));
    
        let miembros = container("miembros");
        equipo.jugadores.forEach(jugador => 
        {
            let miembroC = container("miembro");
            miembroC.style.backgroundColor = luma < 155 ? "rgba(255, 255, 255, 0.171)" : "rgba(65, 65, 65, 0.171)" ;
            let miembroNC = container("nombre-miembro");
            miembroNC.appendChild(text(jugador.nombre, "h4"));

            let copasC = container("copas-miembro");
            jugador.copas.forEach(copa => copasC.appendChild(text(copa.SumaCarreras(), "h4")));

            let totalCC = container("total-miembro");
            totalCC.appendChild(text(jugador.SumaCopas(), "h4"));
            const lugar = (jugadoresSort.length - jugadoresSort.indexOf(jugador));
            if(lugar <= 3)
            {
                let imgLugar = document.createElement("img");
                imgLugar.src = Icono(lugar);
                totalCC.appendChild(imgLugar);
            }
            else
                totalCC.appendChild(text(lugar + "°", "h5"));
            

            miembroC.appendChild(miembroNC);
            miembroC.appendChild(copasC);
            miembroC.appendChild(totalCC);

            miembros.appendChild(miembroC);
        });
    
        let total_equipo = container("total lados");
        total_equipo.appendChild(text(equipo.SumaJugadores(), "h3"));
    
        equipoC.appendChild(nombre_equipo);
        equipoC.appendChild(miembros);
        equipoC.appendChild(total_equipo);
    
        equiposC.appendChild(equipoC);
        lugarEq ++;
        anterior = equipo;
    });
}

function container(nombreClase) {
    const c = document.createElement("div");
    c.className = nombreClase;
    return c;
}

function text(texto, h_) {
    const t = document.createElement(h_);
    t.textContent = texto;
    return t;
}

function LimpiarContainer(c)
{
    var first = c.firstElementChild;
    while (first) {
        first.remove();
        first = c.firstElementChild;
    }
}

function color() {
    var r = Math.random, s = 255;
    var rc = Math.round(r()*s);
    var g = Math.round(r()*s);
    var b = Math.round(r()*s);
    return [rc, g ,b];
}

function Icono(lugar) {
    switch(lugar)
    {
        case 1:
            return "img/corona.svg";
        case 2:
            return "img/segundo-premio.svg";
        case 3:
            return "img/tercer-premio.svg";
    }
    return "";
}