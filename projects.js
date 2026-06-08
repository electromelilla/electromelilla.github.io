/* ==========================================
   ElectroMelilla - Projects Data
   ==========================================
   HOW TO ADD NEW PROJECTS:
   Simply add a new object to the 'projects' array below.
   Each project needs: title, description, category, image
   
   Example:
   {
       title: "Your Project Title",
       description: "Short description of the project",
       category: "Electrical",  (can be: Electrical, Plumbing, Heating, Industrial, Infrastructure)
       image: "https://your-image-url.com/image.jpg"
   }
   ========================================== */

const projects = [
    {
        title: "Commercial Electrical Upgrade",
        description: "Complete electrical panel upgrade and rewiring for a commercial building in downtown Melilla.",
        category: "Electrical",
        image: "https://images.pexels.com/photos/7937305/pexels-photo-7937305.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Residential Plumbing Renovation",
        description: "Full water system renovation including new piping, fixtures, and water heater installation for a luxury home.",
        category: "Plumbing",
        image: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Smart Lighting Installation",
        description: "Modern smart lighting system installation with energy-efficient LED solutions for an office complex.",
        category: "Electrical",
        image: "https://images.pexels.com/photos/942316/pexels-photo-942316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Industrial Pipe Network",
        description: "Large-scale industrial pipe network installation for a new warehouse facility in Melilla industrial zone.",
        category: "Industrial",
        image: "https://images.pexels.com/photos/29274530/pexels-photo-29274530.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Radiator Heating System",
        description: "Complete radiator heating system installation and pipe routing for a multi-story residential building.",
        category: "Heating",
        image: "https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Network Infrastructure",
        description: "Structured cabling and network infrastructure setup for a modern office building with fiber optic connections.",
        category: "Infrastructure",
        image: "https://images.pexels.com/photos/7400884/pexels-photo-7400884.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Water Tank Installation",
        description: "Large capacity water tank and pump system installation for a residential community development.",
        category: "Plumbing",
        image: "https://images.pexels.com/photos/35016079/pexels-photo-35016079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Solar Panel Wiring",
        description: "Complete solar panel electrical wiring and grid connection for a sustainable energy project.",
        category: "Electrical",
        image: "https://images.pexels.com/photos/30144993/pexels-photo-30144993.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    },
    {
        title: "Bathroom Renovation",
        description: "Full bathroom renovation with modern plumbing fixtures, water pressure optimization, and luxury design.",
        category: "Plumbing",
        image: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
    }
];

// Category colors
const categoryColors = {
    "Electrical": "#00b4d8",
    "Plumbing": "#00e5a0",
    "Heating": "#d4a853",
    "Industrial": "#00b4d8",
    "Infrastructure": "#d4a853"
};

// Render projects for projects page
function renderProjects(containerId, filter = "All") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filteredProjects = filter === "All" 
        ? projects 
        : projects.filter(p => p.category === filter);

    container.innerHTML = filteredProjects.map((project, index) => `
        <div class="portfolio-card group rounded-xl overflow-hidden bg-[#0f1629] border border-[#1b2547] reveal" 
             style="transition-delay: ${(index % 6) * 0.1}s"
             data-title="${project.title}"
             data-desc="${project.description}"
             data-img="${project.image}"
             data-category="${project.category}">
            <div class="relative h-56 overflow-hidden">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover" loading="lazy">
                <div class="overlay absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent flex items-end p-6">
                    <div>
                        <span class="text-xs font-medium tracking-wider uppercase" style="color: ${categoryColors[project.category] || '#00b4d8'}">${project.category}</span>
                        <h3 class="text-white font-bold text-lg mt-1">${project.title}</h3>
                    </div>
                </div>
                <div class="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                </div>
                <div class="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                    <span class="text-xs font-medium text-white">${project.category}</span>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-white font-bold mb-2">${project.title}</h3>
                <p class="text-gray-400 text-sm">${project.description}</p>
            </div>
        </div>
    `).join('');

    // Re-initialize reveal for new elements
    revealOnScroll();
    attachLightboxHandlers();
}

// Render preview for home page (first 6 projects)
function renderProjectsPreview(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const previewProjects = projects.slice(0, 6);

    container.innerHTML = previewProjects.map((project, index) => `
        <div class="portfolio-card group rounded-xl overflow-hidden bg-[#0f1629] border border-[#1b2547] reveal" 
             style="transition-delay: ${index * 0.1}s"
             data-title="${project.title}"
             data-desc="${project.description}"
             data-img="${project.image}">
            <div class="relative h-56 overflow-hidden">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover" loading="lazy">
                <div class="overlay absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent flex items-end p-6">
                    <div>
                        <span class="text-xs font-medium tracking-wider uppercase" style="color: ${categoryColors[project.category] || '#00b4d8'}">${project.category}</span>
                        <h3 class="text-white font-bold text-lg mt-1">${project.title}</h3>
                    </div>
                </div>
                <div class="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-white font-bold mb-2">${project.title}</h3>
                <p class="text-gray-400 text-sm">${project.description}</p>
            </div>
        </div>
    `).join('');

    revealOnScroll();
    attachLightboxHandlers();
}

// Get unique categories
function getCategories() {
    return ["All", ...new Set(projects.map(p => p.category))];
}
