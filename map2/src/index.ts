import { geoNaturalEarth1, geoPath, select, easeBounce } from 'd3';
import bundeslaender from '../assets/bundeslaender.geo.json';
import fachstellen from '../assets/fachstellen.geo.json';


const containerDiv = document.getElementById('container');
const mapDiv = document.getElementById('map');
const cardContainer = document.getElementById('accordion');

for (const fsf of fachstellen.features) {
    const element = document.createElement('div');
        element.classList.add('card');
        element.dataset.cardid = fsf.id + '';
    const header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = fsf.properties.title;
    const body = document.createElement('div');
        body.classList.add('content');
        body.classList.add('content-hidden');
        body.innerHTML = fsf.properties.innerHTML;
    element.appendChild(header);
    element.appendChild(body);
    cardContainer.appendChild(element);
}

const cards = document.getElementsByClassName('card') as HTMLCollectionOf<HTMLDivElement>;


const colorActive = '#EE7937';
const colorInactive = '#EA6316';
const colorInactiveOutline = '#c95416';
const grayLight = '#e0e0e0';
const grayDark = '#969696';

const width = containerDiv.clientWidth / 2;
const height = mapDiv.clientHeight;

const projection = geoNaturalEarth1();
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
    .data(fachstellen.features)
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

const hoverText = svg.append('g').attr('class', 'hovertext')
    .append('text')
    // .attr("dominant-baseline", "central")
    // .style("font-family", "FontAwesome")
    .style("font-size", "30px")
    .text("test");
cities.on('mouseover', () => {
    hoverText.style('visibility', 'visible');
});
cities.on('mousemove', (event, feature) => {
    hoverText
});
cities.on('mouseout', () => {
    hoverText.style('visibility', 'hidden');
});


cities.on('click', (evt, feature) => {
    focusOn(feature.id);
});

for (const card of cards) {
    card.addEventListener('click', (evt) => {
        const id = +(card.dataset.cardid);
        focusOn(id);
    })
}


let focussedId = null;
function focusOn(id: number) {
    if (id < cards.length) {

        // step 1: focus on card
        if (focussedId !== null) {
            const lastCard = cards[focussedId];
            lastCard.getElementsByClassName('content')[0].classList.toggle('content-hidden');
        }
        const newCard = cards[id];
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        newCard.getElementsByClassName('content')[0].classList.toggle('content-hidden');

        // step 2: focus on map
        cities
            .transition().ease(easeBounce)
            .attr('fill', d => d.id === id ? colorActive : colorInactive)
            .attr('r',    d => d.id === id ? 14 : 7);

        // step 3:
        focussedId = id;

    }
}
