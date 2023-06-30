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


function configurar_scheduler() {
    scheduler.config.first_hour = 6;
    scheduler.config.last_hour = 19;
    scheduler.init('scheduler', new Date(), "month");
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

function startup() {
    configurar_scheduler();
    actualizar_datos();
}

if (document.readyState !== 'loading') {
    startup();
} else {
    document.addEventListener('DOMContentLoaded', startup);
}
