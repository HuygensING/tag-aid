import json
import sys


def main(from_pos, to_pos):
    with open("vizgraph.json", "r") as f:
        data = json.load(f)

    from_pos, to_pos = int(from_pos), int(to_pos)

    nodes = [x for x in data["nodes"] if int(x["pos"]) >= from_pos and int(x["pos"]) <= to_pos]
    nodes_by_id = { x["nodeId"] : x for x in nodes }
    links = [x for x in data["links"] if x["target"] in nodes_by_id or x["target"] in nodes_by_id ]
    out_data = {
        "nodes" : nodes,
        "links" : links
    }

    with open("vizgraph_%s-%s.json" % (from_pos, to_pos), "w") as out:
        json.dump(out_data, out)



if __name__ == '__main__':
    main(0, 20)
    main(20, 40)
    main(40, 60)
