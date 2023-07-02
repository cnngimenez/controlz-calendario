/*
  Copyright (C) 2023  cnngimenez

  index.js

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

/**
 Filtro para mostrar o ocutlar eventos del calendario.
 */
var mostrar_tipos = {};

function configurar_scheduler() {
    // scheduler.config.readonly = true;
    scheduler.config.readonly = true;
    scheduler.config.readonly_form = true;
    scheduler.config.first_hour = 6;
    scheduler.config.last_hour = 19;
    scheduler.i18n.setLocale("es");
    scheduler.plugins({
        tooltip: true,
        recurring: true,
        readonly: true,
        agenda_view: true,
        year_view: true
    });
    scheduler.locale.labels.agenda_tab="Agenda";
    var format = scheduler.date.date_to_str("%d/%m/%Y %H:%i"); 
    scheduler.templates.tooltip_text = function(start,end,event) {
        return "<b>Evento:</b> " + event.text +
            "<br/><b>Comienzo:</b> " + format(start) +
            "<br/><b>Fin:</b> " + format(end);
    };

    scheduler.filter_week = function (id, event) {
        return mostrar_tipos[event.type];
    };
    scheduler.filter_day = function (id, event) {
        return mostrar_tipos[event.type];
    };
    scheduler.filter_month = function (id, event) {
        return mostrar_tipos[event.type];
    };
    scheduler.filter_year = function (id, event) {
        return mostrar_tipos[event.type];
    };
    
    scheduler.init('scheduler', new Date(), "month");
}

function actualizar_filtro() {
    scheduler.update_view();
}

/**
 Obtener si un checkbox de filtro es filtrado o no.

 @return True o false según lo que el usuario haya tildado.
 */
function get_filter(tipo) {
    let elt = document.getElementById('chk-' + tipo);
    
    return elt.checked;
}

/**
 Actualizar variable mostrar_tipos con los checkboxes.

 La actualización es por side-effect. También se retorna.
 
 @return La variable mostrar_tipos;
 */
function actualizar_mostrar_tipos() {
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

function obtener_datos(callback) {
    fetch('data/eventos.json').then( (response) => {
        response.json().then( (data) => {
            console.log('Data:');
            console.log(data);
            callback(data);
        });
    });
}

function actualizar_datos(){
    obtener_datos((data) => {
        scheduler.parse(data);
    });
}

function on_chk_clicked(event) {
    actualizar_mostrar_tipos();
    actualizar_filtro();
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
    configurar_scheduler();
    actualizar_mostrar_tipos();
    actualizar_datos();
    asignar_handlers();
}

if (document.readyState !== 'loading') {
    startup();
} else {
    document.addEventListener('DOMContentLoaded', startup);
}
