// Mock data storage for testing
// Replace with Supabase when environment variables are configured

let projectsStorage = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "Modern portfolio showcasing projects and collaborations",
    tech_stack: ["Next.js", "React", "Tailwind CSS"],
    image_url: "/placeholder.svg",
    github_link: "https://github.com",
    live_link: "https://example.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    tech_stack: ["Node.js", "MongoDB", "React"],
    image_url: "/placeholder.svg",
    github_link: "https://github.com",
    live_link: "https://example.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getProjects() {
  return projectsStorage
}

export function addProject(project: any) {
  const newProject = {
    ...project,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  projectsStorage.push(newProject)
  return newProject
}

export function updateProject(id: string, data: any) {
  const index = projectsStorage.findIndex((p) => p.id === id)
  if (index !== -1) {
    projectsStorage[index] = {
      ...projectsStorage[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return projectsStorage[index]
  }
  return null
}

export function deleteProject(id: string) {
  projectsStorage = projectsStorage.filter((p) => p.id !== id)
  return true
}
