var scatter_plot = function(){
	
	var x;
	var y;
	var height;
	var width;
	var radius;
	var classes = "";
	
	function chart(selection){
		
		selection.each(function(data){
			var xMax = d3.max(data, x);
			var yMax = d3.max(data, y);
			
			var xScale = d3.scaleLinear()
						.range([0, width])
						.domain([0, xMax]);
						
			var yScale = d3.scaleLinear()
						.range([height, 0])
						.domain([0, yMax]);
						
						
			var xAxis = d3.axisBottom()
						.scale(xScale)
						.ticks(4);
						
			var yAxis = d3.axisLeft()
						.scale(yScale)
						.ticks(4);
						
						
			var svg = d3.select(this);
			
			var x_axis = svg.selectAll(".x-axis");
			if(x_axis.empty()){
				x_axis = svg.append("g")
				.attr("class", "axis x-axis");
			}
			x_axis.attr("transform", "translate(0," + height + ")") 
			.call(xAxis);
				
			var y_axis = svg.selectAll(".y-axis");
			if(y_axis.empty()){
				y_axis = svg.append("g")
				.attr("class", "axis y-axis");
			}
			y_axis.call(yAxis);
								
			var points = svg.selectAll(".point")
			.data(data);
				
			update(points, xScale, yScale);
			
			points = points.enter();
			
			init(points, xScale, yScale);
			
			points.exit().remove();
		});
	
	}
	
	function init(points, xScale, yScale){
		points = points.append("circle")
		update(points, xScale, yScale);
	}
	
	function update(points, xScale, yScale){
		points.attr("r", radius)
			  .attr("class", "point " + classes)
			  .attr("cx", function(d){ return xScale(x(d)); })
			  .attr("cy", function(d){ return yScale(y(d)); });	
	}
	
	
	chart.x = function(value){
		if(!arguments.length) return x;
		
		x = value;
		return this;
	};
	
	chart.y = function(value){
		if(!arguments.length) return y;
		
		y = value;
		return this;
	};
	
	chart.radius = function(value){
		if(!arguments.length) return radius;
		
		radius = value;
		return this;
	};
	
	chart.height = function(value){
		if(!arguments.length) return height;
		
		height = value;
		return this;
	};
	
	chart.width = function(value){
		if(!arguments.length) return width;
		
		width = value;
		return this;
	};
	
	chart.classes = function(value){
		if(!arguments.length) return classes;
		
		classes = value;
		return this;
	};

	
	return chart;
	
};