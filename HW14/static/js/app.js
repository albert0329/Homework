// from data.js
var tableData = data;
var filter = {
	datetime: '',
	city: '',
	state: '',
	country: '',
	shape: '',
	durationMinutes: '',
	comments: ''
};

var maxTableData = tableData.length;
var tableLayout = d3.select('#ufo-table tbody');

// YOUR CODE HERE!
function buildTable() {
	tableLayout.html("")
	for(var i = 0; i < maxTableData; i++){
			if(validData(tableData[i])) {
			var row = tableLayout.append('tr');
			var dateTime = tableData[i].datetime;
			
			var dateCell = row.append('td');
			dateCell.text(dateTime);

			var cityCell = row.append('td');
			cityCell.text(tableData[i].city);

			var stateCell = row.append('td');
			stateCell.text(tableData[i].state);

			var countryCell = row.append('td');
			countryCell.text(tableData[i].country);

			var shapeCell = row.append('td');
			shapeCell.text(tableData[i].shape);

			var durationCell = row.append('td');
			durationCell.text(tableData[i].durationMinutes);

			var commentCell = row.append('td');
			commentCell.text(tableData[i].comments); 
		}
	}
}


var dateInput = d3.select('#datetime');
//dateInput.on('blur', function(event) {
//	filter.datetime = dateInput.property('value');
//	buildTable();
//});

var cityList = [];
for (var i = 0; i < maxTableData; i++) {
	if (cityList.indexOf(tableData[i].city) === -1) {
		cityList.push(tableData[i].city);
	}
}
cityList.sort();

var cityInput = d3.select('#city');
for (var index = 0; index < cityList.length; index++) {
	var cityOption = cityInput.append('option');
	cityOption.attr('value', cityList[index]);
	cityOption.text(cityList[index]);
}

//cityInput.on('change', function(event) {
//	filter.city = cityInput.property('value');
//	buildTable();
//});

var stateList = [];
for (var i = 0; i < maxTableData; i++) {
	if (stateList.indexOf(tableData[i].state) === -1) {
		stateList.push(tableData[i].state);
		//console.log(stateList);
	}
}
stateList.sort();

var stateInput = d3.select('#state');
for (var index = 0; index < stateList.length; index++) {
	var stateOption = stateInput.append('option');
	stateOption.attr('value', stateList[index]);
	stateOption.text(stateList[index]);
}

var countryList = [];
for (var i = 0; i < maxTableData; i++) {
	if (countryList.indexOf(tableData[i].country) === -1) {
		countryList.push(tableData[i].country);
	}
}
countryList.sort();

var countryInput = d3.select('#country');
for (var index = 0; index < countryList.length; index++) {
	var countryOption = countryInput.append('option');
	countryOption.attr('value', countryList[index]);
	countryOption.text(countryList[index]);
}

var shapeList = [];
for (var i = 0; i < maxTableData; i++) {
	if (shapeList.indexOf(tableData[i].shape) === -1) {
		shapeList.push(tableData[i].shape);
	}
}
shapeList.sort();

var shapeInput = d3.select('#shape');
for (var index = 0; index < shapeList.length; index++) {
	var shapeOption = shapeInput.append('option');
	shapeOption.attr('value', shapeList[index]);
	shapeOption.text(shapeList[index]);
}



var filterBtn = d3.select('#filter-btn');
filterBtn.on('click', function() {
	filter.datetime = dateInput.property('value');
	filter.city = cityInput.property('value');
	filter.state = stateInput.property('value');
	filter.country = countryInput.property('value');
	filter.shape = shapeInput.property('value');
	buildTable();
})

function validData(ufoData) {
	if (filter.datetime) {
		if (filter.datetime !== ufoData.datetime) {
			return false;
		}
	}

	if (filter.city) {
		if (filter.city !== ufoData.city) {
			return false;
		}
	}

	if (filter.state) {
		if (filter.state !== ufoData.city) {
			return false;
		}
	}

	if (filter.country) {
		if (filter.country !== ufoData.country) {
			return false;
		}
	}

	if (filter.shape) {
		if (filter.shape !== ufoData.shape) {
			return false;
		}
	}

	return true;
}

buildTable();