/**
 * jQuery Button Switch Plugin
 * Version 1.0.0
 * 
 * Minimal Usage: $('#switch').btnSwitch();
 * Settings:
 * Theme: Select a theme (Button, Light, Swipe, iOS, Android)
 * OnText: What to display for the "On" Button
 * OffText: What to display for the "Off" Button
 * OnValue: The value of the "On" Button
 * OffValue: The value of the "Off" Button
 * OnCallback: Callback on "On" selection
 * OffCallback: Callback on "Off" selection
 * ToggleState: Set the state of the switch toggle.
 * ConfirmChanges: Determines if we should confirm any changes
 * ConfirmText: What message we'll display to the user when ConfirmChanges is set to true
 * HiddenInputId: the hidden field the plugin should populate or false to not populate a hidden field
 */

if (typeof jQuery === "undefined") {
    alert("jQuery Switch Button requires jQuery");
    throw new Error("jQuery Switch Button requires jQuery");
}

if(jQuery.fn.jquery < "2.0") {
    alert('Incompatible version of jQuery detected, please upgrade to at least 2.0');
    throw new Error("Incompatible version of jQuery detected, please upgrade to at least 2.0");
}

(function($) {
    $.fn.btnSwitch = function(options) {
        // Private Methods
        var buttonClickEvent = function(dataToggle, toggle) {
            if (toggle == settings.OnValue) {
                $('button[data-toggle="' + dataToggle + '"][data-title="' + settings.OnValue + '"]').removeClass('button-default').addClass('button-on');
                $('button[data-toggle="' + dataToggle + '"][data-title="' + settings.OffValue + '"]').removeClass('button-off').addClass('button-default');

                if ($.isFunction(settings.OnCallback)) {
                    settings.OnCallback(toggle);
                }
            } else {
                $('button[data-toggle="' + dataToggle + '"][data-title="' + settings.OnValue + '"]').removeClass('button-on').addClass('button-default');
                $('button[data-toggle="' + dataToggle + '"][data-title="' + settings.OffValue + '"]').removeClass('button-default').addClass('button-off');

                if ($.isFunction(settings.OffCallback)) {
                    settings.OffCallback(toggle);
                }
            }

            $('button[data-toggle="' + dataToggle + '"]').not('[data-title="' + toggle + '"]').prop('disabled', false).removeClass('active').addClass('notActive');
            $('button[data-toggle="' + dataToggle + '"][data-title="' + toggle + '"]').prop('disabled', true).removeClass('notActive').addClass('active');
        };

        /**
         * @param {object} instance
         * @param {string} id
         * @param {boolean} toggle
         * @param {boolean|string} value
         */
        var lightClickEvent = function (instance, id, toggle, value) {
            if (!toggle) {
                $('#light-' + id).addClass('tgl-sw-light-checked tgl-sw-active');

                instance.data('state', true);

                if ($.isFunction(settings.OnCallback)) {
                    settings.OnCallback(value);
                }
            } else {
                $('#light-' + id).removeClass('tgl-sw-light-checked tgl-sw-active');

                instance.data('state', false);

                if ($.isFunction(settings.OffCallback)) {
                    settings.OffCallback(value);
                }
            }
        };

        /**
         * @param {object} instance
         * @param {string} id
         * @param {boolean} toggle
         * @param {boolean|string} value
         */
        var swipeClickEvent = function (instance, id, toggle, value) {
            if (!toggle) {
                $('#swipe-' + id).addClass('tgl-sw-swipe-checked tgl-sw-active');

                instance.data('state', true);

                if ($.isFunction(settings.OnCallback)) {
                    settings.OnCallback(value);
                }
            } else {
                $('#swipe-' + id).removeClass('tgl-sw-swipe-checked tgl-sw-active');

                instance.data('state', false);

                if ($.isFunction(settings.OffCallback)) {
                    settings.OffCallback(value);
                }
            }
        };

        /**
         * @param {object} instance
         * @param {string} id
         * @param {boolean} toggle
         * @param {boolean|string} value
         */
        var iosClickEvent = function (instance, id, toggle, value) {
            if (!toggle) {
                $('#ios-' + id).addClass('tgl-sw-ios-checked tgl-sw-active');

                instance.data('state', true);

                if ($.isFunction(settings.OnCallback)) {
                    settings.OnCallback(value);
                }
            } else {
                $('#ios-' + id).removeClass('tgl-sw-ios-checked tgl-sw-active');

                instance.data('state', false);

                if ($.isFunction(settings.OffCallback)) {
                    settings.OffCallback(value);
                }
            }
        };

        /**
         * @param {object} instance
         * @param {string} id
         * @param {boolean} toggle
         * @param {boolean|string} value
         */
        var androidClickEvent = function (instance, id, toggle, value) {
            if (!toggle) {
                $('#android-' + id).addClass('tgl-sw-android-checked tgl-sw-active');

                instance.data('state', true);

                if ($.isFunction(settings.OnCallback)) {
                    settings.OnCallback(value);
                }
            } else {
                $('#android-' + id).removeClass('tgl-sw-android-checked tgl-sw-active');

                instance.data('state', false);

                if ($.isFunction(settings.OffCallback)) {
                    settings.OffCallback(value);
                }
            }
        };

        var settings = $.extend({
            Theme: "Button",
            OnText: "On",
            OffText: "Off",
            OnValue: true,
            OffValue: false,
            OnCallback: null,
            OffCallback: null,
            ToggleState: false,
            ConfirmChanges: false,
            ConfirmText: 'Are you sure?',
            HiddenInputId: false
        }, options);

        return this.each(function() {
            var dataToggle = Math.floor((Math.random() * 1000000) + 1);
            var switchOnTpl, switchOffTpl;
            var btnSwitch = $(this);
            var id = this.id;

            switch(settings.Theme) {
                case 'Button':
                default:
                    switchOnTpl = '<div id="bsh-' + id + '">' +
                        '<button type="button" class="button-group button-on" data-toggle="' + dataToggle + '" data-title="' + settings.OnValue + '" disabled>' + settings.OnText + '</button>' +
                        '<button type="button" class="button-group button-default" data-toggle="' + dataToggle + '" data-title="' + settings.OffValue + '">' + settings.OffText + '</button>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    switchOffTpl = '<div id="bsh-' + id + '">' +
                        '<button type="button" class="button-group button-default" data-toggle="' + dataToggle + '" data-title="' + settings.OnValue + '">' + settings.OnText + '</button>' +
                        '<button type="button" class="button-group button-off" data-toggle="' + dataToggle + '" data-title="' + settings.OffValue + '" disabled>' + settings.OffText + '</button>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    btnSwitch.html(settings.ToggleState == settings.OnValue ? switchOnTpl : switchOffTpl);

                    $('#bsh-' + id + ' button').on('click', function() {
                        var sel = $(this).data('title');

                        if (settings.ConfirmChanges) {
                            if (confirm(settings.ConfirmText)) {
                                if (settings.HiddenInputId != false) {
                                    $('#' + settings.HiddenInputId).prop('value', sel);
                                }

                                buttonClickEvent(dataToggle, sel);
                            }
                        } else {
                            if (settings.HiddenInputId != false) {
                                $('#' + settings.HiddenInputId).prop('value', sel);
                            }

                            buttonClickEvent(dataToggle, sel);
                        }
                    });
                    break;
                case 'Light':
                    switchOnTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-light tgl-sw-light-checked tgl-sw-active" id="light-' + id +'" type="checkbox" checked>' +
                        '<label class="btn-switch" for="light-' + id +'" id="sw-light-'+ dataToggle + '" data-state="true"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    switchOffTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-light" id="light-' + id +'" type="checkbox">' +
                        '<label class="btn-switch" for="light-' + id +'" id="sw-light-'+ dataToggle + '" data-state="false"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    btnSwitch.html(settings.ToggleState == settings.OnValue ? switchOnTpl : switchOffTpl);

                    $('#sw-light-' + dataToggle).on('click', function() {
                        var state = $(this).data('state');
                        var selValue = !state ? settings.OnValue : settings.OffValue;

                        if (settings.ConfirmChanges) {
                            if (confirm(settings.ConfirmText)) {
                                if (settings.HiddenInputId != false) {
                                    $('#' + settings.HiddenInputId).prop('value', selValue);
                                }

                                lightClickEvent($(this), id, state, selValue);
                            }
                        } else {
                            if (settings.HiddenInputId != false) {
                                $('#' + settings.HiddenInputId).prop('value', selValue);
                            }

                            lightClickEvent($(this), id, state, selValue);
                        }
                    });
                    break;
                case 'Swipe':
                    switchOnTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-swipe tgl-sw-swipe-checked tgl-sw-active" id="swipe-' + id +'" type="checkbox" checked>' +
                        '<label class="btn-switch" for="swipe-' + id +'" id="sw-swipe-'+ dataToggle + '" data-tg-off="' + settings.OffText + '" data-tg-on="' + settings.OnText + '" data-state="true"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    switchOffTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-swipe" id="swipe-' + id +'" type="checkbox">' +
                        '<label class="btn-switch" for="swipe-' + id +'" id="sw-swipe-'+ dataToggle + '" data-tg-off="' + settings.OffText + '" data-tg-on="' + settings.OnText + '" data-state="false"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    btnSwitch.html(settings.ToggleState == settings.OnValue ? switchOnTpl : switchOffTpl);

                    $('#sw-swipe-' + dataToggle).on('click', function() {
                        var state = $(this).data('state');
                        var selValue = !state ? settings.OnValue : settings.OffValue;
                        var $checkbox = $('#swipe-' + id);

                        if (settings.ConfirmChanges) {
                            if (confirm(settings.ConfirmText)) {
                                if (settings.HiddenInputId != false) {
                                    $('#' + settings.HiddenInputId).prop('value', selValue);
                                }

                                swipeClickEvent($(this), id, state, selValue);
                            } else {
                                if($checkbox.is(':checked')){
                                    $checkbox.prop('checked', false);
                                } else {
                                    $checkbox.attr('checked', true);
                                }
                            }
                        } else {
                            if (settings.HiddenInputId != false) {
                                $('#' + settings.HiddenInputId).prop('value', selValue);
                            }

                            swipeClickEvent($(this), id, state, selValue);
                        }
                    });
                    break;
                case 'iOS':
                    switchOnTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-ios tgl-sw-ios-checked tgl-sw-active" id="ios-' + id +'" type="checkbox" checked>' +
                        '<label class="btn-switch" for="ios-' + id +'" id="sw-ios-'+ dataToggle + '" data-state="true"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    switchOffTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-ios" id="ios-' + id +'" type="checkbox">' +
                        '<label class="btn-switch" for="ios-' + id +'" id="sw-ios-'+ dataToggle + '" data-state="false"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    btnSwitch.html(settings.ToggleState == settings.OnValue ? switchOnTpl : switchOffTpl);

                    $('#sw-ios-' + dataToggle).on('click', function() {
                        var state = $(this).data('state');
                        var selValue = !state ? settings.OnValue : settings.OffValue;

                        if (settings.ConfirmChanges) {
                            if (confirm(settings.ConfirmText)) {
                                if (settings.HiddenInputId != false) {
                                    $('#' + settings.HiddenInputId).prop('value', selValue);
                                }

                                iosClickEvent($(this), id, state, selValue);
                            }
                        } else {
                            if (settings.HiddenInputId != false) {
                                $('#' + settings.HiddenInputId).prop('value', selValue);
                            }

                            iosClickEvent($(this), id, state, selValue);
                        }
                    });
                    break;
                case 'Android':
                    switchOnTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-android tgl-sw-android-checked tgl-sw-active" id="android-' + id +'" type="checkbox" checked>' +
                        '<label class="btn-switch" for="android-' + id +'" id="sw-android-'+ dataToggle + '" data-state="true"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    switchOffTpl = '<div id="bsh-' + id + '">' +
                        '<input class="tgl-sw tgl-sw-android" id="android-' + id +'" type="checkbox">' +
                        '<label class="btn-switch" for="android-' + id +'" id="sw-android-'+ dataToggle + '" data-state="false"></label>' +
                        '</div>' +
                        '<div style="clear:both"></div>';

                    btnSwitch.html(settings.ToggleState == settings.OnValue ? switchOnTpl : switchOffTpl);

                    $('#sw-android-' + dataToggle).on('click', function() {
                        var state = $(this).data('state');
                        var selValue = !state ? settings.OnValue : settings.OffValue;

                        if (settings.ConfirmChanges) {
                            if (confirm(settings.ConfirmText)) {
                                if (settings.HiddenInputId != false) {
                                    $('#' + settings.HiddenInputId).prop('value', selValue);
                                }

                                androidClickEvent($(this), id, state, selValue);
                            }
                        } else {
                            if (settings.HiddenInputId != false) {
                                $('#' + settings.HiddenInputId).prop('value', selValue);
                            }

                            androidClickEvent($(this), id, state, selValue);
                        }
                    });
                    break;
            }
        });
    };
}(jQuery));