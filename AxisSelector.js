var axis_selector = function(){
	
	var initial;
	
	function create(selection){
	
		selection.each(function(data){
			
			if(initial[0] == initial[1]) return;
			
			var newData = get_data(data, initial[0], initial[1]);
			var container = d3.select(this);
			
			var x = container.append("g")
			.attr("id", "x-selector");
			
			var y = container.append("g")
			.attr("id", "y-selector");
			
			container.selectAll("#x-selector, #y-selector")
			.data(newData)
			.append("text")
			.html(function(d){ return "<tspan class= \"lt\">&#9664</tspan>	<tspan class=\"content\">"+ 
			d.options[d.current] +"</tspan>	<tspan class=\"rt\">&#9654</tspan>";});
			

			x.select("text").select(".lt").on("mousedown", function(){
				var dat = x.data()[0];
				var index = leftIndex(dat);
				var label = dat.options[index];
				dat.current = index;
				x.select(".content").text(label);
				
				var otherDat = y.data()[0];
				var otherLabel = otherDat.options[otherDat.current];
				otherDat.options = otherDat.all.filter(function(d){ return d != label; });
				otherDat.current = otherDat.options.indexOf(otherLabel);
				dispatch.call("axis-change", this, label);
			});
			
			x.select("text").select(".rt").on("mousedown", function(){
				var dat = x.data()[0];
				var index = rightIndex(dat);
				var label = dat.options[index];
				dat.current = index;
				x.select(".content").text(label);
				
				var otherDat = y.data()[0];
				var otherLabel = otherDat.options[otherDat.current];
				otherDat.options = otherDat.all.filter(function(d){ return d != label; });
				otherDat.current = otherDat.options.indexOf(otherLabel);
				dispatch.call("axis-change", this, label);	
			});
			
			y.select("text").select(".lt").on("mousedown", function(){
				var dat = y.data()[0];
				var index = leftIndex(dat);
				var label = dat.options[index];
				dat.current = index;
				y.select(".content").text(label);
				
				var otherDat = x.data()[0];
				var otherLabel = otherDat.options[otherDat.current];
				otherDat.options = otherDat.all.filter(function(d){ return d != label; });
				otherDat.current = otherDat.options.indexOf(otherLabel);
				dispatch.call("axis-change", this, label);	
			});
			
			y.select("text").select(".rt").on("mousedown", function(){
				var dat = y.data()[0];
				var index = rightIndex(dat);
				var label = dat.options[index];
				dat.current = index;
				y.select(".content").text(label);
				
				var otherDat = x.data()[0];
				var otherLabel = otherDat.options[otherDat.current];
				otherDat.options = otherDat.all.filter(function(d){ return d != label; });
				otherDat.current = otherDat.options.indexOf(otherLabel);
				dispatch.call("axis-change", this, label);
			});
			
			
		});
	}
	
	create.initial = function(value){
		if(!arguments.length) return initial;
		
		initial = value;
		return this;
	};
	
	function leftIndex(data){
		var current = data.current;
		var options = data.options;
		if(current == 0){
			temp = options.length -1;
		}else{
			temp = current- 1;
		}	
		return temp;
	}
	function rightIndex(data){
		var current = data.current;
		var options = data.options;
		temp = (current + 1) % options.length;
		return temp;
	}
	
	function get_data(data, initX, initY){
		var obj = [];
		var xOptions = data.filter(function(d){ return d != data[initY];});
		var yOptions = data.filter(function(d){ return d != data[initX];});
		
		obj[0] = {
			"current" : xOptions.indexOf(data[initX]),
			"options" : xOptions,
			"all" : data
		};
		
		obj[1] = {
			"current" : yOptions.indexOf(data[initY]),
			"options" : yOptions,
			"all" : data
		};
		return obj;
	}
	
	return create;
	
};