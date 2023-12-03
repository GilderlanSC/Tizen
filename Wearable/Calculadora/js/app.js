define({
    name: 'app',
    requires: [
        'core/systeminfo',
        'views/main'
    ],
    def: function initApp() {
        'use strict';

        /**
         * Módulo de inicialização
         */
        function init() {
            console.log('APP::init');
        }

        return {
            init: init
        };
    }
});
