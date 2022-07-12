import { geoNaturalEarth1, geoPath, select, easeBounce, geoMercator } from 'd3';
import bundeslaender from '../assets/bundeslaender.geo.json';
import fbs from '../assets/fbs.geo.json';


const containerDiv = document.getElementById('mapContainer') as HTMLDivElement;
const mapDiv = document.getElementById('map') as HTMLDivElement;

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


function focusOn(id: number) {
        cities
            .transition().ease(easeBounce)
            .attr('fill', d => d.id === id ? colorActive : colorInactive)
            .attr('r',    d => d.id === id ? 14 : 7);
}
