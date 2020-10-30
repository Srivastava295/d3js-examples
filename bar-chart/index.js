const svg = d3.select('svg');
const csv = d3.dsv;
const scaleLinear = d3.scaleLinear;
const scaleBand = d3.scaleBand;
const maxD3 = d3.max;
const axisLeft = d3.axisLeft;
const axisBottom = d3.axisBottom;
const d3Format = d3.format;

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
	const xValue = d => d.population;
	const yValue = d => d.country;

	const margin = {
		top: 50,
		right: 40,
		bottom: 70,
		left: 200,
	}

	const innerWidthW = width - margin.left - margin.right;
	const innerHeightH = height - margin.top - margin.bottom;

	const xScale = scaleLinear()
		.domain([0, maxD3(data, d => d.population)])
		.range([0, innerWidthW]);

	const yScale = scaleBand()
		.domain(data.map(yValue))
		.range([0, innerHeightH])
		.padding(0.1);

	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.right})`);

	const xAxisTickFormat = number =>
		d3Format('.3s')(number).replace('G', 'B');

	const xAxis = axisBottom(xScale)
		.tickFormat(xAxisTickFormat)
		.tickSize(-innerHeightH);

	g.append('g')
		.call(axisLeft(yScale))
		.selectAll('.domain, .tick line')
			.remove();

	const xAxisGroup = g.append('g')
		.call(xAxis)
			.attr('transform', `translate(0, ${innerHeightH})`);

	xAxisGroup.select('.domain').remove();

	xAxisGroup
		.append('text')
			.attr('class', 'axis-label')
			.attr('x', innerWidthW / 2)
			.attr('y', 30)
			.attr('fill', 'black')
		.text('Population');

	g.selectAll('rect').data(data)
		.enter().append('rect')
			.attr('y', d => yScale(yValue(d)))
			.attr('width', d => xScale(xValue(d)))
			.attr('height', yScale.bandwidth());

	g.append('text')
		.attr('class', 'title')
		.attr('y', -10)
		.text('Top 10 Most Populous Countries');
};

/*
csv(",", "data.csv",).then(data => {
	data.forEach(d => {
		d.population = +d.population * 1000
})
*/

csv(",", "data.csv", function (d) {
	return {
		country: d.country,
		population: +d.population * 1000
	}
}).then(data => {
	render(data);
})