import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import * as d3 from 'd3';

const styles = StyleSheet.create({
	wrapper : {
		position : 'absolute',
		top : 100,
		left : 100,
		width : '100%',
		height : '100%',
		overflow : 'hidden',
		background : 'white',
		border : '1px solid #818181'
	},
	svg : {
		width : '100%',
		height : '100%'
	}
})


class Graph extends React.Component{
	state = {
    dimensions: {
      width: -1,
      height: -1
    }
	}
	data = [1]
	componentDidMount(){
		const g =  d3.select('#graph').selectAll('g').data(this.data);
		const container = g.enter().append('g')
		container.append('g').attr('class', 'links')
		container.append('g').attr('class', 'nodes')
		g.exit().remove();

		this.chart = d3.select('#graph').select('g');		
		this.simulation = null;
	}
	componentDidUpdate(){
		const {width, height} = this.state.dimensions;
		const margin = 60;
		const propName = 'recoverable tons year'//'estimated food waste generation  tons year ';
		const innerWidth = width-(margin*2), innerHeight = height-(margin*2);

		

		var color = d3.scaleOrdinal(d3.schemeCategory20);
		this.simulation && this.simulation.stop()
		this.simulation = d3.forceSimulation()
		    .force("link", d3.forceLink()
		    	.id(function(d) { return d.id; }))
		    .force("charge", d3.forceManyBody().strength(-500))
		    .force("center", d3.forceCenter(width / 2, height / 2));

		/* calc all edges */
		var nodes = this.props.categories;
		const edges = [];
		_.each(this.props.ideas, (val, key) => {
			_.each(val, (v,keyb) => {
				if(v && _.includes(nodes, key) && _.includes(nodes, keyb)){
					edges.push({
						source : key,
						target : keyb,
						value : 5
					})
				}
			})
		})
		nodes = nodes.map(n => ({
			id : n,
			group : this.props.clusters[n]||-1
		}))

		var link = this.chart.select('.links')
    	.selectAll('line')
    	.data(edges);
    var linkEnter = link.enter().append("line")
    		.style("stroke", "black")
	  linkEnter
	  	.merge(link)
	  	.attr("stroke-width", function(d) { return Math.sqrt(d.value); });
		link.exit().remove()


		var node = this.chart.select('.nodes')
    	.selectAll('circle')
    	.data(nodes, d=>d.id);
    var nodeEnter = node.enter().append("circle")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    nodeEnter.merge(node)
    	.attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
    node.exit().remove()

	  this.simulation
	    .nodes(nodes)
	    .on("tick", ticked);

	  this.simulation.force("link")
	    .links(edges);
		
		function ticked() {
		  linkEnter
	  	.merge(link)
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });
		  nodeEnter
	  	.merge(node)
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
		}
		function dragstarted(d) {
		  if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
		  d.fx = d.x;
		  d.fy = d.y;
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) this.simulation.alphaTarget(0);
		  d.fx = null;
		  d.fy = null;
		}
	}
	render = () => (
		<Measure shouldMeasure={true} onMeasure={dimensions => this.setState({dimensions})}>
			<div className={css(styles.wrapper)}>
				<svg id={'graph'} className={css(styles.svg)}>{}</svg>
			</div>
		</Measure>
	)
}

export default connect(
	state => ({
		ideas : state.ideas,
		categories : state.categories.present,
		clusters : state.clusters
	}) 
)(Graph);