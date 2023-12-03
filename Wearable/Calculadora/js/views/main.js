/**
 * Módulo principal
 */
define({
    name: 'views/main',
    requires: [
        'models/errors',
        'models/model'
    ],
    def: function main(errors, model) {
        'use strict';

        /**
         * Delay 
         */
        var LONGTAP_DELAY = 400,

            /**
             * Intervalo de processamento
             */
            LONGTAP_REPEAT_INTERVAL = 20,

            /**
             * Númeor máximo de dígitos
             */
            MAX_DIGITS = 9,

            SMALL_FONT_THRESHOLD = 7,

            /**
             * Separador
             */
            SEPARATOR = ',',

            /**
             * Container para temporizadores
             */
            longTapRepeatTimers = {},

            /**
             * Mapeamento de sinais para HTML
             */
            operatorDisplays = {
                '+': '+',
                '-': '&minus;',
                '*': '&times;',
                '/': '&divide;'
            },

            /**
             * Mapeamento de strings para operadores
             */
            operatorKeys = {
                'add': '+',
                'sub': '-',
                'mul': '*',
                'div': '/'
            },

            /**
             * resultado elemento
             */
            resultElement = null,

            /**
             * valor do elemento resultado
             */
            resultValueElement = null,

            /**
             * Elemento equação
             */
            equationElement = null,

            /**
             * Elemento display
             */
            displayElement = null,

            /**
             * Error flag.
             */
            error = false,

            /**
             * Flag de sucesso na operação

             */
            result = false;

        /**
         * Lida com toque
         */
        function filterTap(ev) {
            // disable multitouch
            if (ev.touches.length > 1) {
                ev.stopPropagation();
                ev.preventDefault();
            }
        }

        /**
         * Apagar temporizadores registrados
         */
        function clearLongTapRepeatTimers(key) {
            if (longTapRepeatTimers['start' + key]) {
                window.clearTimeout(longTapRepeatTimers['start' + key]);
                longTapRepeatTimers['start' + key] = null;
            }

            if (longTapRepeatTimers['repeat' + key]) {
                window.clearInterval(longTapRepeatTimers['repeat' + key]);
                longTapRepeatTimers['repeat' + key] = null;
            }
        }

        /**
         * Retorna verdadeiro para resultado, e falso quando vazio
         */
        function isResultVisible() {
            return result;
        }

        /**
         * Limpa Elemento resultado
         * @private
         */
        function clear() {
            equationElement.classList.remove('top');
            resultValueElement.innerHTML = '';
            displayElement.classList.add('empty-result');
        }

        /**
         * Limpa Elemento resultado e flags
         * @private
         */
        function clearResult() {
            clear();
            result = false;
            error = false;
        }

        function show(result, error) {
            if (result === '') {
                return clear();
            }

            equationElement.classList.add('top');
            displayElement.classList.remove('empty-result');

            if (error === true) {
                resultElement.classList.add('error');
                if (result.length > MAX_DIGITS) {
                    resultElement.classList.add('small');
                } else {
                    resultElement.classList.remove('small');
                }
            } else {
                resultElement.classList.remove('error');
                resultElement.classList.remove('small');
            }

            resultValueElement.innerHTML = result.replace(/-/g, '&minus;');
        }

        /**
         * Mostra error em Elemento resultado
         */
        function showError(error) {
            show(error, true);
            error = true;
        }

        /**
         * Lida com precionamento de dígitos
         */
        function pushDigits(key) {
            if (!model.addDigit(key)) {
                showError('Only 10 digits available');
            }
        }

        /**
         * Adiciona separadores
         */
        function regexpReplacer(match, sign, p1) {
            var p1array = null;

            p1 = p1.split('').reverse().join('');
            p1array = p1.match(new RegExp('.{1,3}', 'g'));
            p1 = p1array.join(SEPARATOR);
            p1 = p1.split('').reverse().join('');

            return sign + p1;
        }


        /**
         * Adiciona separadores para equações
         */
        function addSeparators(equationString) {
            var negative = false;

            if (model.isNegativeComponent(equationString)) {
                equationString = RegExp.$2;
                negative = true;
            }
            equationString = equationString.replace(
                new RegExp('^(\\-?)([0-9]+)', 'g'),
                regexpReplacer
            );
            return negative ? '(-' + equationString + ')' : equationString;
        }

        /**
         * Mostra resultado em Elemento resultado
         */
        function showResult(res, err) {
            error = err || false;
            if (error) {
                error = true;
            }
            show(res, err);
            result = true;
        }

        /**
         * Calcula resultado e o mostra
         */
        function calculate() {
            var calculationResult = '';

            try {
                calculationResult = model.calculate();
                calculationResult = addSeparators(calculationResult);
                showResult('=&nbsp;' + calculationResult);
            } catch (e) {
                if (e instanceof errors.EquationInvalidFormatError) {
                    showResult('Wrong format');
                } else if (e instanceof errors.CalculationError) {
                    showResult('Invalid operation');
                } else if (e instanceof errors.InfinityError) {
                    showResult(
                        (e.positive ? '' : '&minus;') + '&infin;'
                    );
                } else {
                    showError('Unknown error.');
                    console.warn(e);
                }
            }
        }

        /**
         * Mostra equação dada
         */
        function showEquation(equation) {
            var e = 0,
                element = null,
                elementText = null,
                span = null,
                length = 0;

            equationElement.innerHTML = '';

            length = equation.length;
            for (e = 0; e < length; e += 1) {
                element = equation[e];
                span = document.createElement('span');
                elementText = element;
                if (Object.keys(operatorDisplays).indexOf(element) !== -1) {
                    span.className = 'operator';
                    elementText = operatorDisplays[element];
                } else {
                    elementText = addSeparators(elementText);
                }
                elementText = elementText.replace(/-/g, '&minus;');
                span.innerHTML = elementText;
                equationElement.appendChild(span);
            }

            if (equation[0] && equation[0].length >= SMALL_FONT_THRESHOLD) {
                equationElement.classList.add('medium');
            } else {
                equationElement.classList.remove('medium');
            }
        }

        /**
         * Atualiza campo de equação
         */
        function refreshEquation() {
            showEquation(model.getEquation());
        }

        /**
         * Lida com clique de dígitos (Keys)
         */
        function processKey(key) {
            var keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            if (isResultVisible()) {
                if (
                    Object.keys(operatorKeys).indexOf(key) === -1 &&
                    key !== 'del' &&
                    key !== 'eql' &&
                    key !== 'sign'
                ) {
                    model.resetEquation();
                }
            }
            clearResult();
            if (keys.indexOf(key) !== -1) {
                pushDigits(key);
            } else if (Object.keys(operatorKeys).indexOf(key) !== -1) {
                model.addOperator(operatorKeys[key]);
            } else if (key === 'dec') {
                model.addDecimal();
            } else if (key === 'del') {
                model.deleteLast();
            } else if (key === 'c') {
                model.resetEquation();
            } else if (key === 'sign') {
                model.changeSign();
            } else if (key === 'bracket') {
                model.addBracket();
            }
            if (key === 'eql' && !model.isEmpty()) {
                calculate();
            }
            refreshEquation();
        }

        /**
         * Registra view event listeners.
         */
        function bindEvents() {
            var numpad = document.getElementById('numpad');

            numpad.addEventListener('touchstart', function onTouchStart(e) {
                var key = '',
                    target = e.target,
                    classList = target.classList;

                if (!classList.contains('key') &&
                    !classList.contains('longkey')) {
                    return;
                }
                classList.add('press');
                key = target.id.replace(/key_/, '');
                if (classList.contains('long-tap-repeat')) {
                    longTapRepeatTimers['start' + key] = window.setTimeout(
                        function longtapStart() {
                            processKey(key);
                            longTapRepeatTimers['repeat' + key] =
                                window.setInterval(
                                    function longtapRepeat() {
                                        processKey(key);
                                    },
                                    LONGTAP_REPEAT_INTERVAL
                                );
                        },
                        LONGTAP_DELAY
                    );
                } else {
                    processKey(key);
                }

            });
            numpad.addEventListener('touchend', function onTouchEnd(e) {
                var key = '',
                    target = e.target,
                    classList = target.classList;

                if (!classList.contains('key') &&
                    !classList.contains('longkey')) {
                    return;
                }
                classList.remove('press');
                key = target.id.replace(/key_/, '');
                if (classList.contains('long-tap-repeat') &&
                    !longTapRepeatTimers['repeat' + key]) {
                    if (e.touches.length === 0) {
                        processKey(key);
                    }
                }
                clearLongTapRepeatTimers(key);
            });
            numpad.addEventListener('touchcancel', function onTouchCancel(e) {
                var key = '',
                    target = e.target,
                    classList = target.classList;

                if (!classList.contains('key') &&
                    !classList.contains('longkey')) {
                    return;
                }
                classList.remove('press');
                key = target.id.replace(/key_/, '');
                clearLongTapRepeatTimers(key);
            });
            document.addEventListener('tizenhwkey', function onTizenHwKey(e) {
                if (e.keyName === 'back') {
                    try {
                        tizen.application.getCurrentApplication().exit();
                    } catch (ignore) {}
                }
            });
        }

        /**
         * Inicialização do módulo UI
         */
        function init() {
            resultElement = document.getElementById('result');
            resultValueElement = document.getElementById('resultvalue');
            equationElement = document.getElementById('equation');
            displayElement = document.getElementById('display');
            bindEvents();
            // disable multitouch
            document.body.addEventListener('touchstart', filterTap, true);
            document.body.addEventListener('touchend', filterTap, true);
            refreshEquation();
        }

        return {
            init: init
        };
    }
});
