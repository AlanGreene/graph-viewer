import * as React from 'react'
import { render } from 'react-dom'
import { Route, Link, match, RouteComponentProps } from 'react-router-dom'
import { withRouter } from 'react-router'
import * as model from '../domain/model'
import styled from 'styled-components'

const StyledNode = styled.div`
  padding: 0.1em 0.25em;
  background: transparent;
  color: black;
  border: 1.5px solid black;
`

export interface NodeProps extends RouteComponentProps<any> {
  x: number
  y: number
  width: number
  height: number
  node: model.Node
}

export const Node = withRouter((props: NodeProps) => {
  const urlForFocussingNode = getUrlForFocussingNode(props.match.url, props.node.id)
  const color = props.node.getProp('color', 'white')

  return (
    <StyledNode
        key={props.node.id}
        style={{
          position: 'absolute',
          left: props.x - props.width / 2,
          top: props.y - props.height / 2,
          background: color,
          height: props.height,
          width: props.width,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 16,
          fontFamily: 'Roboto, sans-serif'
        }}
    >
      <Link to={urlForFocussingNode}>{props.node.id}</Link>
    </StyledNode>
  )
})

function getUrlForFocussingNode(url: string, nodeId: string) {
  const focusUrlPath = `/focus/${nodeId}`

  const matchResult = url.match(/\/graph\/(\w+)/)
  if (matchResult) {
    return matchResult[0] + focusUrlPath
  } else {
    return url + focusUrlPath
  }
}
