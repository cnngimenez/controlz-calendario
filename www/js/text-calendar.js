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

var mostrar_tipos = {};
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

    div.querySelector('.evento-tipo').style.backgroundColor = evento.color;
    div.querySelector('.evento-tipo').style.color = evento.textColor;
    div.querySelector('.evento-tipo').innerText = evento.type;
    div.querySelector('.evento-start-date').innerText = evento.start_date.toLocaleString();
    div.querySelector('.evento-end-date').innerText = evento.end_date.toLocaleString();
    div.querySelector('.evento-text').innerText = evento.text;
        
    return div;
}

function filtrar_eventos_hoy() {
    return eventos.filter( (evento) => {
        return mostrar_tipos[evento.type] && evento.start_date <= fecha_actual &&
            fecha_actual <= evento.end_date;
    });
}

/**
 Obtener si un checkbox de filtro es filtrado o no.

 @return True o false según lo que el usuario haya tildado.
 */
function get_filter(tipo) {
    let elt = document.getElementById('chk-' + tipo);
    
    return elt.checked;
}

function actualizar_mostrar_tipos(){
    // Sí, ya sé, copy-paste... Sorry, no DRY this time.
    mostrar_tipos = {
        radio: get_filter('radio'),
        fai: get_filter('fai'),
        fai_periodos: get_filter('fai-periodos'),
        nacional: get_filter('nacional'),
        cs: get_filter('cs'),
        controlz: get_filter('controlz')
    };

    return mostrar_tipos;
}

function actualizar_agenda() {
    var eventos_hoy = filtrar_eventos_hoy();
    let elt = document.querySelector('div#agenda');
    
    elt.innerHTML = '';    
    eventos_hoy.forEach( (evento) => {
        elt.append(evento_to_elt(evento));
    });
}

function on_chk_clicked(event) {
    actualizar_mostrar_tipos();
    actualizar_agenda();
}

function asignar_handlers() {
    var chk = document.getElementById('chk-nacional');
    chk.addEventListener('click', on_chk_clicked);
    chk = document.getElementById('chk-cs');
    chk.addEventListener('click', on_chk_clicked);
    chk = document.getElementById('chk-fai');
    chk.addEventListener('click', on_chk_clicked);
    chk = document.getElementById('chk-fai-periodos');
    chk.addEventListener('click', on_chk_clicked);
    chk = document.getElementById('chk-radio');
    chk.addEventListener('click', on_chk_clicked);
    chk = document.getElementById('chk-controlz');
    chk.addEventListener('click', on_chk_clicked);
}

function startup() {
    actualizar_mostrar_tipos();
    obtener_datos(actualizar_agenda);
    asignar_handlers();
}

if (document.readyState !== 'loading') {
    startup();
} else {
    document.addEventListener('DOMContentLoaded', startup);
}
