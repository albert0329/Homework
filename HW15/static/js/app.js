function buildMetadata(sample) {

  d3.json(`/metadata/${sample}`).then(function(sample) {
    var sample_data = d3.select("#sample-metadata");
    console.log(sample);
    sample_data.html("");

    Object.entries(sample).forEach(function ([key, value]) {
      var r = sample_data.append("p");
      r.text(`${key}: ${value}`);
    });
  });  

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;

    var bub_data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }];

    var bub_layout = {
      hovermode: 'closest',
      xaxis: {title: 'OTU_ID'}
    };

    Plotly.newPlot('bubble', bub_data, bub_layout);

    var pie_data = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hoverinfo: 'hovertext',
      hovertext: otu_labels.slice(0,10),
      type:'pie'
    }];

    Plotly.plot('pie', pie_data);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
