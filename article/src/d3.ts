import { select } from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { scaleLinear } from 'd3-scale';
import { legendColor, LegendColor } from 'd3-svg-legend';
import { gray1Hex, color1Hex as red1Hex, color5Hex as red5Hex, gray2Hex } from './shared';


const d3ContainerElement = document.getElementById('d3container');
const width = d3ContainerElement.clientWidth;
const height = d3ContainerElement.clientHeight;

function trueWithProb(p: number) {
    return Math.random() <= p;
}


const d3Container = select(d3ContainerElement);
const svg = d3Container
    .append('svg').attr('width', width).attr('height', height)
    .append('g').attr('transform', 'translate(10, 10)');



const data = {
    "nodes": [
        { "node": 0, "name": "Name A" },
        { "node": 1, "name": "Name B" },
        { "node": 2, "name": "Name C" },
        { "node": 3, "name": "Name D" },
        { "node": 4, "name": "Name E" }
    ],
    "links": [
        { "source": 0, "target": 2, "value": 2 },
        { "source": 1, "target": 2, "value": 2 },
        { "source": 1, "target": 3, "value": 2 },
        { "source": 0, "target": 4, "value": 2 },
        { "source": 2, "target": 3, "value": 2 },
        { "source": 2, "target": 4, "value": 2 },
        { "source": 3, "target": 4, "value": 4 }
    ]
};

const colorScale = scaleLinear().domain([0, 1]).range([red1Hex, red5Hex]);


// layout to add positioning information to dataset
const sankeyLayout = sankey()
    .nodeWidth(width / 8)
    .nodePadding(width / 7)
    .size([width - 20, height - 20]);
const sankeyData = sankeyLayout(data);


// generator for link-path
const sankeyLinkPathGenerator = sankeyLinkHorizontal();


const link = svg.append('g')
    .selectAll('.link')
    .data(sankeyData.links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', sankeyLinkPathGenerator)
    .attr('fill', 'none')
    .attr('stroke', gray2Hex)
    .attr('stroke-width', d => d.width)
    .attr('stoke-opacity', 0.5);

const node = svg.append('g')
    .selectAll('.node')
    .data(sankeyData.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

const nodeRect = node
    .append('rect')
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => colorScale(d.x0 / width))
    .attr('opacity', 0.8);

const nodeText = node
    .append('text')
    .attr('transform', d => `translate(${(d.x1 - d.x0) / 2}, ${(d.y1 - d.y0) / 2}), rotate(90)`)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(d => d.name);


// https://tommykrueger.com/projects/d3tests/animation-path.php
const paths = link.nodes();
function loop() {
    const pNr = Math.floor(Math.random() * paths.length);
    const path = paths[pNr];
    const p = +path.getAttribute('stroke-width') / 200;
    // if (trueWithProb(p)) {
    if (trueWithProb(0.5)) {

        const pathLength = path.getTotalLength();
        const strokeWidth = +path.getAttribute('stroke-width');
        const offset = strokeWidth * Math.random() - (strokeWidth / 2);

        const circle = svg.append('circle')
            .attr('class', 'circle')
            .attr('r', 0)
            .attr('fill', () => {
                const p = path.getPointAtLength(0);
                return colorScale(p.x / width);                
            })
            .attr('opacity', 0.6)
            .attr('transform', () => {
                const p = path.getPointAtLength(0);
                return `translate(${p.x}, ${p.y + offset})`;
            })

            .transition()
            .duration(500)
            .attrTween('r', () => {
                return t => t * 5
            })

            .transition()
            .duration(5000)
            .attrTween('transform', () => {
                return (t) => {
                    const p = path.getPointAtLength(pathLength * t);
                    return `translate(${p.x}, ${p.y + offset})`;
                };
            })
            .attrTween('fill', () => {
                return (t) => {
                    const p = path.getPointAtLength(pathLength * t);
                    return colorScale(p.x / width);
                };
            })

            .transition()
            .duration(500)
            .attrTween('r', () => {
                return t => (1 - t) * 5
            })

            .remove();

    }
    setTimeout(loop, 100);
}

loop();


const legendContainerElement = document.getElementById('legendContainer');
const containerWidth = legendContainerElement.clientWidth;
const legendWidth = 150;
const legendContainer = select(legendContainerElement)
    .append('svg').attr('width', containerWidth).attr('height', 50)
    .append('g').attr('transform', `translate(${(containerWidth - legendWidth) / 2}, 10)`);
const legend = legendColor()
    .cells(7).orient('horizontal').shape('rect')
    .labels(['origin', '', '', '', '', '', 'destination'])
    .labelAlign('middle')
    .scale(colorScale);
legendContainer.call(legend);