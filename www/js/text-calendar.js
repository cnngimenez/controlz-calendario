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
var fecha_actual_desde = new Date();
var fecha_actual_hasta = new Date();

/**
 Asignar la fecha de hoy a fecha_actual_desde.
 */
function fecha_actual_hoy() {
    fecha_actual_desde = new Date();
    fecha_actual_desde.setHours(0);
    fecha_actual_desde.setMinutes(0);
    fecha_actual_desde.setSeconds(0);
    
    fecha_actual_hasta = new Date();
    fecha_actual_hasta.setHours(23);
    fecha_actual_hasta.setMinutes(59);
    fecha_actual_hasta.setSeconds(59);
}

function fecha_actual_siguiente() {
    // 86400000 = 1000*60*60*24
    fecha_actual_desde.setTime(fecha_actual_desde.getTime() + 86400000);
    fecha_actual_hasta.setTime(fecha_actual_hasta.getTime() + 86400000);
}

function fecha_actual_anterior() {
    // 86400000 = 1000*60*60*24
    fecha_actual_desde.setTime(fecha_actual_desde.getTime() - 86400000);
    fecha_actual_hasta.setTime(fecha_actual_hasta.getTime() - 86400000);
    
}

function parse_dates(json) {
    return json.map( (evento) => {
        evento.start_date = new Date(evento.start_date);
        evento.end_date = new Date(evento.end_date);
        // Corrigiendo 24h. JS interpreta el string como un día antes.
        evento.start_date.setTime(evento.start_date.getTime() + 86400000)
        evento.end_date.setTime(evento.end_date.getTime() + 86400000)
        
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

 @param evento Un objeto JSON con los datos del evento.
 
 @return Un HTMLElement div.
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
        if (evento.start_date >= evento.end_date) {            
            return mostrar_tipos[evento.type] && fecha_actual_desde <=evento.start_date &&
                evento.start_date <= fecha_actual_hasta;
        } else {
            return mostrar_tipos[evento.type] && evento.start_date <= fecha_actual_desde &&
                fecha_actual_hasta <= evento.end_date;
        }
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
    let elt_fecha = document.querySelector('div#fecha-actual');
    let elt = document.querySelector('div#agenda');

    elt_fecha.innerText = 'Mostrando eventos de la fecha: ' + fecha_actual_desde.toLocaleString();
    
    elt.innerHTML = '';    
    eventos_hoy.forEach( (evento) => {
        elt.append(evento_to_elt(evento));
    });
}

function on_btn_hoy_clicked(event) {
    fecha_actual_hoy();
    actualizar_agenda();
}

function on_btn_anterior_clicked(event) {
    fecha_actual_anterior();
    actualizar_agenda();
}

function on_btn_siguiente_clicked(event) {
    fecha_actual_siguiente();
    actualizar_agenda();
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

    var btn = document.querySelector('button#btn-hoy');
    btn.addEventListener('click', on_btn_hoy_clicked);
    btn = document.querySelector('button#btn-siguiente');
    btn.addEventListener('click', on_btn_siguiente_clicked);
    btn = document.querySelector('button#btn-anterior');
    btn.addEventListener('click', on_btn_anterior_clicked);
}

function startup() {
    actualizar_mostrar_tipos();
    fecha_actual_hoy();
    obtener_datos(actualizar_agenda);
    asignar_handlers();
}

if (document.readyState !== 'loading') {
    startup();
} else {
    document.addEventListener('DOMContentLoaded', startup);
}
