import json
import sys
import copy

def main():
    with open(sys.argv[1], "r") as infile:
        data = json.load(infile)

    #workinkg on nodes
    nodes = data["nodes"]
    words_and_positions = {}
    nodes_to_aggregates = {}

    next_aggregate_id = 1
    for node in nodes:
        idx = (node["word"], node["pos"])
        if idx not in words_and_positions:
            words_and_positions[idx] = copy.copy(node)
            words_and_positions[idx]["nodeId"] = next_aggregate_id
            words_and_positions[idx]["ids"] = [node["nodeId"]]
            words_and_positions[idx]["value"] = 1
            nodes_to_aggregates[node["nodeId"]] = words_and_positions[idx]["nodeId"]
            next_aggregate_id += 1
        else:
            words_and_positions[idx]["value"] =+ 1
            words_and_positions[idx]["ids"].append(node["nodeId"])
            nodes_to_aggregates[node["nodeId"]] = words_and_positions[idx]["nodeId"]

    out_nodes = words_and_positions.values()


    #workinkg on edges
    links = data["links"]
    aggregate_links_dict = {}
    for link in links:
        aggregate_source_id = nodes_to_aggregates[link["source"]]
        aggregate_target_id = nodes_to_aggregates[link["target"]]
        idx = (aggregate_source_id, aggregate_target_id)
        if idx not in aggregate_links_dict:
            aggregate_links_dict[idx] = {
                "source" : aggregate_source_id,
                "target" : aggregate_target_id,
                "value" : 1,
                "witnesses" : [link["witness"]]
            }
        else:
            aggregate_links_dict[idx]["value"] += 1
            aggregate_links_dict[idx]["witnesses"].append(link["witness"])


    out_links = aggregate_links_dict.values()
    out_data = {
        "nodes" : list(out_nodes),
        "links" : list(out_links)
    }

    with open("vizgraph.json", "w") as outfile:
        json.dump(out_data, outfile)


if __name__ == '__main__':
    main()
