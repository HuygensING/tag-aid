import pygraphml
import json

parser = pygraphml.GraphMLParser()
g = parser.parse("parzival.xml")

out = {
    "nodes" : [],
    "links" : []
}

for node in g.nodes():
    print( node)
    attrs = node.attributes()
    node_obj = {
        'nodeId' : "n%d" % node.id,
        'word' : attrs['dn15'].value,
        'pos' : attrs['dn14'].value
    }

    out["nodes"].append(node_obj)

for idx, edge in enumerate(g.edges()):
    attrs = edge.attributes()
    edge_obj = {
        'source' : "n%d" % edge.node1.id,
        'target' : "n%d" % edge.node2.id,
        'witness' : attrs["de12"].value,
        'linkId': "e%d" % idx
    }

    out["links"].append(edge_obj)

with open("rawgraph.json", "w") as outfile:
    json.dump(out, outfile)
