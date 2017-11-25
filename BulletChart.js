var multi_var_barchart = function(){
	
	var width;
	var height;
	var padding;
	var scale;
	var seg_height;
	
	function chart(selection){
	
		selection.each(function(data){

			seg_height = (height/ data.length) - padding;
			scale = d3.scaleLinear()
						.range([0, width]);
						
			var bars = 
				d3.select(this)
				.selectAll(".bar")
				.data(data);
				
				update(bars);
				
				bars = bars.enter()
				.append("g")
				.attr("class", "bar")
				.attr("transform", function(d,i){ return "translate( 0, " + (seg_height + padding) * i + ")";});
				
				init(bars);
				
				bars.exit().remove();				
		});
	}
		
	function init (bars){
		bars.append("rect")
			.attr("class", "scale");
				
		bars.append("rect")
			.attr("class", "value");
				
		var axis = bars.append("g")
			.attr("class", "axis");
			
		axis.append("text")
			.text(function(d){ return d.min;})
			.attr("class", "min");
		axis.append("text")
			.text(function(d){ return d.max;})
			.attr("class", "max");
			
		bars.append("text")
			.text(function(d){ return d.title;})
			.attr("class", "variable");
			
		update(bars);
	}
	
	function update(bars){
		bars.select(".scale")
			.attr("width", width)
			.attr("height", seg_height);
			
		bars.select(".value")
			.attr("width", function(d){ 
			scale.domain([d.min, d.max]);
			return scale(d.value);})
			.attr("height", seg_height);
			
		var axis = bars.select(".axis")
			.attr("transform", "translate(0," + (seg_height + (padding/2))+ ")");
	
		axis.select(".max")
			.attr("transform", "translate(" + width + ",0)");
		bars.select(".variable")
			.attr("transform", "translate(" + (width + 20) + "," + (seg_height/2) + ")");
			
	}
	
	chart.width = function(value){
		if(!arguments.length) return width;
		
		width = value;
		return this;
	};
	
	chart.height = function(value){
		if(!arguments.length) return height;
		
		height = value;
		return this;
	};
	
	chart.padding = function(value){
		if(!arguments.length) return padding;
		
		padding = value;
		return this;	
	};
	
	return chart;
};