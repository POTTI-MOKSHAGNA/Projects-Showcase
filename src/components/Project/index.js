import './index.css'

const Project = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="list">
      <img src={imageUrl} alt={name} className="img" />
      <p className="pro-name">{name}</p>
    </li>
  )
}

export default Project
