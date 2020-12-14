/* ----------------------------------------------------------------------------
 * Appschedweb
 *
 * @package     Appschedweb
 * @author
 * @copyright
 * @license
 * @link
 * @since       v1.0.0
 * ---------------------------------------------------------------------------- */

(function () {

    'use strict';

    /**
     * Class ClosingDays
     *
     * Contains the closing days functionality.
     *
     * @class ClosingDays
     */
    var ClosingDays = function () {
        /**
         * This flag is used when trying to cancel row editing. It is
         * true only whenever the user presses the cancel button.
         *
         * @type {Boolean}
         */
        this.enableCancel = false;

        /**
         * This flag determines whether the jeditables are allowed to submit. It is
         * true only whenever the user presses the save button.
         *
         * @type {Boolean}
         */
        this.enableSubmit = false;
    };

    /**
     * Setup the dom the closing days.
     *
     * @param {Object} closingDays Contains the closing days.
     */
    ClosingDays.prototype.setup = function (closingDays) {
        const rowClosing =
            '<td>' +
            '<button type="button" class="btn btn-default btn-sm delete-closing-day" title="' + EALang.delete + '">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '</button>' +
            '</td>' +
            '</tr>';

        if (closingDays !== null) {
            $.each(closingDays, function (index, closingDay) {
                if (closingDay !== "") {
                    let tr =
                        '<tr class="closing-' + index + '">'
                        + '<td class="">'
                        + '<input type="text" class="form-control datepicker">'
                        + '</td>'
                        + rowClosing;
                    $('.closing-days tbody').append(tr);
                    let picker = $('.closing-' + index).find(".datepicker");
                    let dd = closingDay.replace('\'','').split('-');
                    let date = new Date();
                    date.setFullYear(parseInt(dd[2]));
                    date.setMonth(parseInt(dd[1] -1));
                    date.setDate(parseInt(dd[0]));
                    picker.datepicker(datePickerDefaultSettings());
                    picker.datepicker("setDate", date);
                }
            }.bind(this));
        }
    };

    /**
     * Binds the event handlers for the closing days dom elements.
     */
    ClosingDays.prototype.bindEventHandlers = function () {
        /**
         * Event: Add Closing Day Button "Click"
         *
         * A new row is added on the table and the user can enter the new closing
         * data. After that he can either press the save or cancel button.
         */
        $('.add-closing-day').click(function (e) {
            let rowClosing =
                '<td>' +
                '<button type="button" class="btn btn-default btn-sm delete-closing-day" title="' + EALang.delete + '">' +
                '<span class="glyphicon glyphicon-remove"></span>' +
                '</button>' +
                '</td>' +
                '</tr>';

            let tableSelector = '.closing-days';
            let cells = '<td class=""><input type="text" required class="form-control datepicker"></td>';
            let tr = '<tr>' + cells + rowClosing;
            $(tableSelector).prepend(tr);

            // Bind editable and event handlers.
            tr = $(tableSelector+" tr")[1];

            const date = new Date();
            date.setDate(date.getDate() - 1);
            $(tr).find(".datepicker").datepicker(datePickerDefaultSettings());
            $(tr).find(".datepicker").datepicker("setDate", date); //
            $(tr).find('.datepicker').datepicker('show');
        }.bind(this));

        /**
         * Event: Delete Break Button "Click"
         *
         * Removes the current line from the "Breaks" table.
         */
        $(document).on('click', '.delete-closing-day', function () {
            $(this).parent().parent().remove();
        });
    };

    /**
     * Get the closing days settings.
     *
     * @return {Object} Returns the closing days settings object.
     */
    ClosingDays.prototype.get = function () {
        let closingDays = [];
        if ($(".datepicker").length) {
            $( ".datepicker" ).each(function(i) {
                let date = $(this).datepicker("getDate");
                closingDays.push('\'' + date.getDate() + '-'
                    + (date.getMonth() + 1) + "-" + date.getFullYear() + '\'');
            });
        }
        return closingDays;
    };

    /**
     * Reset the current plan back to the company's default working plan.
     */
    ClosingDays.prototype.reset = function () {

    };

    function closingDaysActions() {
        return {
            dateFormat: "dd-mm-yy",
            defaultDate: Date.today(),
            firstDay: 0,
            minDate: 0,
            dayNames: [
                EALang.sunday,
                EALang.monday,
                EALang.tuesday,
                EALang.wednesday,
                EALang.thursday,
                EALang.friday,
                EALang.saturday
            ],
            dayNamesShort: [
                EALang.sunday.substr(0, 3),
                EALang.monday.substr(0, 3),
                EALang.tuesday.substr(0, 3),
                EALang.wednesday.substr(0, 3),
                EALang.thursday.substr(0, 3),
                EALang.friday.substr(0, 3),
                EALang.saturday.substr(0, 3)
            ],
            dayNamesMin: [
                EALang.sunday.substr(0, 2),
                EALang.monday.substr(0, 2),
                EALang.tuesday.substr(0, 2),
                EALang.wednesday.substr(0, 2),
                EALang.thursday.substr(0, 2),
                EALang.friday.substr(0, 2),
                EALang.saturday.substr(0, 2)
            ],
            monthNames: [
                EALang.january,
                EALang.february,
                EALang.march,
                EALang.april,
                EALang.may,
                EALang.june,
                EALang.july,
                EALang.august,
                EALang.september,
                EALang.october,
                EALang.november,
                EALang.december
            ],
            prevText: EALang.previous,
            nextText: EALang.next,
            currentText: EALang.now,
            closeText: EALang.close
        };
    };

    function datePickerDefaultSettings() {
        return {
            dateFormat: "dd-mm-yy",
            defaultDate: Date.today(),
            firstDay: 0,
            minDate: 0,
            dayNames: [
                EALang.sunday,
                EALang.monday,
                EALang.tuesday,
                EALang.wednesday,
                EALang.thursday,
                EALang.friday,
                EALang.saturday
            ],
            dayNamesShort: [
                EALang.sunday.substr(0, 3),
                EALang.monday.substr(0, 3),
                EALang.tuesday.substr(0, 3),
                EALang.wednesday.substr(0, 3),
                EALang.thursday.substr(0, 3),
                EALang.friday.substr(0, 3),
                EALang.saturday.substr(0, 3)
            ],
            dayNamesMin: [
                EALang.sunday.substr(0, 2),
                EALang.monday.substr(0, 2),
                EALang.tuesday.substr(0, 2),
                EALang.wednesday.substr(0, 2),
                EALang.thursday.substr(0, 2),
                EALang.friday.substr(0, 2),
                EALang.saturday.substr(0, 2)
            ],
            monthNames: [
                EALang.january,
                EALang.february,
                EALang.march,
                EALang.april,
                EALang.may,
                EALang.june,
                EALang.july,
                EALang.august,
                EALang.september,
                EALang.october,
                EALang.november,
                EALang.december
            ],
            prevText: EALang.previous,
            nextText: EALang.next,
            currentText: EALang.now,
            closeText: EALang.close
        };
    };

    window.ClosingDays = ClosingDays;
})();
