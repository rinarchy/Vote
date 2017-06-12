// import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
// import {format} from 'd3-format';
// import {scaleOrdinal, schemeCategory20} from 'd3-scale';
// import {select} from 'd3-selection';

const sankey = require('d3-sankey');
const sankeyLinkHorizontal = sankey.sankeyLinkHorizontal;
const format = require('d3-format');
const scale = require('d3-scale');
const scaleOrdinal = scale.scaleOrdinal;
const schemeCategory20 = scale.schemeCategory20;
const select = require('d3-selection');

export default {
	mounted: function () {

		const history = {
			links: [
				{
					'source': 0,
					'target': 2,
					'value': 10
				},
				{
					'source': 1,
					'target': 2,
					'value': 5
				}
			],
			nodes: [
				{
					'name': 'a'
				},
				{
					'name': 'b'
				},
				{
					'name': 'c'
				}
			]
		};

		const formatNumber = format.format(',.1f');
		const color = scaleOrdinal(schemeCategory20);
		const svg = select.select('#chart');
		const margin = {top: 20, right: 20, bottom: 20, left: 20};
		const width = parseInt(svg.attr('width'), 10) - margin.left - margin.right;
		const height = parseInt(svg.attr('height'), 10) - margin.top - margin.bottom;
		const path = sankeyLinkHorizontal();
		const g = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.right})`);
		const sk = sankey.sankey()
			.nodeWidth(15)
			.nodePadding(10)
			.extent([[1, 1], [width, height]])
			.nodes(history.nodes)
			.links(history.links)
			.iterations(32);

		sk();

		const link = g.append('g')
			.selectAll('.link')
			.data(history.links)
			.enter()
			.append('path')
			.attr('class', 'link')
			.attr('d', path)
			.style('stroke-width', function (d) {
				return Math.max(1, d['dy']);
			})
			.sort(function (a, b) {
				return a['dy'] - b['dy'];
			});

		link.append('title')
			.text(function (d) {
				return `${d.source['name']} → ${d.target['name']}`;
			});
	},
	name: 'TallyChart',
};
