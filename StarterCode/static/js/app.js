// // Set url as constant variable 
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// // Initializing page with default plot !!! 
// // function init()
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function init() {
  let dropDownMenu = document.getElementById('selDataset');

  d3.json(url).then((data) => {
    console.log(data);
    // On   
  });
}

// Step 1: Read samples.json using D3 library
d3.json(url).then(data => { 
  // Extract necessary data from samples.json
  let samples = data.samples;
  let metadata = data.metadata;

  // Step 2: Create a function to generate the bar chart
  function generateBarChart(sample) {
    // Slice and sort the top 10 OTUs
    let sampleValues = sample.sample_values.slice(0, 10).reverse();
    let otuIds = sample.otu_ids.slice(0, 10).reverse();
    let otuLabels = sample.otu_labels.slice(0, 10).reverse();

    // Create trace for the bar chart
    let trace = {
      x: sampleValues,
      y: otuIds.map(id => `OTU ${id}`),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    // Create layout for the bar chart
    let layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    // Plot the bar chart
    Plotly.newPlot("bar", [trace], layout);
  }

  // Step 3: Create a function to generate the bubble chart
  function generateBubbleChart(sample) {
    // Create trace for the bubble chart
    let trace = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: "markers",
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      }
    };

    // Create layout for the bubble chart
    let layout = {
      title: "OTU Biodiversity",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", [trace], layout);
  }

  // Step 4: Create a function to display sample metadata
  function displayMetadata(sample) {
    // Find the metadata for the selected sample
    let metadataResult = metadata.find(m => m.id === sample);

    // Select the sample metadata div
    let sampleMetadata = d3.select("#sample-metadata");

    // Clear existing metadata
    sampleMetadata.html("");

    // Display each key-value pair from the metadata
    Object.entries(metadataResult).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });
  }

  // Step 5: Initialize the page with default data
function init() {
    // Get the dropdown select element
    let dropdown = d3.select("#selDataset");
  
    // Get the sample IDs
    let sampleIds = samples.map(sample => sample.id);
  
    // Populate the dropdown menu with sample IDs
    sampleIds.forEach(sampleId => {
      dropdown.append("option")
        .attr("value", sampleId)
        .text(sampleId);
    });
  
    // // Get the first sample ID
    // let firstSample = sampleIds[0];
  
    // function optionChanged(selectedSample) {
    // Generate the initial plots and metadata
    generateBarChart(samples[0]);
    generateBubbleChart(samples[0]);
    generateGaugeChart(samples[0]);
    generatePieChart(samples[0]);
   
    // }
    // Update plots and metadata when a new sample is selected
    dropdown.on("change", function() {
      let selectedSample = dropdown.property("value");
      let selectedData = samples.find(sample => sample.id === selectedSample);
  
      generateBarChart(selectedData);
      generateBubbleChart(selectedData);
      generateGaugeChart(selectedData); // Call the function with the selectedData object
      generatePieChart(selectedData);
      displayMetadata(selectedSample);
    });
  
  }
  
  // Function to generate the gauge chart
  function generateGaugeChart(data) {
  
    let gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: data.wfreq,
        title: { text: "Belly Button Washing Frequency<br>(Scrubs per Week)" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10] },
          steps: [
            { range: [0, 1], color: "#f7f7f7" },
            { range: [1, 2], color: "#e5f5e0" },
            { range: [2, 3], color: "#c7e9c0" },
            { range: [3, 4], color: "#a1d99b" },
            { range: [4, 5], color: "#74c476" },
            { range: [5, 6], color: "#41ab5d" },
            { range: [6, 7], color: "#238b45" },
            { range: [7, 8], color: "#006d2c" },
            { range: [8, 9], color: "#00441b" },
            { range: [9, 10], color: "#indigo" }
          ]
        }
        }
    ];
  
    let gaugeLayout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
  
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  }
  
  // Function to generate the pie chart
  function generatePieChart(data) {
    let sampleValues = data.sample_values.slice(0, 10);
    let otuIds = data.otu_ids.slice(0, 10);
    let otuLabels = data.otu_labels.slice(0, 10);
  
    let pieData = [{
      values: sampleValues,
      labels: otuIds,
      hovertext: otuLabels,
      title: { text: "Pie Distribution" },
      type: "pie"
    }];
  
    let pieLayout = { height: 400, width: 500 };
  
    Plotly.newPlot("pie", pieData, pieLayout);
  }

  // Initialize the dashboard
  init();
  
});

