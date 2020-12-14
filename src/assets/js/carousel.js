/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2018, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.0.0
 * ---------------------------------------------------------------------------- */

(function () {

    'use strict';

    /**
     * Class Carousel
     *
     * Contains the carousel settings functionality. 
     *
     * @class Carousel
     */
    var Carousel = function () {
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
     * Setup the dom elements of a given carousel.
     *
     * @param {Object} carouselSettings Contains the elements that must be displayed on vide carousel
     */
    Carousel.prototype.setup = function (carouselSettings) {
        
        var rowClosing = '<td>' +
                        '<button type="button" class="btn btn-default btn-sm edit-break" title="' + EALang.edit + '">' +
                        '<span class="glyphicon glyphicon-pencil"></span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default btn-sm delete-break" title="' + EALang.delete + '">' +
                        '<span class="glyphicon glyphicon-remove"></span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default btn-sm save-break hidden" title="' + EALang.save + '">' +
                        '<span class="glyphicon glyphicon-ok"></span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default btn-sm cancel-break hidden" title="' + EALang.cancel + '">' +
                        '<span class="glyphicon glyphicon-ban-circle"></span>' +
                        '</button>' +
                        '</td>' +
                        '</tr>';
        
        $.each(carouselSettings, function (index, item) {
            if (item !== null) {
                var tr =
                    '<tr class="carousel-item">' +
                    '<td class="carousel-image"><img src="data:' + item.image + '" id="carousel-img-'+ index +'">'+
                    '<button type="button" class="btn btn-primary btn-xs" id="carousel-img-btn-'+ index +'">'+ EALang.upload +'</button></td>' +
                    '<td class="carousel-alt editable">' + item.alt + '</td>' +
                    '<td class="carousel-link editable">' + item.link + '</td>' +
                    '<td class="carousel-link-text editable">' + item.text + '</td>' +
                    rowClosing;
                $('.carousel-items tbody').append(tr);
                $('#carousel-img-btn-'+index).click(function(){    
                    $('#carousel-file-'+index).click();
                }); 
            } 
        }.bind(this));

        // Make break cells editable.
        this.editableField($('.carousel-items').find('.editable'));
    };

    /**
     * Enable editablefields.
     *
     * @param {Object} $selector The jquery selector ready for use.
     */
    Carousel.prototype.editableField = function ($selector) {
        $selector.editable(function (value, settings) {
            // Do not return the value because the user needs to press the "Save" button.
            return value;
        }, {
            placeholder: '',
            event: 'edit',
            height: '30px',
            submit: '<button type="button" class="hidden submit-editable">Submit</button>',
            cancel: '<button type="button" class="hidden cancel-editable">Cancel</button>',
            onblur: 'ignore',
            onreset: function (settings, td) {
                if (!this.enableCancel) {
                    return false; // disable ESC button
                }
            }.bind(this),
            onsubmit: function (settings, td) {
                if (!this.enableSubmit) {
                    return false; // disable Enter button
                }
            }.bind(this)
        });
    };

    /**
     * Binds the event handlers for the carousel dom elements.
     */
    Carousel.prototype.bindEventHandlers = function () {
        
        if($('.carousel-item').length===5){
            $('.add-carousel-item').prop('disabled', true);
        }
        
        /**
         * Event: Add Item Button "Click"
         *
         * A new row is added on the table and the user can enter the new item
         * data. After that he can either press the save or cancel button.
         */
        $('.add-carousel-item').click(function () {
            let elems = $('.carousel-item').length;
            if(elems<5){
                var tr = '<td>' +
                    '<button type="button" class="btn btn-default btn-sm edit-break" title="' + EALang.edit + '">' +
                    '<span class="glyphicon glyphicon-pencil"></span>' +
                    '</button>' +
                    '<button type="button" class="btn btn-default btn-sm delete-break" title="' + EALang.delete + '">' +
                    '<span class="glyphicon glyphicon-remove"></span>' +
                    '</button>' +
                    '<button type="button" class="btn btn-default btn-sm save-break hidden" title="' + EALang.save + '">' +
                    '<span class="glyphicon glyphicon-ok"></span>' +
                    '</button>' +
                    '<button type="button" class="btn btn-default btn-sm cancel-break hidden" title="' + EALang.cancel + '">' +
                    '<span class="glyphicon glyphicon-ban-circle"></span>' +
                    '</button>' +
                    '</td>' +
                    '</tr>';
                let cells = '<td class="carousel-image"><img class="hidden" id="carousel-img-'+ elems +'">'+
                        '<button type="button" class="btn btn-primary btn-xs" id="carousel-img-btn-'+ elems +'">'+ EALang.upload +'</button></td>' +
                        '<td class="carousel-alt editable"></td>' +
                        '<td class="carousel-link editable"></td>' +
                        '<td class="carousel-link-text editable"></td>' ;

                tr = '<tr class="carousel-item carousel-new-item">'+cells+tr;
                $('.carousel-items').append(tr);

                // Bind editable and event handlers.
                tr = $('.carousel-items tr')[elems+1];
                this.editableField($(tr).find('.editable'));
                $(tr).find('.edit-break').trigger('click');
                $(tr).find('.carousel-alt').find('input').focus();
                $('#carousel-img-btn-'+elems).click(function(){    
                    $('#carousel-file-'+elems).click();
                }); 
                }
            else{
                $('.add-carousel-item').prop('disabled', true);
            }
        }.bind(this));
    
        
        
        /**
         * Event: Uploading carousel image
         * 
         * Converts image in base64 and set it as img src
         */
        for(let index=0; index<=5; index++){
            $('#carousel-file-'+index).on('change',function(e){
                loadImageSrc(e,index);
            });
        }
              

        /**
         * Event: Edit Item Button "Click"
         *
         * Enables the row editing for the "Carousel" table rows.
         */
        $(document).on('click', '.edit-break', function () {
            // Reset previous editable tds
            var $previousEdt = $(this).closest('table').find('.editable').get();
            $.each($previousEdt, function (index, editable) {
                if (editable.reset !== undefined) {
                    editable.reset();
                }
            });

            // Make all cells in current row editable.
            //$(this).parent().parent().children().trigger('edit');
            $(this).parent().parent().find('.carousel-alt').focus();

            // Show save - cancel buttons.
            $(this).closest('table').find('.edit-break, .delete-break').addClass('hidden');
            $(this).parent().find('.save-break, .cancel-break').removeClass('hidden');
            $(this).closest('tr').find('select,input:text').addClass('form-control input-sm')
            $('.add-carousel-item').prop('disabled', true);
        });

        /**
         * Event: Delete item Button "Click"
         *
         * Removes the current line from the "Breaks" table.
         */
        $(document).on('click', '.delete-break', function () {
            $(this).parent().parent().remove();
            if($('.carousel-item').length<5){
                $('.add-carousel-item').prop('disabled', false);
            }
        });

        /**
         * Event: Cancel item Button "Click"
         *
         * Bring the ".breaks" table back to its initial state.
         *
         * @param {jQuery.Event} e
         */
        $(document).on('click', '.cancel-break', function (e) {
            var element = e.target;
            var $modifiedRow = $(element).closest('tr');
            let empty = null;
            $modifiedRow.find('.editable').each(function(index,elem){
                if($(elem).find('input').val()===''){
                    empty = $(elem);
                    return;
                }
            });
            if(!$modifiedRow.hasClass('carousel-new-item')){
                this.enableCancel = true;
                $modifiedRow.find('.cancel-editable').trigger('click');
                this.enableCancel = false;
                
                $(element).closest('table').find('.edit-break, .delete-break').removeClass('hidden');
                $modifiedRow.find('.save-break, .cancel-break').addClass('hidden');
                $('.add-carousel-item').prop('disabled', false);
            }
            else{
                $modifiedRow.find('.delete-break').trigger('click');
                $('.add-carousel-item').prop('disabled', false);
            }
        }.bind(this));
        

        /**
         * Event: Save Break Button "Click"
         *
         * Save the editable values and restore the table to its initial state.
         *
         * @param {jQuery.Event} e
         */
        $(document).on('click', '.save-break', function (e) {
            // Break's start time must always be prior to break's end.
            var element = e.target, $modifiedRow = $(element).closest('tr');
            
            let empty = null;
            $modifiedRow.find('.editable').each(function(index,elem){
                if($(elem).find('input').val()===''){
                    empty = $(elem);
                    return;
                }
            });
            if(!empty){
                this.enableSubmit = true;
                $modifiedRow.find('.editable .submit-editable').trigger('click');
                this.enableSubmit = false;
            
                $modifiedRow.find('.save-break, .cancel-break').addClass('hidden');
                $modifiedRow.removeClass('carousel-new-item');
                $(element).closest('table').find('.edit-break, .delete-break').removeClass('hidden');
                if($('.carousel-item').length===5){
                    $('.add-carousel-item').prop('disabled', true);
                }
                else{
                    $('.add-carousel-item').prop('disabled', false);
                }
            }
            else{
                $modifiedRow.find('.edit-break').trigger('click');
                empty.find('input').focus();
            }
        }.bind(this));
    };

    /**
     * Get the carousel settings.
     *
     * @return {Object} Returns the carousel settings object.
     */
    Carousel.prototype.get = function () {
        var carousel = {};
        $( ".carousel-item" ).each(function(index,elem) {
            let src = $(elem).find('img').attr('src');
            let alt = $(elem).find('.carousel-alt').text();
            let link = $(elem).find('.carousel-link').text();
            let text = $(elem).find('.carousel-link-text').text();
            carousel[index] = {
                image : src != null ? $(elem).find('img').attr('src').substring(5) : '',
                alt : alt,
                link : link,
                text : text
            };
        }.bind(this));
        return carousel;
    };

    /**
     * Reset the current plan back to the company's default carousel settings.
     */
    Carousel.prototype.reset = function () {

    };
    
    function loadImageSrc(event,index){
        let image = event.target.files[0];
        let encoded = toBase64(image);
        encoded.then((imageString) => {
            if (hasExtension('carousel-file-'+index, ['.jpg', '.gif', '.png', '.svg'])) {
                //console.log(imageString)
                $('#carousel-img-'+index).attr("src", imageString);
                $('#carousel-img-'+index).removeClass("hidden");
            }
            else{
             alert('error: format not supported.');
            }
        });
    }
    
    function hasExtension(inputID, exts) {
        var fileName = document.getElementById(inputID).value;
        return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    

    window.Carousel = Carousel;

})();
