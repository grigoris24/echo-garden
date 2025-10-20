import { Link } from "react-router-dom"

export default function Home() {
  const projects = [
    {
      title: "Counter",
      description: "A sleek interactive counter with animations and rounded controls.",
      link: "/counter"
    },
    {
      title: "Todo List",
      description: "A persistent task tracker using localStorage to remember your tasks.",
      link: "/todo"
    },
    {
      title: "Settings",
      description: "Change your web radio station URL and personalize your experience.",
      link: "/settings"
    }
  ]

  return (
    <div className="container py-4">
      <h1
        style={{ fontFamily: "Bangle-Normal" }}
        className="mb-3 fw-bold"
      >
        Welcome to Echo Garden
      </h1>
      <p className="text-muted mb-5">
        A growing collection of small, functional web apps built with React.
      </p>

      <div className="row">
        {projects.map((project, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0 hover-card">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text text-muted flex-grow-1">{project.description}</p>
                <Link
                  to={project.link}
                  className="btn btn-primary mt-auto"
                >
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
