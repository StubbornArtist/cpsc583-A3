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
			var xValues = d3.set(data.map(xVal)).values();
			var yValues = d3.set(data.map(yVal)).values();
			var numLevels = zValues.length -1;
			
			var svg = d3.select(this)
			.attr("transform", "translate(0," + (height * numLevels) + ")");
			
			x = d3.scaleLinear()
			.range([0, width])
			.domain(xValues);
					
			y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(yValues)]);
			

			var stack = d3.stack()
			.keys(zValues)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);
			
			var stacks = svg.selectAll(".stack")
			.data(stack(format_data(data)));
			update(stacks);
			
			stacks = stacks.enter();
			init(stacks);
			
			stacks.exit().remove();
			
			var xaxis = svg.select(".x-axis");
			if(xaxis.empty()){
				xaxis = svg.append("g")
				.attr("class", "x-axis axis");
				xaxis.append("text")
				.attr('transform', 'translate(' + (width * 2) + "," + height + ")")
				.text(titles[0]);
			}
			var yaxis = svg.select(".y-axis");
			if(yaxis.empty()){
				yaxis = svg.append("g")
				.attr("class", "y-axis axis");
				yaxis.append("text")
				.attr('transform', "translate(" + (-1 * height) + "," +  (height * -2) + ") rotate(-90)")
		.		text(titles[1]);
			}
			
			xaxis.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom().scale(x).ticks(xValues.length));
			
			yaxis.call(d3.axisLeft().scale(y).ticks(1));
			
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
	
	
	function update(stacks){
		
		var area = d3.area()
		.x(function(d){return x(xVal(d.data));})
		.y0(function(d){ return y(d[0]);})
		.y1(function(d){ return y(d[1]);});
			
		stacks.select(".area")
		.attr("d", area);	
	}
	
	function init (stacks){
		stacks.append("g")
		.attr("class", "stack " + classes)
		.append("path")
		.attr("class", "area");
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