import * as _ from 'lodash'
import { Node, Edge } from './model'
import { GraphService } from './service'

export class NodeCollapser {
  private graphService: GraphService

  constructor(graphService: GraphService) {
    this.graphService = graphService
  }

  collapseContainedNodes(graph: Node): Node {
    if (graph.edges) {
      let redirectedEdges = graph.edges
        .map(edge => this.getInsideEdgesRedirectedToTopLevelNodes(graph, edge))

      let collapsedNodes = graph.nodes
      if (collapsedNodes) {
        collapsedNodes = graph.nodes
          .map(node => {
            let nodeCopy = JSON.parse(JSON.stringify(node))
            nodeCopy.nodes = undefined
            nodeCopy.edges = undefined
            return nodeCopy
          })
      }

      let graphCopy = JSON.parse(JSON.stringify(graph))
      graphCopy.nodes = collapsedNodes
      graphCopy.edges = redirectedEdges
      return graphCopy
    } else {
      return graph
    }
  }

  getInsideEdgesRedirectedToTopLevelNodes(graph: Node, edge: Edge): Edge {
    let sourceNode: string = edge.sourceNode
    if (graph.nodes && !graph.nodes.find(node => node.id === edge.sourceNode)) {
      sourceNode = this.getTopLevelParentInGraph(graph, edge.sourceNode).id
    }
    let targetNode: string = edge.targetNode
    if (graph.nodes && !graph.nodes.find(node => node.id === edge.targetNode)) {
      targetNode = this.getTopLevelParentInGraph(graph, edge.targetNode).id
    }
    return { sourceNode: sourceNode, targetNode: targetNode }
  }

  getTopLevelParentInGraph(graph: Node, searchedNodeId: string): Node {
    let topNode = graph.nodes
      .find(node => this.isTopLevelParent(node, searchedNodeId))
    return topNode ? topNode : null
  }

  private isTopLevelParent(currentNode: Node, searchedNodeId: string): boolean {
    if (currentNode.nodes) {
      if (currentNode.nodes
          .some(childNode => childNode.id === searchedNodeId)) {
        return true
      } else {
        return currentNode.nodes
          .some(childNode => this.isTopLevelParent(childNode, searchedNodeId))
      }
    } else {
      return false
    }
  }
}
