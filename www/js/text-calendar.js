/*
  Copyright (C) 2023  cnngimenez

  text-calendar.js

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

var eventos = [];
var fecha_actual = new Date();

function parse_dates(json) {
    return json.map( (evento) => {
        evento.start_date = new Date(evento.start_date);
        evento.end_date = new Date(evento.end_date);

        return evento;
    });
}

function obtener_datos(callback) {
    fetch('data/eventos.json').then( (response) => {
        response.json().then( (data) => {
            eventos = parse_dates(data);
            callback(data);
        });
    });
}

function clonar_template(id) {
    let temp = document.querySelector('#' + id);
    return temp.content.cloneNode(true);
}

/**
 Convertir un evento a un elemento HMTL.
 */
function evento_to_elt(evento) {
    let div = clonar_template('tmp-evento');    

    div.querySelector('.evento-tipo').innerText = evento.type;
    div.querySelector('.evento-start-date').innerText = evento.start_date;
    div.querySelector('.evento-end-date').innerText = evento.end_date;
    div.querySelector('.evento-text').innerText = evento.text;
        
    return div;
}

function filtrar_eventos_hoy() {
    return eventos.filter( (evento) => {
        return evento.start_date <= fecha_actual &&
            fecha_actual <= evento.end_date;
    });
}

function actualizar_agenda() {
    var eventos_hoy = filtrar_eventos_hoy();
    let elt = document.querySelector('div#agenda');
    
    elt.innerHTML = '';    
    eventos_hoy.forEach( (evento) => {
        elt.append(evento_to_elt(evento));
    });
}

function startup() {
    obtener_datos(actualizar_agenda); 
}

if (document.readyState !== 'loading') {
    startup();
} else {
    document.addEventListener('DOMContentLoaded', startup);
}
