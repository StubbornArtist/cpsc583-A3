var stacked_area = function(){
	
	var height;
	var width;
	var xVal;
	var yVal;
	var zVal;
	var x;
	var y;
	var titles;
	var classes;
	
	
	function chart(selection){
		selection.each(function(data){
			
			var zValues =  d3.set(data.map(zVal)).values();
			var xExtent = d3.extent(data, xVal);
			var formatted_data = format_data(data);
			var yMax = y_max_value(formatted_data, zValues);
			
			var svg = d3.select(this)
			.attr("transform", "translate( 0," + (height/2) + ")");
			
			x = d3.scaleLinear()
			.range([0, width])
			.domain(xExtent);
					
			y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, yMax]);
			

			var stack = d3.stack()
			.keys(zValues)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);
			
			var stacks = svg.selectAll(".stack")
			.data(stack(formatted_data));
			update(stacks);
			
			stacks = stacks.enter();
			init(stacks);
			
			stacks.exit().remove();
			
			var xaxis = svg.select(".x-axis");
			if(xaxis.empty()){
				xaxis = svg.append("g")
				.attr("class", "x-axis axis");
				
				xaxis.append("text")
				.attr('transform', 'translate(' + (width/2)  + ",50)")
				.text(titles[0]);
			}
			var yaxis = svg.select(".y-axis");
			if(yaxis.empty()){
				yaxis = svg.append("g")
				.attr("class", "y-axis axis");
				
				yaxis.append("text")
				.attr('transform', "translate(-50," +  (height/2)  + ") rotate(-90)")
		.		text(titles[1]);
			}
			
			xaxis.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom().scale(x).ticks(xExtent[1] - xExtent[0] + 1));
			
			yaxis.call(d3.axisLeft().scale(y).ticks(3));
			
		});
	}
		
	function format_data(data){
		var new_data = [];
		var years = d3.set(data.map(xVal)).values();
		years.forEach(function(d){
			var income_data = data.filter(function(i){ return +i.year == d;});
			var new_year = {
				"year" : d
			};
			income_data.forEach(function(i){
				new_year[i.bracket] = i.obesity;
			});	
			new_data.push(new_year);
		});
		return new_data;
	}
	
	function y_max_value(data, zValues){
		
		return d3.max(data, function(d){
			var sum = 0;
			for(var z in zValues){
				sum+= +d[zValues[z]];
			}
			return sum;
		});
	}
	function update(stacks){
		
		var area = d3.area()
		.x(function(d){return x(xVal(d.data));})
		.y0(function(d){ return y(d[0]);})
		.y1(function(d){ return y(d[1]);});
			
		stacks.select(".area")
		.attr("d", area);	
		
		stacks.select(".stack-label")
		.attr("transform", 
		function(d) { 
		var dat = d[d.length - 1];
		return "translate(" + width + "," + ((dat[1] + dat[0])/2) + ")";
		
		})
		.text(function(d){ return d.key;});
	}
	
	function init (stacks){
		var stack = stacks.append("g")
		.attr("class", "stack " + classes);
		
		stack.append("path")
		.attr("class", "area");
		
		stack.append("text")
		.attr("class", "stack-label");
				
		update(stacks);
	}
			
	chart.x = function(value){
		if(!arguments.length) return xVal;
		
		xVal = value;
		return this;
	};
	
	chart.y = function(value){
		if(!arguments.length) return yVal;
		
		yVal = value;
		return this;
	};
	
	chart.z = function(value){
		if(!arguments.length) return zVal;
		
		zVal = value;
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
		
	chart.titles = function(value){
		if(!arguments.length) return titles;
		
		titles = value;
		return this;
	};
	
	chart.classes = function(value){
		if(!arguments.length) return classes;
		
		classes = value;
		return this;	
	};
	
	
	return chart;
	
	
};