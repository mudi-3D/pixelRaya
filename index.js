"use strict";

class PixelMudi {

    constructor() {

        /** Atributos asociados al usuario */
        this.userDevice = null;         // Dispositivo desde donde se inicio la sesión
        this.userTime = 0               // Tiempo que ha durado en la página
        this.model = ''                 // Modelo que se visitó en la pagina
        this.downloadPDF = 0            // click al botón descargar PDF
        this.registry = 0               // Click al botón enviar 
    };

    /** Método para identificar el dispositivo por el ancho de pantalla  ✅*/
    verifyDevice() {
        const widthUserScreen = window.innerWidth;

        if (widthUserScreen <= 768) {
            this.userDevice = 'Mobile';
        } else if (widthUserScreen > 768 && widthUserScreen <= 1024) {
            this.userDevice = 'Tablet';
        } else {
            this.userDevice = 'Computador';
        };
    };

    /** Método para determinar el tiempo que ha pasado ✅ */
    counterTime() {
        /** Por la naturaleza del sitio que es creado por JS  no limpiamos el intervalo. */
        setInterval(() => this.userTime++, 1000);
    };

    /** Métodpo para saber que modelo está siendo visitado ✅*/
    setModel() {
        const model = new URLSearchParams(location.search).get('raya');
        (model == '' || !model ) ? this.model = 'negro' : this.model = model;
    };

    /** Método para saber si descargaron el PDF  ✅*/
    setDownloadPDF() {

        const element = document.querySelector('.componentDownload_Containerdownload');

        if (!element) {
            requestAnimationFrame(this.setDownloadPDF.bind(this))
            return;
        };

        console.log(`Set PDF Button`)
        element.addEventListener('click', () => this.downloadPDF = 1);

    };

    /** Método para saber si enviaron el registro ✅*/
    setRegistry() {

        const element = document.querySelector('#BTNFORM');

        if (!element) {
            requestAnimationFrame(this.setRegistry.bind(this))
            return;
        };

        console.log(`Set registry Button`);

        element.addEventListener('click', () => {

            const name = document.querySelector('#NAME').value;
            const email = document.querySelector('#MAIL').value;
            const phone = document.querySelector('#TEL').value;
            const country = document.querySelector('#COUNTRY').value;
            if (name !== '' && email !== '' && phone !== '' && country !== '') { this.registry = 1 };

        });
    };

    /** Enviar los datos al servidor */
    sendDataToServer() {

        window.addEventListener('beforeunload', (e) => {

            // Enviar datos al servidor antes de salir
            fetch('https://viewer.mudi.com.co:3589/api/mudiv1/pixelRaya', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    device: this.userDevice,
                    time: this.userTime,
                    model: this.model,
                    downloadPDF: this.downloadPDF,
                    registry: this.registry
                })
            }).catch((error) => {
                console.error('Fetch failed:', error);
            });

        });

    };

    /** Metodo para iniciar el proceso del pixel de Mudi ✅*/
    async pixelMudiOn() {

        try {
            this.verifyDevice();
            this.counterTime();
            this.setModel();
            this.setDownloadPDF();
            this.setRegistry();
            this.sendDataToServer()
        } catch (error) {
            console.error(error);
        };

    };

};

const pixelMudi = new PixelMudi();
window.pixelMudi = pixelMudi;
pixelMudi.pixelMudiOn();
