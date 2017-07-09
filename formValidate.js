/**
 * Created by rongootman on 09/07/2017.
 */
(function($){

    $.fn.formValidate = function(validationElements) {

        var form = {
            tagName  : $(this).prop('tagName'),
            selector : $(this).selector
        };

        var formAssets = [];

        var defaultSettings = {
            //invalid state:
            invalid_fieldClass: 'LV_invalid_field',
            invalid_msgClass: 'LV_validation_message',
            display__invalid_msg: false,
            invalid_msg: null,
            display__invalid_icon: false,
            invalid_iconClass: 'LV_invalid_icon',
            //valid state:
            display__valid_fieldClass: true,
            valid_fieldClass: 'LV_valid_field',
            display__valid_icon: false,
            valid_iconClass: 'LV_valid_icon'
        };

        var customFilters = {
            checkbox: {message: 'this box must be checked'}
        };

        var filterType = {
            text: {regex: /.+/, message: 'must fill out this field'},
            phone: {regex: /^[0-9-+]+$/, message: 'must provide a phone number'},
            email: {regex: /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i, message: 'must provide a valid email address'},
            password: {regex: /.{6,}/, message: 'password must include at least 6 characters'},
            select: {regex: /.+/, message: 'make sure to select an option'}
        };

        // create an array of filterType
        var commonInputTypes = Object.keys(filterType);

        function validateFormAsset (regex, input) {
            return regex.test(input.val());
        }

        function findClosetElemClass(target, siblingClass) {
            var firstTargetClass = target.next();
            if (firstTargetClass.hasClass(siblingClass)){
                return firstTargetClass;
            }
            var secondTargetClass = target.next().next();
            if (secondTargetClass.hasClass(siblingClass)){
                return secondTargetClass;
            }
            return false;
        }

        function getInvalidMsg(settings, defaultMsg) {
            return settings.invalid_msg ? settings.invalid_msg : defaultMsg;
        }

        function displayInvalid(target, settings) {
            // add invalid_fieldClass
            target.addClass(settings.invalid_fieldClass);
            //remove valid_fieldClass if display__valid_fieldClass is true
            if (settings.display__valid_fieldClass) {
                target.removeClass(settings.valid_fieldClass);
            }
            // remove valid_iconClass if display__valid_icon is true
            if (settings.display__valid_icon) {
                var validIconElem = findClosetElemClass(target, settings.valid_iconClass);
                if (validIconElem) {
                    validIconElem.remove();
                }
            }
            // add invalid_msg if display__invalid_msg is true
            if (settings.display__invalid_msg) {
                var invalidMsgElem = $('<span>', {class: settings.invalid_msgClass, text: settings.invalid_msg});
                target.after(invalidMsgElem);
            }
            // add invalid_iconClass if display__invalid_icon is true
            if (settings.display__invalid_icon) {
                var invalidIconElem = $('<span>', {class: settings.invalid_iconClass});
                target.after(invalidIconElem);
            }
            return false;
        } // displayInvalid

        function displayValid (target, settings) {
            // remove invalid_fieldClass
            target.removeClass(settings.invalid_fieldClass);
            // remove invalid_iconClass if display__invalid_icon is true
            if (settings.display__invalid_icon) {
                var invalidIconElem = findClosetElemClass(target, settings.invalid_iconClass);
                if (invalidIconElem) {
                    invalidIconElem.remove();
                }
            }
            // remove invalid_msgClass if exists settings.display__invalid_msg is true
            if (settings.display__invalid_msg) {
                var invalidMsgElem = findClosetElemClass(target, settings.invalid_msgClass);
                if (invalidMsgElem) {
                    invalidMsgElem.remove();
                }
            }
            // add valid_fieldClass if display__valid_fieldClass is true
            if (settings.display__valid_fieldClass) {
                // var successClass = settings.customSuccessClass ? settings.customSuccessClass : 'LV_valid_field';
                target.addClass(settings.valid_fieldClass);
            }
            // add valid_iconClass if display__valid_icon is true
            if (settings.display__valid_icon) {
                var validIconElem = $('<span>', {class: settings.valid_iconClass})
                target.after(validIconElem);
            }

            return true;
        } // displayValid

        function resetElement (element, settings) {
            //remove invalid_class
            element.removeClass(settings.invalid_fieldClass);
            //remove valid_fieldClass if display__valid_fieldClass is true
            if (settings.display__valid_fieldClass) {
                element.removeClass(settings.valid_fieldClass);
            }
            // remove valid_iconClass if display__valid_icon is true
            if (settings.display__valid_icon) {
                var validIconElem = findClosetElemClass(element, settings.valid_iconClass);
                if (validIconElem) {
                    validIconElem.remove();
                }
            }
            // remove invalid_iconClass if display__invalid_icon is true
            if (settings.display__invalid_icon) {
                var invalidIconElem = findClosetElemClass(element, settings.invalid_iconClass);
                if (invalidIconElem) {
                    invalidIconElem.remove();
                }
            }
            // remove invalid_msgClass if exists settings.display__invalid_msg is true
            if (settings.display__invalid_msg) {
                var invalidMsgElem = findClosetElemClass(element, settings.invalid_msgClass);
                if (invalidMsgElem) {
                    invalidMsgElem.remove();
                }
            }
        } // resetElement

        /**
         * Tests if a form Element is valid or not
         * @param {htmlDom} element
         * @param {object} settings
         * @returns {boolean}
         */
        function validateElement (element, settings) {
            var errorFlag = false;
            resetElement(element, settings);
            // deal with inputs element
            if (element.is('input')) {
                var inputType = element.attr('type');
                // deal with typical common inputs
                if (commonInputTypes.indexOf(inputType) >= 0) {
                    displayValid(element, settings);
                    //prepare for validation
                    var inputTypeRegex = filterType[inputType].regex;
                    if (!validateFormAsset(inputTypeRegex, element)) {
                        // set the invalid_msg if custom or default
                        settings.invalid_msg = getInvalidMsg(settings, filterType[inputType].message);
                        displayInvalid(element, settings);
                        errorFlag = true;
                    }
                }
                // deal with checkbox input
                if (inputType === 'checkbox') {
                    displayValid(element, settings);
                    if (!element.prop('checked')) {
                        settings.invalid_msg = getInvalidMsg(settings, customFilters.checkbox.message);
                        displayInvalid(element, settings);
                        errorFlag = true;
                    }
                }
            } // if is input
            //deal with select element
            if (element.is('select')) {
                displayValid(element, settings);
                //prepare for validation
                var checkboxRegex = filterType.select.regex;
                if (!validateFormAsset(checkboxRegex, element)) {
                    // set the invalid_msg if custom or default
                    settings.invalid_msg = getInvalidMsg(settings, filterType.select.message);
                    displayInvalid(element, settings);
                    errorFlag = true;
                }
            } // select validate
            // deal with textarea element
            if (element.is('textarea')) {
                displayValid(element, settings);
                //prepare for validation
                var textareaRegex = filterType.text.regex;
                if (!validateFormAsset(textareaRegex, element)) {
                    settings.invalid_msg = getInvalidMsg(settings, filterType.text.message);
                    displayInvalid(element, settings);
                    errorFlag = true;
                }
            }
            return errorFlag;
        } // validateElement

        function validateOnBlur (){
            formAssets.forEach(function(asset){
                (asset.element).blur(function(){
                    validateElement(asset.element, asset.settings);
                })
            })
        } // validateOnBlur

        function validateOnClick () {
            formAssets.forEach(function(asset){
                (asset.element).click(function(){
                    validateElement(asset.element, asset.settings);
                })
            })
        } // validateOnClick

        function configureFormAssets(validationElement) {
            var formAsset = {};
            var settings = Object.create(defaultSettings);
            var className = validationElement;
            if (validationElement.name) {
                settings = $.extend(settings, validationElement);
                className = validationElement.name;
            }
            // check if formAsset.element is located via class or id
            formAsset.element = $(form.tagName + form.selector + ' .' + className).length >= 1 ?
                $(form.tagName + form.selector + ' .' + className) :
                formAsset.element = $(form.tagName + form.selector + ' #' + className);

            formAsset.settings = settings;
            formAssets.push(formAsset);
        }

        // check if validationElements is an array
        Array.isArray(validationElements) ? validationElements.forEach(configureFormAssets) : configureFormAssets(validationElements);

        return {
            formAssets : formAssets,
            validateElement :   validateElement,
            validateOnBlur  :   validateOnBlur(),
            validateOnClick :   validateOnClick(),
            validateOnSubmit:   function (formAssets) {
                var globalErrorFlag = false;
                formAssets.forEach(function(asset){
                    globalErrorFlag = validateElement(asset.element, asset.settings);
                });
                return globalErrorFlag;
            }
        };
    } // formValidate
})(jQuery);