
import * as d3 from 'd3';
export const updateGraph = ({ nouns, adjectives, verbs, svgRef }) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();  // Clear previous render

    const width = 800, height = 400;
    svg.attr('width', width).attr('height', height);

    // Check if there are words to display
    if (nouns.length === 0 && adjectives.length === 0 && verbs.length === 0) {
        return; // No data to display
    }

    // Combine all words into a single array for nodes
    const nodes = [...new Set([...nouns, ...adjectives, ...verbs])].map(word => ({
        id: word,
        group: nouns.includes(word) ? 'noun' : adjectives.includes(word) ? 'adjective' : 'verb'
    }));

    // Create links (example uses sequential linking for demonstration)
    const links = nodes.map((node, i, arr) => ({
        source: node.id, // use id instead of index to ensure correctness
        target: i < arr.length - 1 ? arr[i + 1].id : arr[0].id
    }));

    // Define the simulation with proper handling for node updates
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-50)) // Adjust strength for better spacing
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", d => d.group === 'noun' ? 'red' : d.group === 'adjective' ? 'blue' : 'green')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const labels = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x + 5)
            .attr("y", d => d.y);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
};
