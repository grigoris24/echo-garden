export default function Home() {
  const projects = [
    {
      title: "-",
      description: "-",
      link: "-"
    },

  ]

  return (
    <div className="container">
      <h1 style={{ fontFamily: "Bangle-Normal" }} className="mb-4">Welcome to Echo Garden</h1>
      <p className="text-muted mb-5">
        A collection of web apps and projects I’ve built.
      </p>

      <div className="row">
        {projects.map((project, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text text-muted flex-grow-1">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary mt-auto"
                >
                  View Project
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
