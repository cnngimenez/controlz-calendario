<?php
/**
Copyright (C) 2023 cnngimenez

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

PHP version >7

@category ControlZ-Calendar
@package  ControlZ-Calendar
@author   Christian Gimenez <nomail@example.org>
@license  AGPLv3 https://www.gnu.org/licenses/agpl-3.0.html
@link     https://github.com/cnngimenez/controlz-calendario
 */

$eventos = [];
$last_id = 1;

/**
Convertir la fecha en español argentino al esperado por el scheduler.

@param $fecha String La fecha escrito en argentino.

@return La fecha esperada por el scheduler.
 */
function to_scheduler_date($fecha)
{
    $date = DateTimeImmutable::createFromFormat('d/m/Y', $fecha);
    if ($date) {
        return $date->format('Y-m-d');
    }
    
    return false;
}

/**
Parsear un archivo JSON con el formato propio.

El formato propio seria un JSON array como el siguiente:
```
[
  {"start" : "25/05/2023",
   "end" : "25/05/2023",
   "text" : "Revolución de mayo"
]
```

Agrega cada entrada a la variable $eventos.

@param $path   String El path del archivo a parsear.
@param $colour String El color para los eventos.

@return No hay retorno. Solo side-effect en $eventos y $last_id.
 */
function parse_own_format($path, $colour)
{
    global $eventos, $last_id;
    
    $fai_str = file_get_contents($path, 'r');
    $fai = json_decode($fai_str, true);
    foreach ($fai as $ev) {
        $start = to_scheduler_date($ev['start']);
        $ends =  to_scheduler_date($ev['end']);
        $eventos[] = [
            'id' => $last_id,
            'text' => $ev['text'],
            'start_date' => $start,
            'end_date' => $ends,
            'color' => $colour,
            'textColor' => 'white'
        ];
    
        $last_id += 1;        
    }
}

function parse_nacional_format($path, $colour)
{
    $nacional_str = file_get_contents($path, 'r');
    $nacional = json_decode($nacional_str, true);
    foreach ($nacional as $ev) {
        $fecha = to_scheduler_date($ev['date']);
        $eventos[] = [
            'id' => $last_id,
            'text' => $ev['label'] . '(' . $ev['type'] . ')',
            'start_date' => $fecha,
            'end_date' => $fecha,
            'color' => $color,
            'textColor' => 'white'
        ];
    
    $last_id += 1;
}

// Anexar fai.json
echo "Parsing fai.json...\n";
parse_own_format('www/data/fai.json', 'blue');

echo "Parsing fai-periodos.json...\n";
parse_own_format('www/data/fai-periodos.json', 'cyan');

// Anexar cs.json
echo "Parsing cs.json...\n";
parse_own_format('www/data/cs.json', 'brown');

// Parsear nacional.json
echo "Parsing nacional.json...\n";
parse_nacional_format('www/data/nacional.json', 'red');

// Escribir salida:
echo "Escribiendo salida a eventos.json...\n";
file_put_contents('www/data/eventos.json', json_encode($eventos));

echo "¡Listo!\n";
