
import './Loading.css'

const Loading = ({ message = 'Generating Interview Summary...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Loading