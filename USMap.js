var us_gradient_map = function(){
	
	var value;
	var classes = "";
	
	function chart(selection){
		selection.each(function(data){
			
			var container = d3.select(this);
			var projection = d3.geoAlbersUsa();
			var path = d3.geoPath()
						.projection(projection);
						
			var gradient = d3.scaleLinear()
							.range([0.05,1])
							.domain([d3.min(data, value), d3.max(data, value)]);
									  
			var states = container.selectAll(".state")
								  .data(data);
			set_properties(states, gradient);
			
			states = 
				states.enter()
				.append("path")
				.attr("d", path);
				
			set_properties(states, gradient);
			states.exit().remove();
			
		});
	}

	function set_properties(states, gradient){
		states.attr("class", "state " + classes)
			  .style("opacity", function(d){
					if(d.properties.data == undefined) return 0;
						return gradient(value(d));
				});	
	}
		
	chart.value = function(val){
		if(!arguments.length) return value;
		
		value = function(d){ 
			if(d.properties.data == undefined) return NaN;
			return val(d.properties.data);
		};
		return this;
	};
	
	chart.classes = function(val){
		if(!arguments.length) return classes;
		
		classes = val;
		return this;
	};
	
	return chart;
	
};