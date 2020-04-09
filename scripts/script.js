// const data = [4, 8, 15, 16, 23, 42];
// const data = d3.csvParse(`date,world,Afghanistan,Albania,Algeria,Andorra
// 2020-04-07,1316988,337,377,1423,526
// 2020-04-08,1391890,367,383,1468,545`, d3.autoType);

getData();

async function getData() {
    const csv = await (await fetch("https://covid.ourworldindata.org/data/ecdc/total_cases.csv")).text();

    const tab = csv.split('\n');

    const contries = tab[0].slice(5).split(',');

    const values = tab[tab.length - 2].slice(11).split(',');

    let worldCount = `${contries[0]}: ${values[0]}`;
    let text = 'world,value\n';
    for (let i = 1; i < contries.length; i++) {
        text += `${contries[i]},${values[i]}\n`;
    }

    const data = d3.csvParse(text, d3.autoType).sort(function (a, b) {
        return b.value - a.value;
    });

    toSVG(data, worldCount);

}

function toSVG(data, worldCount) {

    document.getElementById("world").textContent = worldCount;
    document.getElementsByTagName("body")[0].style.fontFamily = "sans-serif";
    

    margin = ({ top: 20, right: 0, bottom: 30, left: 40 })

    const width = window.innerWidth * 0.75;

    x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, width])

    y = d3.scaleBand()
        .domain(data.map(d => d.world))
        .range([0, 40 * data.length])
        .padding(0.1)

    const svg = d3.select(".svg")
        .attr("width", "100%")
        .attr("height", y.range()[1])
        .attr("font-family", "sans-serif")
        .attr("font-size", "16")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start");

    const bar = svg.selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0,${y(d.world)})`);

    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth() - 1);

    bar.append("text")
        .attr("fill", "black")
        .attr("x", d => 2)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.world);

    bar.append("text")
        .attr("fill", "black")
        .attr("x", d => window.innerWidth - 40)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.value);
}