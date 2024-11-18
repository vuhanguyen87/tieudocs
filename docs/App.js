
  import { ref, reactive, markRaw, onMounted } from 'vue'
  import { LoadingScreen } from './components/LoadingScreen.js'
  // import Header from './components/Header.vue'
  import { Projects } from './pages/Projects.js'
  import { Project } from './pages/Project.js'
  // import ReelsSection from './components/ReelsSection.vue'
  // import ContactSection from './components/ContactSection.vue'
  
  export const App = {
    components: {
      'loading-screen': LoadingScreen,
    },
    setup(){
      const loading = ref(true)
      const config = ref(null)
      const currentRoute = ref({
        view: null,
        name: '',
        data: null
      })      
      
      async function fetchConfig(){
        try {
          const response = await fetch('config.json')
          config.value = await response.json()
        } catch (error) {
          console.error('Error fetching config:', error)
        }

        loading.value = false
      }

      
      function route(path) {
        const routeIndex = path.split('/')[1] || 'home'
        const routeParam = path.split('/')[2]

        switch (routeIndex) {
          case 'home':
            currentRoute.value = {
              view: markRaw(Projects),
              name: 'home',
              data: {
                projects: config.value.projects.filter((project) => {
                  return project.category == 'documentary'
                }),
                category: 'documentary'
              }
            }
            break
          case 'projects':
            currentRoute.value = {
              view: markRaw(Projects),
              name: 'projects',
              data: {
                projects: config.value.projects.filter((project) => {
                  return project.category == routeParam
                }),
                category: routeParam
              }
            }
            break
          case 'project':
            currentRoute.value = {
              view: markRaw(Project),
              name: 'project',
              data: config.value.projects.filter((project) => {
                return project.slug == routeParam
              })[0],
            }

            console.log(currentRoute.value)
            break
        }        
      }

      window.addEventListener('hashchange', () => {
        route(window.location.hash)
      })
      

      onMounted(async () => {
        await fetchConfig()
        route(window.location.hash)
      })

      return { loading, currentRoute, config }
    },
    template: `
    <loading-screen v-if="loading" />
    <template v-if="!loading">
        <header class="relative w-full text-center md:text-left">
            <div class="md:fixed">
                <p class="text-3xl uppercase">Pham Nhat Anh</p>
                <p class="text-md uppercase">A worker loves making films</p>
                <p class="text-sm">+84 977319900</p>
                <p class="text-sm">nhatap@gmail.com</p>
            </div>
            <nav class="mt-4 md:mt-0 md:fixed md:right-9 space-x-4 uppercase text-gray-300">
                <a href="#/" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': [ 'home', 'projects' ].includes(currentRoute.name) }">Projects</a>
                <a href="#/reels" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': currentRoute.name === 'reels' }">Reels</a>
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

  
  
 
  
  