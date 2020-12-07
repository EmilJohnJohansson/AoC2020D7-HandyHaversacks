const { Console } = require('console');
const fs = require('fs')

const bagRegExp = /(\d+\s)?\w+\s?\w+(?= bag)/g

function resolveInput(fileName) {
    const content = fs.readFileSync(fileName, 'utf8');
    const lines = content.split('\n');
    return lines.map(l => l.match(bagRegExp));
}

function buildInvertGraph(input) {
    let graph = {
        nodes: [],
        edges: { }
    }

    input.forEach(arr => {
        const parent = arr[0];
        const children = arr.slice(1);

        if (!graph.nodes.includes(parent)) {
            graph.nodes.push(parent);
            graph.edges[parent] = [];
        }
        
        children.forEach(child => {
            if (child !== 'no other') {
                if (!graph.nodes.includes(child)) {
                    graph.nodes.push(child);
                    graph.edges[child] = [];
                }
                graph.edges[child].push(parent);
            }
        });
    });

    return graph;
}

function buildGraph(input) {
    let graph = {
        nodes: [],
        edges: { }
    }

    input.forEach(arr => {
        const parent = arr[0];
        const children = arr.slice(1);

        if (!graph.nodes.includes(parent)) {
            graph.nodes.push(parent);
            graph.edges[parent] = [];
        }
        
        children.forEach(child => {
            if (child !== 'no other') {
                const comps = child.split(' ');
                const name = comps[1] + ' ' + comps[2];
                const weigth = parseInt(comps[0]);
                if (!graph.nodes.includes(name)) {
                    graph.nodes.push(name);
                    graph.edges[name] = [];
                }
                graph.edges[parent].push( { color: name, weight: weigth } );
            }
        });
    });

    return graph;
}


function findNumerOfOuterBags(graph, bagColor, bags) {
    if (graph.edges[bagColor].length !== 0) {
        graph.edges[bagColor].forEach(color => {
            bags.add(color);
            findNumerOfOuterBags(graph, color, bags);
        });
    } else {
        bags.add(bagColor);
    }
    return bags;
}

function countBags(graph, bagColor, total) {
    let count;

    console.log("Counting " + bagColor);

    if (graph.edges[bagColor].length !== 0) {
        graph.edges[bagColor].forEach(bag => {
            console.log("Adding " + bag.weight + " " + bag.color);
            count = bag.weight * ( 1 + countBags(graph, bag.color, total) );
            console.log(count + " added from " + bag.color);
            total += count;
        });
    } else {
        return 0
    }

    return total;
}


function countBags2(graph, bagColor) {
    if (graph.edges[bagColor].length === 0) {
        return 1;
    } else {
        let sum = 0;
        graph.edges[bagColor].forEach(bag => {
            sum += bag.weight * countBags2(graph, bag.color)
        });
        return sum + 1;
    }
}


const input = resolveInput("input.txt");
// const invertedGraph = buildInvertGraph(input);
// const graph = buildGraph(input);
// for (const prop in graph.edges) {
//     console.log(prop, graph.edges[prop])
// }
// console.log(graph);
// console.log(countBags(graph, "shiny gold", 0));
console.log(countBags2(graph, "shiny gold") - 1);




// console.log(graph.edges.map(e => console.log(node, weight)));

// const bags = findNumerOfOuterBags(graph, 'shiny gold', new Set());
// console.log(bags.size);



// function getDicts(input) {
//     let ptcDict = { };
//     let ctpDict = { };
    
//     input.forEach(arr => {
//         const children = arr.slice(1);
//         ptcDict[arr[0]] = children;
//         children.forEach(child => {
//             if (ctpDict.hasOwnProperty(child)) {
//                 ctpDict[child].push(arr[0]);
//             } else {
//                 ctpDict[child] = arr.slice(0, 0);
//             }
//         });
//     });

//     return [ptcDict, ctpDict];
// }

// const dicts = getDicts(input);
