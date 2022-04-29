import { Deck, FlyToInterpolator, GeoJsonLayer, ArcLayer } from 'deck.gl';
import * as data from '../assets/countries.geo.json';
import Splide from '@splidejs/splide';
import { gray1, gray2, color4Rgb, color1Rgb, gray3Rgb, gray2Rgb } from './shared';






const splide = new Splide('.splide');
splide.mount();
splide.on('moved', (index, prev, dest) => {
    switch (index) {
        case 0:
            animateIntoWorld();
            break;
        case 1:
            animateIntoEurope();
            break;
        case 2:
            animateIntoGermany();
            break;

    }
});


function uni(a: number, b: number) {
    const delta = b - a;
    return a + Math.random() * delta;
}

let startTime;
let endTime;
function loop(totalTime: number, timePassed: number, callback: (degree: number) => void) {
    if (!startTime) startTime = new Date().getTime();
    endTime = new Date().getTime();
    const newTimePassed = (endTime - startTime) + timePassed;
    const timeRemaining = totalTime - newTimePassed;

    startTime = new Date().getTime();
    callback(timePassed / totalTime);
    if (timeRemaining > 0) {
        setTimeout(() => loop(totalTime, newTimePassed, callback), 0);
    } else {
        callback(1.0);
        startTime = null;
        endTime = null;
    }
}

function animateIntoWorld() {

    const newViewState = {
        longitude: 0,
        latitude: 0,
        zoom: 0,
        pitch: 30,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
    };
    deck.setProps({ initialViewState: newViewState });

    const arcData = [{
        source: [uni(-160, 160), uni(-70, 70)],
        target: [uni(-160, 160), uni(-70, 70)],
        width: Math.random() * 20
    }, {
        source: [uni(-160, 160), uni(-70, 70)],
        target: [uni(-160, 160), uni(-70, 70)],
        width: Math.random() * 20
    }];

    loop(1000, 0, (degree) => {
        const newLayers = createLayers(arcData, degree);
        deck.setProps({ layers: newLayers });
        deck.redraw();
    });
}

function animateIntoEurope() {

    const newViewState = {
        longitude: 20,
        latitude: 50,
        zoom: 2,
        pitch: 50,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
    };
    deck.setProps({ initialViewState: newViewState });

    const arcData = [{
        source: [uni(-5, 25), uni(25, 60)],
        target: [uni(-5, 25), uni(25, 60)],
        width: Math.random() * 20
    }, {
        source: [uni(-5, 25), uni(25, 60)],
        target: [uni(-5, 25), uni(25, 60)],
        width: Math.random() * 20
    }, {
        source: [uni(-5, 25), uni(25, 60)],
        target: [uni(-5, 25), uni(25, 60)],
        width: Math.random() * 20
    }];

    loop(1000, 0, (degree) => {
        const newLayers = createLayers(arcData, degree);
        deck.setProps({ layers: newLayers });
        deck.redraw();
    });
}

function animateIntoGermany() {

    const newViewState = {
        longitude: 10,
        latitude: 52,
        zoom: 4,
        pitch: 50,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
    };
    deck.setProps({ initialViewState: newViewState });

    const arcData = [{
        source: [uni(9, 17), uni(42, 55)],
        target: [uni(9, 17), uni(42, 55)],
        width: Math.random() * 20
    }, {
        source: [uni(9, 17), uni(42, 55)],
        target: [uni(9, 17), uni(42, 55)],
        width: Math.random() * 20
    }, {
        source: [uni(9, 17), uni(42, 55)],
        target: [uni(9, 17), uni(42, 55)],
        width: Math.random() * 20
    }, {
        source: [uni(9, 17), uni(42, 55)],
        target: [uni(9, 17), uni(42, 55)],
        width: Math.random() * 20
    }];

    loop(1000, 0, (degree) => {
        const newLayers = createLayers(arcData, degree);
        deck.setProps({ layers: newLayers });
        deck.redraw();
    });
}



const canvasContainer = document.getElementById('canvasContainer');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const arcScale = 0;
const arcData = [];


function createLayers(arcData, arcScale) {
    const dataLayer = new GeoJsonLayer({
        id: 'data',
        data,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        opacity: 0.4,
        getLineColor: gray3Rgb,
        getFillColor: gray2Rgb,
    });

    const arcLayer = new ArcLayer({
        id: 'arcs',
        data: arcData,
        getSourcePosition: arc => arc.source,
        getTargetPosition: arc => arc.target,
        getWidth: arc => arc.width,
        getSourceColor: color1Rgb,
        getTargetColor: color4Rgb,
        widthScale: arcScale,
        updateTriggers: {
            getSourcePosition: [arcData],
            getTargetPosition: [arcData],
            getWidth: [arcData]
        }
    });

    const layers = [dataLayer, arcLayer];
    return layers;
}

const deck = new Deck({
    canvas,
    initialViewState: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
        bearing: 0,
        pitch: 30
    },
    width: canvasContainer.clientWidth,
    height: canvasContainer.clientHeight,
    layers: createLayers(arcData, arcScale),
    controller: {
        dragPan: false,
        scrollZoom: false
    }
});


animateIntoWorld();
