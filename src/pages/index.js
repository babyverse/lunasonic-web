import React from 'react'

import Layout from '../components/layout'
import Landing from '../components/landing'
import Container from '../components/container'

class RootIndex extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <Container>
          <Landing
            image={"pexels-transtudios-photography-&-video-10606514.jpg"}
            title="Snuggly App"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
        </Container>
      </Layout>
    )
  }
}

export default RootIndex
