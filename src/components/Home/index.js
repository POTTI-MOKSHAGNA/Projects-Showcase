import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'

import NavBar from '../NavBar'
import Project from '../Project'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    status: apiStatus.loading,
    projects: [],
    active: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectData()
  }

  onChangeActive = event => {
    this.setState(
      {active: event.target.value, status: apiStatus.loading},
      this.getProjectData,
    )
  }

  getProjectData = async () => {
    const {active} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${active}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({status: apiStatus.success, projects: updatedData})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  onRetry = () => {
    this.setState({status: apiStatus.loading}, this.getProjectData)
  }

  getData = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return this.renderLoader()
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height="80" width="80" color="#328af2" />
    </div>
  )

  renderFailure = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure"
        alt="failure view"
      />
      <h1 className="fail-head">Oops! Something Went Wrong </h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {projects} = this.state
    return (
      <ul className="list-container">
        {projects.map(each => (
          <Project details={each} key={each.id} />
        ))}
      </ul>
    )
  }

  render() {
    const {active} = this.state
    return (
      <div className="bg">
        <NavBar />
        <select value={active} onChange={this.onChangeActive}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.getData()}
      </div>
    )
  }
}

export default Home
