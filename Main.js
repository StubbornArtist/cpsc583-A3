var selections = [ 
			{"title" : "Obesity (%)", "class" :"obesity", "value" : function(d){return +d.obesity;}},
			{"title" : "Poverty (%)", "class": "poverty", "value" : function(d){return +d.poverty;}},
			{"title" :"Cereal Calories", "class" : "cereal", "value" : 
			function(d){return (d.cereal == undefined) ? NaN : +(d.cereal.calories);}}];
			
var dispatch = d3.dispatch("axis-change");
var cereal_stats = {};



window.onload = function(){
 
	d3.queue()
	.defer(d3.csv, "cereal.csv")
	.defer(d3.csv, "favourite_cereal.csv")
	.defer(d3.csv, "obesity_poverty.csv")
	.defer(d3.csv, "obesity_survey_multiyear.csv")
	.await(function(error, cereal_data, fav_data, obesity_data, obesity_years_data){
		
		if(error) return;
		
		var data = final_data(cereal_data, fav_data, obesity_data, obesity_years_data);
		var map_data = get_map_data(data, us);
		cereal_stats = get_cereal_stats(data);

		init_states_vis(map_data, selections[0]);
		init_comparison_scatter(data, selections[1], selections[0]);
		create_state_point_mapping();
		draw_axis_selectors(selections.map(function(d){return d.title;}), 1, 0);
		
		dispatch.on("axis-change", function(){	
			var x = d3.select("#x-selector").data()[0];
			var y = d3.select("#y-selector").data()[0];
			var xSelection = selections.find(function(d){ return d.title == x.options[x.current];});
			var ySelection = selections.find(function(d){ return d.title == y.options[y.current];});
	
			update_states_vis(ySelection);
			update_comparison_scatter(xSelection, ySelection);
		});
	});
}

function final_data(cereal_data, fav_data, obesity_data, obesity_years_data){
	
	var data = [];
	fav_data.forEach(function(d){
			var obj = {};
			var cereal = cereal_data.find(function(c){return c.Brand === d.Favourite;});
			var state = obesity_data.find(function(s){ return s.State === d.State;});
			var state_data = obesity_years_data.filter(function(d){return d.LocationDesc === state.State
			&& d.StratificationCategoryId1 === "INC" && d.StratificationID1 !== "INCNR";});
					
			obj["state"] = state.State;
			obj["obesity"] = +state["Obesity Percent"];
			obj["poverty"] = +state["Poverty Rate"];
			obj["abbr"] = state_data[0].LocationAbbr;
			obj["cereal"] = {
				"name": cereal.Brand,
				"cups" : +cereal.cups,
				"calories" : +cereal.calories,
				"carbs" : +cereal.carbo,
				"protein" : +cereal.protein,
				"sugar" : +cereal.sugars,
				"sodium" : +cereal.sodium
			};
			obj["income"] = state_data.map(function(s){return {"year" : +s.YearStart, 
																"bracket" : s.Income, 
																"obesity" : +s.Data_Value};													});
			data.push(obj);
		});
		
		return data;
}

function get_cereal_stats(data){
	var stats = {};
	
	var cereals = data.map(function(d){ return d.cereal;});
	cereals.forEach(function(cereal){
		stats[cereal.name] = [];
		for(var key in cereal){
			if(!isNaN(cereal[key])){
				stats[cereal.name].push({
					"title": key,
					"value" : cereal[key],
					"max" : d3.max(cereals, function(d){ return d[key];}),
					"min" : d3.min(cereals, function(d){ return d[key];})
				});
			}
		}
	});
	
	return stats;
}

function get_map_data(data, map_json){
	return map_json.features.map(function(d){ 
		var state = d.properties.NAME;
		d.properties["data"] = data.find(function(s){ return s.state === state;});
		return d;
	});
}

function create_state_point_mapping(){
	d3.selectAll(".state").each(function(d){
		var dat = d.properties.data;
		if(!dat == undefined){
			var state = this;
			var points = d3.selectAll(".point")
			.filter(function(e){ return !(dat == undefined) && e.abbr == dat.abbr;});
			points.each(function(f){
				f["mapping"] = state;
			});
		}
	});
	d3.selectAll(".point").each(function(d){
		var point = this;
		var states = d3.selectAll(".state")
		.filter(function(e){ !(e.properties.data == undefined) && e.properties.data.abbr == d.abbr;});
		states.each(function(f){
			f.properties.data["mapping"] = point;
		});
	});
}

function init_states_vis(data, initVal){
	d3.select("#states-vis")
		.datum(data)
		.call(us_gradient_map()
		.value(initVal.value)
		.classes(initVal.class));	
		
	d3.selectAll(".state")
	.on("mouseover", function(d){
		var dat = d.properties.data;
		d3.select(dat.mapping).classed("point-hover", true);
		update_state_name(dat.state);
		update_favorite_cereal(dat.cereal);
		draw_income_vis(dat.income);
		
	}).on("mouseout", function(d){
		var dat = d.properties.data;
		d3.select(dat.mapping).classed("point-hover", false);
		clear_state_name();
	});
}

function update_states_vis(selection){
	d3.select("#states-vis")
	.call(us_gradient_map()
	.value(selection.value)
	.classes(selection.class));
}


function init_comparison_scatter(data, initX, initY){	
	d3.select("#compare-vis")
		.datum(data)
		.call(scatter_plot()
					.x(initX.value)
					.y(initY.value)
					.classes(initY.class)
					.height(500)
					.width(500)
					.radius(10));

		d3.selectAll(".point")
		.on("mouseover", function(d){
			d3.select(d.mapping).classed("state-hover", true);
			update_state_name(d.state);
		})
		.on("mouseout", function(d){
			d3.select(d.mapping).classed("state-hover", false);
			clear_state_name();
		});
}

function update_comparison_scatter(selectionX, selectionY){
	d3.select("#compare-vis")
		.call(scatter_plot()
				.x(selectionX.value)
				.y(selectionY.value)
				.classes(selectionY.class)
				.height(500)
				.width(500)
				.radius(10));
}

function draw_income_vis(data){

	d3.select("#income-vis")
			.datum(data)
			.call(stacked_area()
			.height(50)
			.width(100)
			.x(function(d){return +d.year; })
			.y(function(d){return +d.obesity; })
			.z(function(d){return d.bracket; })
			.classes("obesity")
			.titles(["Year", "Obesity (%)"]));
	
}

function update_favorite_cereal(cereal_data){
	d3.select("#favorite-cereal-title")
		.text("Favorite Cereal : " + cereal_data.name);
		
	d3.select("#favorite-cereal-vis")
	 .datum(cereal_stats[cereal_data.name])
	 .call(multi_var_barchart()
			.width(500)
			.height(300)
			.padding(25));	
}

function draw_axis_selectors(options, initX, initY){
	d3.select("#compare-vis-container")
	.datum(options)
	.call(axis_selector()
	.initial([initX, initY]));
	
	d3.select("#y-selector")
	.attr("transform", "translate(-50, 250) rotate(-90)");
	
	d3.select("#x-selector")
	.attr("transform", "translate(250, 550)")
}

function update_state_name(state){
	d3.select("#state-name").text("State : " + state);	
}

function clear_state_name(){
	update_state_name("");
}


