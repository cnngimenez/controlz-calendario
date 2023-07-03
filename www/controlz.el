;;; controlz.el --- Download Control Z calendar -*- lexical-binding: t; -*-

;; Copyright 2023 cnngimenez
;;
;; Author: cnngimenez
;; Maintainer: cnngimenez
;; Version: 0.1.0
;; Keywords: news
;; URL: https://github.com/cnngimenez/controlz-calendario
;; Package-Requires: ((emacs "27.1"))

;; This program is free software: you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation, either version 3 of the License, or
;; (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program.  If not, see <https://www.gnu.org/licenses/>.


;;; Commentary:
;; Funciones para descargar e importar a Emacs (Org-Mode) el calendario de
;; Control Z.

;;; Code:

;; [[file:emacs.org::*Requires][Requires:1]]
(require 'url-handlers)
;; Requires:1 ends here

;; [[file:emacs.org::*Constantes][Constantes:1]]
(defconst controlz-url-calendario
  "https://controlz.fi.uncoma.edu.ar/calendario/data/eventos.json"
  "URL a conectarse para descargar los eventos del calendario.")
;; Constantes:1 ends here

;; [[file:emacs.org::*controlz-download-events][controlz-download-events:1]]
(defun controlz-download-events ()
  "Descargar eventos desde la página Web.
Retornar el JSON parseado en un alist."
  (with-temp-buffer
    (url-insert-file-contents-literally controlz-url-calendario)
    (goto-char (point-min))
    (json-parse-buffer :object-type 'alist)))
;; controlz-download-events:1 ends here

;; [[file:emacs.org::*controlz-create-org-entry-from-event][controlz-create-org-entry-from-event:1]]
(defun controlz-create-org-entry-from-event (json-event)
  "Crear una entrada Org-mode desde un evento.
Crear un string con una entrada Org-mode producida desde el JSON.
JSON-EVENT es un alist parseada desde el JSON de la página."
  (let ((start (alist-get 'start_date json-event))
        (end (alist-get 'end_date json-event)))
    (if (string= start end)
        (format "\n* %s    :%s:\n    <%s>\n"
                (alist-get 'text json-event)
                (alist-get 'type json-event)
                start)
      (format "\n* %s    :%s:\n    <%s>--<%s>\n"
              (alist-get 'text json-event)
              (alist-get 'type json-event)
              start end))))
;; controlz-create-org-entry-from-event:1 ends here

;; [[file:emacs.org::*controlz-insert-org-from-events][controlz-insert-org-from-events:1]]
(defun controlz-insert-org-from-events (json-events)
  "Insert org entries per event in the current buffer.
JSON-EVENTS es un array con el parseo del JSON del calendario.
Utilizar `controlz-download-events'."
  (mapc (lambda (event)
          (insert (controlz-create-org-entry-from-event event)))
        json-events))
;; controlz-insert-org-from-events:1 ends here

;; [[file:emacs.org::*controlz-import-calendar-to-file][controlz-import-calendar-to-file:1]]
(defun controlz-import-calendar-to-buffer ()
  "Download the calendar and save the events in a buffer."
  (interactive)
  (with-current-buffer (get-buffer-create "Control Z - Calendar")
    (org-mode)
    (controlz-insert-org-from-events (controlz-download-events))
    (switch-to-buffer-other-window (current-buffer))))
;; controlz-import-calendar-to-file:1 ends here

(provide 'controlz)
;;; controlz.el ends here
