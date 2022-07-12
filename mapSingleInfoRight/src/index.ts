import { geoNaturalEarth1, geoPath, select, easeBounce, geoMercator } from 'd3';
import bundeslaender from '../assets/bundeslaender.geo.json';
import fbs from '../assets/fbs.geo.json';



const mapDiv = document.getElementById('map') as HTMLDivElement;
const cardContainer = document.getElementById('cards') as HTMLDivElement;


function setCard(fsf: typeof fbs.features[0]) {
    cardContainer.childNodes.forEach(c => cardContainer.removeChild(c));
    const element = document.createElement('div');
        element.classList.add('card');
        element.dataset.cardid = fsf.id + '';
    const header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = fsf.properties.title;
    const body = document.createElement('div');
        body.classList.add('content');
        body.innerHTML = fsf.properties.innerHTML;
    
    element.appendChild(header);
    element.appendChild(body);

    if (fsf.properties.href) {
        const moreButton = document.createElement('button');
            moreButton.classList.add('moreInfoButton');
            moreButton.innerHTML = 'Mehr Infos ...';
        const moreLink = document.createElement('a');
            moreLink.href = fsf.properties.href;
            moreLink.appendChild(moreButton);
        const more = document.createElement('div');
            more.classList.add('moreInfo');
            more.appendChild(moreLink);
        element.appendChild(more);
    }

    cardContainer.appendChild(element);
}



const colorActive = '#EE7937';
const colorInactive = '#EA6316';
const colorInactiveOutline = '#c95416';
const grayLight = '#e0e0e0';
const grayDark = '#969696';

const width = mapDiv.clientWidth;
const height = mapDiv.clientHeight;

const projection = geoMercator();
projection.fitSize([width, height], bundeslaender);
const geoGenerator = geoPath().projection(projection);

const root = select(mapDiv);

const svg = root
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const bundeslaenderElements = svg.append('g').attr('class', 'bundeslaender')
    .selectAll('bundesland')
    .data(bundeslaender.features)
    .enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('fill', grayLight)
    .attr('stroke', grayDark)
    .attr('class', 'bundesland');

const cities = svg.append('g').attr('class', 'cities')
    .selectAll('city')
    .data(fbs.features)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('fill', colorInactive)
    .attr('stroke', colorInactiveOutline)
    .attr('transform', d => {
        const coords = d.geometry.coordinates;
        const transformed = projection(coords);
        return `translate(${transformed[0]}, ${transformed[1]})`
    })
    .attr('class', 'city');

const hoverTextContainer = svg.append('g').attr('class', 'hovertext')
const hoverTextBg = hoverTextContainer.append('rect')
    .attr('transform', 'translate(-5, -12)')
    .attr('width', 100)
    .attr('height', 25)
    .style('fill', colorActive);
const hoverText = hoverTextContainer.append('text')
    .attr('dominant-baseline', 'central')
    .style('font-family', 'Open Sans')
    .style('font-weight', 'bold')
    .style('font-size', '1rem')
    .text('test');
hoverTextContainer.style('visible', 'hidden');

cities.on('mouseover', (evt, feature) => {
    const x = evt.layerX;
    const y = evt.layerY;
    hoverTextContainer.attr('transform', `translate(${x}, ${y})`);
    hoverText.text(feature.properties.title);
    hoverTextBg.attr('width', hoverText.node().getComputedTextLength() + 10);
    hoverTextContainer.style('visibility', 'visible');
});
// cities.on('mousemove', (event, feature) => {
// });
cities.on('mouseout', () => {
    hoverTextContainer.style('visibility', 'hidden');
});


cities.on('click', (evt, feature) => {
    evt.stopPropagation();
    focusOn(feature.id);
});
mapDiv.addEventListener('click', (evt) => {
    focusOn(0);
})


function focusOn(id: number) {
        // step 1: focus on card
        setCard(fbs.features.find(f => f.id === id)!);
        // step 2: focus on map
        cities
            .transition().ease(easeBounce)
            .attr('fill', d => d.id === id ? colorActive : colorInactive)
            .attr('r',    d => d.id === id ? 14 : 7);
}


focusOn(0);