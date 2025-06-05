
  import { ref, reactive, markRaw, onMounted } from 'vue'
  import { LoadingScreen } from './components/LoadingScreen.js'
  // import Header from './components/Header.vue'
  import { Projects } from './pages/Projects.js'
  import { Project } from './pages/Project.js'
  import { Gallery } from './pages/Gallery.js'
  // import ReelsSection from './components/ReelsSection.vue'
  // import ContactSection from './components/ContactSection.vue'
  export const App = {
    components: {
      'loading-screen': LoadingScreen,
    },
    setup(){
      const loading = ref(true)
      const config = ref({
        projects: [],
        projectCats: [
          {
            'title': 'iTVC',
            'slug' : 'itvc'
          },
          {
            'title': 'Documentary',
            'slug' : 'documentary'
          },
          {
            'title': 'Corporate Videos',
            'slug' : 'corporate-videos'
          },
          {
            'title': 'After Movies',
            'slug' : 'after-movies'
          },
          {
            'title': 'Others',
            'slug' : 'others'
          }
        ],
        site: {}
      })
      const currentRoute = ref({
        view: null,
        name: '',
        data: null
      })      
      
      async function fetchConfig(){
        try {
          config.value.projects = await fetch('./data/projects.json').then(res => res.json()).then(json => json.data)
          
          config.value.site = await fetch('./data/site.json').then(res => res.json())
        } catch (error) {
          console.error('Error fetching config:', error)
        } finally {
          loading.value = false
        }
      }

      function getProjectsByCategory(categorySlug) {
        const category = config.value.projectCats.find(cat => cat.slug === categorySlug)
        return config.value.projects
          .filter(project => project.category === category.title)
          .sort((a, b) => {
            if (typeof a.priority !== 'number') {
              a.priority = 1
            }
            if (typeof b.priority !== 'number') {
              b.priority = 1
            }

            return b.priority - a.priority
          })
      }

      function getProjectBySlug(slug) {
        return config.value.projects.find(project => project.id === slug)
      }
      
      function route(path) {
        const segments = path.replace('#/', '').split('/')
        const routeIndex = segments[0] || 'home'
        const routeParam = segments[1]

        switch (routeIndex) {
          case 'home':            
          case 'projects':
            const categorySlug = routeIndex == 'home' ? config.value.projectCats[0].slug : routeParam
            
            currentRoute.value = {
              view: markRaw(Projects),
              name: routeIndex,
              data: {
                projects: getProjectsByCategory(categorySlug),
                allCategories: config.value.projectCats
              }
            }

            break
          case 'project':
            const project = getProjectBySlug(routeParam)
            currentRoute.value = {
              view: markRaw(Project),
              name: 'project',
              data: project
            }
            break
          case 'gallery':
            currentRoute.value = {
              view: markRaw(Gallery),
              name: 'gallery',
            }
            break
          default:
            // Handle unknown routes by redirecting to home
            window.location.hash = '#/'
            break
        }        
      }

      function handleHashChange() {
        route(window.location.hash)
      }

      onMounted(async () => {
        await fetchConfig()
        window.addEventListener('hashchange', handleHashChange)
        route(window.location.hash)
      })

      return { loading, currentRoute, config }
    },
    template: `
    <loading-screen v-if="loading" />
    <template v-if="!loading">
        <header class="md:flex md:justify-between md:fixed md:container w-full text-center md:text-left">
            <div class="">
                <p class="text-3xl uppercase">Pham Nhat Anh</p>
                <p class="text-md uppercase">A worker loves making films</p>
                <p class="text-sm">+84 977319900</p>
                <p class="text-sm">nhatap@gmail.com</p>
            </div>
            <nav class="mt-4 md:mt-0 space-x-4 uppercase text-gray-300">
                <a href="#/" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': [ 'home', 'projects' ].includes(currentRoute.name) }">Projects</a>
                <a href="#/gallery" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': currentRoute.name === 'gallery' }">Gallery</a>
                <a href="#/blog" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': currentRoute.name === 'blog' }">Blog</a>
            </nav>
        </header>        
        <main class="mb-16 mt-4 md:pt-32 md:mt-0">
          <component 
            :is="currentRoute.view"
            :data="currentRoute.data" />
        </main>
      </template>
    `
  }

  
  
 
  
  