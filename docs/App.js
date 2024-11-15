
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
      const currentRoute = reactive({
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
            currentRoute.view = markRaw(Projects),
            currentRoute.name = 'home',
            currentRoute.data = config.value.projects.filter((project) => {
                return project.category == 'documentary'
              })
            break
          case 'projects':
            currentRoute.view = markRaw(Projects),
            currentRoute.name = 'projects',
            currentRoute.data = config.value.projects.filter((project) => {
                return project.category == routeParam
              })
            break
          case 'project':
            currentRoute.view = markRaw(Project),
            currentRoute.name = 'project',
            currentRoute.data = config.value.projects[routeParam]
            break
        }        
      }

      window.addEventListener('hashchange', () => {
        route(window.location.hash)
        console.log(currentRoute.data)
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
        <header class="flex justify-between mb-8">
            <div>
                <p class="text-3xl uppercase">Nhật Anh</p>
                <p class="text-md uppercase">A worker loves making films</p>
                <p class="text-sm">📧 nhatap@gmail.com</p>
                <p class="text-sm">📱 +84 977319900</p>
            </div>
            <nav class="space-x-4 uppercase text-gray-300">
                <a href="#/" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': [ 'home', 'projects' ].includes(currentRoute.name) }">Projects</a>
                <a href="#/reels" 
                    class="hover:text-gray-100"
                    :class="{ 'text-white font-bold': currentRoute.name === 'reels' }">Reels</a>
            </nav>
        </header>        
        <main class="mb-16">
          <component 
            :is="currentRoute.view"
            :data="currentRoute.data" />
        </main>
      </template>
    `
  }

  
  
 
  
  